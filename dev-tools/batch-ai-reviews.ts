import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const prisma = new PrismaClient();
const DEEPSEEK_REVIEWER_ID = "d78dac432c684fca87846d4c5";
const CONCURRENCY = 3;

const REVIEW_SYSTEM_PROMPT = `You are a senior academic peer reviewer with expertise in urology, clinical research methodology, and AI-assisted medical studies. You have reviewed for high-impact venues (e.g., clinical journals, medical AI conferences). Your reviews are precise, critical, evidence-grounded, and written in a professional academic tone.
You must:
Based all judgments strictly on the paper text provided
Write reviews that could realistically appear in top-tier peer review venues
Do not soften criticism.
Do not invent content.
Reviewer guidelines: 1. Thoroughly read the paper: make sure you read the entire paper and look up any related work and citations that will help you evaluate it in depth. Allow yourself enough time to complete this process properly.

Evaluate the paper STRICTLY using the rubric below.
Paper Summary [Provide a concise overview of the paper, summarizing its motivation, its objectives, research design and methodology, key findings, and main conclusions.] [100-150 words]
Strengths and weaknesses of the paper [Critically evaluate the strengths and weaknesses of the paper. Present them in two sections (-Strengths, -weaknesses) in bullet points and support each point with specific evidence or examples from the article whenever possible.] Consider aspects such as if it is applicable:
- The importance and relevance of the research questions (are the objectives well motivated?)
 - Clarity of the manuscript (Is the paper clearly written, logically organized, and easy to follow for its intended audience?)
 - Technical soundness and methodological correctness (Are the methods appropriate, theoretically justified, and implemented correctly without major technical flaws?)
- Experimental rigor and robustness of evaluation (Are the experiments well-designed, sufficiently controlled, and supported by appropriate analyses to justify the conclusions?)
- Novelty and contribution to the field (Does the study offer original insights, methods, or findings that meaningfully advance knowledge in the field?)
Paper decision [make a recommendation to: – Accept, - Minor Revision, - Major Revision, - Reject paper. It must include the Decision and the reason for the decision.]
Decision Calibration Rules:1. Recommend Reject if any of the following apply:
Major methodological flaw invalidating conclusions
Absence of statistical justification in studies involving numerical outcomes and multiple participants where statistical analysis is required (Note: Case reports and purely descriptive single-patient reports are exempt from this requirement)
No ethical approval when human subjects are involved
Claims unsupported by presented results
The study lacks sufficient novelty or meaningful contribution to the field (e.g., incremental replication without new insight, trivial application of existing AI methods without methodological or clinical advancement).
2. Recommend Major Revision if:
Core idea is valid, but experimental or statistical rigor is insufficient
Missing critical analyses that could change conclusions
Absence of statistical justification in studies involving numerical outcomes and multiple participants where statistical analysis is required (Note: Case reports and purely descriptive single-patient reports are exempt from this requirement)
Novelty is moderate but not clearly articulated, and the contribution could become meaningful with clearer positioning against prior literature.
Methodology appears generally appropriate but contains weaknesses that must be corrected before conclusions can be trusted.
3. Recommend Minor Revision if:
Conclusions are supported but clarity or reporting improvements are needed
Weaknesses are limited to clarity, reporting completeness, minor methodological clarifications, formatting, or presentation issues that do not undermine validity.
4. Recommend Accept only if:
The study addresses an important and well-motivated research question.
The methodology is technically sound and appropriate.
Statistical analyses are justified, correctly implemented, and transparently reported.
Claims are fully supported by the results.
Ethical standards are clearly documented when applicable.
The contribution is clearly novel and meaningfully advances knowledge in urology, clinical methodology, or AI-assisted medical research.

Suggestions for improvement [Provide constructive feedback intended to strengthen the manuscript. Clearly indicate that these suggestions are meant to support and improve the work and are not necessarily factors influencing your overall evaluation or decision.]

Write your review in markdown format. Your review contains the following sections:

# Paper Summary
# Strengths of the paper
# Weaknesses of the paper
# Paper decision
# Suggestions for improvements`;

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
  if (sections.length === 0) return stripTags(text).substring(0, 10000);
  return sections.join("\n\n").substring(0, 15000);
}

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

async function generateReview(manuscript: {
  id: string;
  title: string;
  abstract: string | null;
  sources: { doi: string | null }[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    let paperContent = `Title: ${manuscript.title}\n\n`;
    if (manuscript.abstract) paperContent += `Abstract: ${manuscript.abstract}\n\n`;

    if (manuscript.sources.length > 0 && manuscript.sources[0].doi) {
      const f1000Doc = await prisma.f1000Document.findUnique({
        where: { doi: manuscript.sources[0].doi },
      });
      if (f1000Doc) {
        paperContent += `Full Text:\n${extractTextFromXml(f1000Doc.xmlData)}\n`;
      }
    }

    if (!paperContent.trim()) {
      return { success: false, error: "No content" };
    }

    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: REVIEW_SYSTEM_PROMPT },
        { role: "user", content: `Review the following paper:\n\n${paperContent}` },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const review = completion.choices[0]?.message?.content;
    if (!review) return { success: false, error: "Empty response" };

    // Save to Manuscript.aiReview
    await prisma.manuscript.update({
      where: { id: manuscript.id },
      data: { aiReview: review, aiReviewGeneratedAt: new Date() },
    });

    // Create Review record
    const latestVersion = await prisma.manuscriptVersion.findFirst({
      where: { manuscriptId: manuscript.id },
      orderBy: { versionNumber: "desc" },
    });

    if (!latestVersion) return { success: false, error: "No version" };

    const existing = await prisma.review.findFirst({
      where: { versionId: latestVersion.id, reviewType: "AI_GENERATED" },
    });

    if (existing) {
      await prisma.review.update({ where: { id: existing.id }, data: { content: review } });
    } else {
      await prisma.review.create({
        data: {
          versionId: latestVersion.id,
          reviewerId: DEEPSEEK_REVIEWER_ID,
          reviewType: "AI_GENERATED",
          reviewedVersionNumber: latestVersion.versionNumber,
          content: review,
        },
      });
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

async function main() {
  // Find manuscripts without AI reviews
  const allManuscripts = await prisma.manuscript.findMany({
    select: {
      id: true,
      title: true,
      abstract: true,
      sources: { select: { doi: true }, take: 1 },
      versions: {
        select: { reviews: { where: { reviewType: "AI_GENERATED" }, select: { id: true } } },
      },
    },
  });

  const todo = allManuscripts.filter((m) => !m.versions.some((v) => v.reviews.length > 0));
  console.log(`${todo.length} manuscripts need AI reviews (${allManuscripts.length - todo.length} already done)\n`);

  if (todo.length === 0) {
    console.log("All done!");
    await prisma.$disconnect();
    return;
  }

  let completed = 0;
  let failed = 0;

  // Process in batches of CONCURRENCY
  for (let i = 0; i < todo.length; i += CONCURRENCY) {
    const batch = todo.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (m) => {
        const result = await generateReview(m);
        if (result.success) {
          completed++;
          console.log(`[${completed + failed}/${todo.length}] OK: ${m.title.substring(0, 70)}`);
        } else {
          failed++;
          console.log(`[${completed + failed}/${todo.length}] FAIL: ${m.title.substring(0, 50)} - ${result.error}`);
        }
        return result;
      })
    );
  }

  console.log(`\nDone. ${completed} succeeded, ${failed} failed.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
