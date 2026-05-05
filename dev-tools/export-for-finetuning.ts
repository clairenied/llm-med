/**
 * Export manuscripts, reviews, and grades as JSONL for fine-tuning.
 *
 * Two output datasets:
 *   --mode=full         All reviews of all versions. Paper text is the version
 *                       each review was actually written about.
 *   --mode=ai-version   Only reviews (human + AI) of the version the AI also
 *                       reviewed (i.e. the latest version per manuscript).
 *                       Cleanest set for direct human-vs-AI comparison.
 *
 * Default: full.
 *
 * Usage:
 *   1. vercel env pull .env.production --environment=production --token=$VERCEL_TOKEN
 *   2. npx tsx dev-tools/export-for-finetuning.ts --mode=full
 *   3. npx tsx dev-tools/export-for-finetuning.ts --mode=ai-version
 *
 * Outputs (under dev-tools/export/<mode>/):
 *   - finetuning-data.jsonl       One row per review. Shareable.
 *   - anonymization-map.json      Maps anon ids → real users/reviewers. PRIVATE.
 *   - README.md                   Field documentation and caveats.
 */

import { config } from "dotenv";
import path from "path";
import fs from "fs";

const envPath = path.resolve(process.cwd(), ".env.production");
if (!fs.existsSync(envPath)) {
  console.error(`Missing ${envPath}. Pull production env first.`);
  process.exit(1);
}
config({ path: envPath, override: true });

import { PrismaClient } from "@prisma/client";

const directUrl =
  process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL;
if (!directUrl) {
  console.error("Missing POSTGRES_URL_NON_POOLING / DATABASE_URL");
  process.exit(1);
}
const prisma = new PrismaClient({
  datasources: { db: { url: directUrl } },
});

// ---------- CLI ----------

type Mode = "full" | "ai-version";
function parseMode(): Mode {
  const arg = process.argv.find((a) => a.startsWith("--mode="));
  const v = arg ? arg.split("=")[1] : "full";
  if (v !== "full" && v !== "ai-version") {
    console.error(`Invalid --mode=${v}. Use full or ai-version.`);
    process.exit(1);
  }
  return v;
}
const MODE: Mode = parseMode();

const OUTPUT_DIR = path.resolve(process.cwd(), "dev-tools/export", MODE);
const JSONL_PATH = path.join(OUTPUT_DIR, "finetuning-data.jsonl");
const ANON_MAP_PATH = path.join(OUTPUT_DIR, "anonymization-map.json");
const README_PATH = path.join(OUTPUT_DIR, "README.md");

// ---------- Helpers ----------

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractTextFromXml(xmlData: string): string {
  const text = xmlData.replace(/<\?[^>]+\?>/g, "");
  const sections: string[] = [];
  const abstractMatch = text.match(/<abstract[^>]*>([\s\S]*?)<\/abstract>/i);
  if (abstractMatch) sections.push("Abstract: " + stripTags(abstractMatch[1]));
  const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) sections.push("Content: " + stripTags(bodyMatch[1]));
  if (sections.length === 0) return stripTags(text);
  return sections.join("\n\n");
}

/**
 * Given a manuscript's stored (latest) DOI, derive the versioned DOI for any
 * version number. Two F1000 DOI patterns exist:
 *   Old: 10.12688/f1000research.2-126.v2  → base + ".v" + N
 *   New: 10.12688/f1000research.148191.2  → base + "." + N
 */
function deriveVersionedDoi(
  storedDoi: string,
  targetVersion: number,
): string | null {
  const m1 = storedDoi.match(/^(.+)\.v(\d+)$/);
  if (m1) return `${m1[1]}.v${targetVersion}`;
  const m2 = storedDoi.match(/^(.+)\.(\d+)$/);
  if (m2) return `${m2[1]}.${targetVersion}`;
  return null;
}

class Anonymizer {
  private readonly prefix: string;
  private readonly map = new Map<string, string>();
  private next = 1;
  constructor(prefix: string) {
    this.prefix = prefix;
  }
  get(realId: string): string {
    const existing = this.map.get(realId);
    if (existing) return existing;
    const anon = `${this.prefix}_${String(this.next).padStart(3, "0")}`;
    this.map.set(realId, anon);
    this.next++;
    return anon;
  }
  entries(): Array<[string, string]> {
    return Array.from(this.map.entries());
  }
}

// ---------- Main ----------

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Mode: ${MODE}`);
  console.log("Listing manuscript IDs...");
  const manuscriptIds = await prisma.manuscript.findMany({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  console.log(`  ${manuscriptIds.length} manuscripts to process`);

  const reviewerAnon = new Anonymizer("reviewer");
  const graderAnon = new Anonymizer("grader");

  const reviewerMeta: Record<
    string,
    { name: string; email: string | null; affiliation: string | null }
  > = {};
  const graderMeta: Record<
    string,
    { name: string | null; email: string; role: string }
  > = {};

  const out = fs.createWriteStream(JSONL_PATH, { encoding: "utf-8" });
  let rowCount = 0;
  let aiRowCount = 0;
  let humanRowCount = 0;
  let textResolvedCount = 0;
  let textMissingCount = 0;
  const xmlCache = new Map<string, string>(); // doi -> extracted paper text

  for (let i = 0; i < manuscriptIds.length; i++) {
    const { id: manuscriptId } = manuscriptIds[i];
    const m = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: {
        sources: { select: { doi: true, url: true, articleType: true } },
        versions: {
          include: {
            reviews: {
              include: {
                reviewer: true,
                grades: { include: { grader: true } },
              },
            },
          },
        },
      },
    });
    if (!m) continue;

    if ((i + 1) % 25 === 0 || i === manuscriptIds.length - 1) {
      console.log(`  [${i + 1}/${manuscriptIds.length}] processed`);
    }

    const storedDoi = m.sources[0]?.doi ?? null;

    // Determine the version that the AI reviewed for this manuscript.
    // (AI reviews were generated against the latest version. If multiple AI
    // reviews exist, pick the highest reviewedVersionNumber.)
    let aiReviewedVersion: number | null = null;
    for (const v of m.versions) {
      for (const r of v.reviews) {
        if (
          r.reviewType === "AI_GENERATED" &&
          r.reviewedVersionNumber != null
        ) {
          if (
            aiReviewedVersion == null ||
            r.reviewedVersionNumber > aiReviewedVersion
          ) {
            aiReviewedVersion = r.reviewedVersionNumber;
          }
        }
      }
    }

    // Stored manuscript-level version label (may be inaccurate; we resolve text
    // per-review by DOI rather than relying on this).
    const paperVersionStored = m.versions[0]?.versionNumber ?? null;

    const reviewRoundsForManuscript = new Set<number>();
    for (const v of m.versions) {
      for (const r of v.reviews) {
        if (r.reviewedVersionNumber != null) {
          reviewRoundsForManuscript.add(r.reviewedVersionNumber);
        }
      }
    }

    for (const v of m.versions) {
      for (const r of v.reviews) {
        // ai-version mode: skip reviews of any version other than the one AI saw.
        if (MODE === "ai-version") {
          if (aiReviewedVersion == null) continue; // no AI review for this paper
          if (r.reviewedVersionNumber !== aiReviewedVersion) continue;
        }

        // Resolve paper text for THIS review's reviewed version.
        let paperText: string | null = null;
        let paperTextDoi: string | null = null;
        if (storedDoi && r.reviewedVersionNumber != null) {
          const targetDoi = deriveVersionedDoi(
            storedDoi,
            r.reviewedVersionNumber,
          );
          if (targetDoi) {
            if (xmlCache.has(targetDoi)) {
              paperText = xmlCache.get(targetDoi)!;
              paperTextDoi = targetDoi;
            } else {
              const f1000 = await prisma.f1000Document.findUnique({
                where: { doi: targetDoi },
              });
              if (f1000) {
                const extracted = extractTextFromXml(f1000.xmlData);
                xmlCache.set(targetDoi, extracted);
                paperText = extracted;
                paperTextDoi = targetDoi;
              }
            }
          }
        }

        if (paperText) {
          textResolvedCount++;
        } else {
          textMissingCount++;
        }

        const reviewerAnonId = reviewerAnon.get(r.reviewer.id);
        if (!reviewerMeta[reviewerAnonId]) {
          reviewerMeta[reviewerAnonId] = {
            name: r.reviewer.name,
            email: r.reviewer.email,
            affiliation: r.reviewer.affiliation,
          };
        }

        const grades = r.grades.map((g) => {
          const graderAnonId = graderAnon.get(g.grader.id);
          if (!graderMeta[graderAnonId]) {
            graderMeta[graderAnonId] = {
              name: g.grader.name,
              email: g.grader.email,
              role: g.grader.role,
            };
          }
          return {
            grader_id: graderAnonId,
            clinical_relevance: g.clinicalRelevance,
            methodology: g.methodology,
            results: g.results,
            writing_clarity: g.writingClarity,
            ethical_considerations: g.ethicalConsiderations,
            notes: g.notes,
            graded_at: g.createdAt.toISOString(),
          };
        });

        const reviewType =
          r.reviewType === "AI_GENERATED" ? "AI_GENERATED" : "HUMAN";

        const row = {
          manuscript_id: m.id,
          title: m.title,
          abstract: m.abstract,
          paper_text: paperText,
          paper_text_doi: paperTextDoi, // exact DOI the paper text came from
          paper_version_stored: paperVersionStored,
          source: m.sources[0]
            ? {
                doi: m.sources[0].doi,
                url: m.sources[0].url,
                article_type: m.sources[0].articleType,
              }
            : null,
          manuscript_review_rounds: reviewRoundsForManuscript.size,
          ai_reviewed_version: aiReviewedVersion,
          review: {
            id: r.id,
            type: reviewType,
            reviewed_version: r.reviewedVersionNumber,
            reviewer_id: reviewerAnonId,
            content: r.content,
            created_at: r.createdAt.toISOString(),
          },
          paper_text_matches_review: paperText != null,
          grades,
        };

        out.write(JSON.stringify(row) + "\n");
        rowCount++;
        if (reviewType === "AI_GENERATED") aiRowCount++;
        else humanRowCount++;
      }
    }
  }

  await new Promise<void>((resolve) => out.end(resolve));

  fs.writeFileSync(
    ANON_MAP_PATH,
    JSON.stringify(
      {
        warning:
          "PRIVATE — do not share. Maps anonymous IDs back to real reviewer/grader identities.",
        reviewers: Object.fromEntries(
          reviewerAnon
            .entries()
            .map(([realId, anonId]) => [
              anonId,
              { real_id: realId, ...reviewerMeta[anonId] },
            ]),
        ),
        graders: Object.fromEntries(
          graderAnon
            .entries()
            .map(([realId, anonId]) => [
              anonId,
              { real_id: realId, ...graderMeta[anonId] },
            ]),
        ),
      },
      null,
      2,
    ),
  );

  fs.writeFileSync(
    README_PATH,
    buildReadme({
      mode: MODE,
      rowCount,
      aiRowCount,
      humanRowCount,
      textResolved: textResolvedCount,
      textMissing: textMissingCount,
      reviewerCount: reviewerAnon.entries().length,
      graderCount: graderAnon.entries().length,
    }),
  );

  console.log(`\nWrote ${rowCount} rows to ${JSONL_PATH}`);
  console.log(`  HUMAN reviews: ${humanRowCount}`);
  console.log(`  AI_GENERATED reviews: ${aiRowCount}`);
  console.log(
    `  Paper text resolved for ${textResolvedCount}/${rowCount} reviews`,
  );
  console.log(`  Paper text missing for ${textMissingCount}/${rowCount} reviews`);
  console.log(`  Reviewers anonymized: ${reviewerAnon.entries().length}`);
  console.log(`  Graders anonymized: ${graderAnon.entries().length}`);
  console.log(`Anonymization map (PRIVATE): ${ANON_MAP_PATH}`);
  console.log(`README: ${README_PATH}`);

  await prisma.$disconnect();
}

function buildReadme(opts: {
  mode: Mode;
  rowCount: number;
  aiRowCount: number;
  humanRowCount: number;
  textResolved: number;
  textMissing: number;
  reviewerCount: number;
  graderCount: number;
}): string {
  const modeBlurb =
    opts.mode === "full"
      ? `**Full dataset.** Includes every review of every manuscript revision (v1, v2, v3, ...). For each review, \`paper_text\` is resolved to the specific version that review was actually written about.`
      : `**AI-version dataset.** Includes only reviews — both human and AI-generated — that were written about the version of the manuscript the AI also reviewed. This is the cleanest subset for direct human-vs-AI comparison: every row's paper text and review are aligned on the same revision.`;

  return `# Manuscript review fine-tuning dataset (${opts.mode})

${modeBlurb}

One JSONL file with ${opts.rowCount} rows. Each row is a single review (human or AI-generated) of a manuscript, with the paper text and all human grades of that review.

## Files

- \`finetuning-data.jsonl\` — the dataset (this file, shareable).
- \`README.md\` — this file.
- \`anonymization-map.json\` — **PRIVATE.** Maps anonymous IDs back to real identities. Do not share.

## Counts

- ${opts.rowCount} reviews total
  - ${opts.humanRowCount} human reviews
  - ${opts.aiRowCount} AI-generated reviews
- ${opts.textResolved} reviews with resolved paper text${opts.textMissing > 0 ? `\n- ${opts.textMissing} reviews missing paper text` : ""}
- ${opts.reviewerCount} unique reviewers (anonymized)
- ${opts.graderCount} unique graders (anonymized)

## Row schema

\`\`\`json
{
  "manuscript_id": "string",
  "title": "string",
  "abstract": "string | null",
  "paper_text": "string | null",
  "paper_text_doi": "string | null",
  "paper_version_stored": 1,
  "source": {
    "doi": "string | null",
    "url": "string",
    "article_type": "string | null"
  },
  "manuscript_review_rounds": 1,
  "ai_reviewed_version": 2,
  "review": {
    "id": "string",
    "type": "HUMAN | AI_GENERATED",
    "reviewed_version": 1,
    "reviewer_id": "reviewer_NNN",
    "content": "markdown string",
    "created_at": "ISO 8601"
  },
  "paper_text_matches_review": true,
  "grades": [
    {
      "grader_id": "grader_NNN",
      "clinical_relevance": "VERY_GOOD | GOOD | POOR | VERY_POOR | NA | null",
      "methodology": "...",
      "results": "...",
      "writing_clarity": "...",
      "ethical_considerations": "...",
      "notes": "string | null",
      "graded_at": "ISO 8601"
    }
  ]
}
\`\`\`

### Field notes

- **\`paper_text\`** — extracted from the F1000Research JATS XML for the **exact version** the review was written about (abstract + body, tags stripped).
- **\`paper_text_doi\`** — the DOI of the paper version \`paper_text\` was extracted from. Useful for verification.
- **\`review.reviewed_version\`** — which manuscript revision (1, 2, 3, ...) this review was written about.
- **\`ai_reviewed_version\`** — the version of the manuscript that the AI reviewer saw and reviewed. In AI-version mode, every row's \`reviewed_version\` equals this.
- **\`paper_text_matches_review\`** — true if paper text was successfully resolved for the reviewed version.
- **\`grades\`** — every entry is a human grade. Same grader has a stable \`grader_NNN\` ID across rows. Two graders per review is the target; some have 0, 1, or 3.

## Important caveats

### 1. All grades are human-given

Every entry in \`grades[]\` was assigned by a human grader, regardless of whether they were grading a HUMAN or AI_GENERATED review.

### 2. Grade scale

Grade values are ordinal: \`VERY_GOOD\` > \`GOOD\` > \`POOR\` > \`VERY_POOR\`. \`NA\` means the grader judged the category not applicable to this review. \`null\` means unscored.

### 3. AI reviews

AI-generated reviews (\`type: "AI_GENERATED"\`) were generated using DeepSeek with the prompt in \`llm-prompts/PromptForReviews2.docx\`. Output is markdown with sections: Paper Summary, Strengths, Weaknesses, Paper decision, Suggestions.

### 4. Anonymization

Reviewer and grader identities are replaced with stable anonymous IDs (\`reviewer_NNN\`, \`grader_NNN\`). The mapping back to real identities lives in \`anonymization-map.json\`, which is **private** and must not be shared with the dataset.

## Suggested training subsets

| Goal | Filter |
|------|--------|
| Generate a peer review from a paper | \`type == "HUMAN"\` and \`paper_text_matches_review\` |
| Predict review quality from review text | All rows where \`grades\` is non-empty |
| Compare AI vs human reviews of the same paper | Use the \`ai-version\` dataset; group by \`manuscript_id\` |
| Mimic a specific reviewer | Group by \`review.reviewer_id\` |
`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
