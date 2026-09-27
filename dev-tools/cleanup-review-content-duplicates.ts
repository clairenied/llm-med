/**
 * Detect and remove accidentally duplicated review-content suffixes.
 *
 * Dry-run is the default:
 *   npx tsx dev-tools/cleanup-review-content-duplicates.ts
 *
 * Apply changes atomically after writing a private JSONL backup:
 *   npx tsx dev-tools/cleanup-review-content-duplicates.ts --apply
 *
 * The tool reads .env.production and prefers a non-pooling database URL.
 */

import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { Client } from "pg";

export const MIN_REPEATED_LINE_LENGTH = 150;
export const MIN_TOTAL_REPEATED_CHARS = 500;
export const MIN_CLEANED_CONTENT_LENGTH = 50;

export interface DuplicateAnalysis {
  boundary: number;
  cleaned: string;
  duplicatedLineCount: number;
  duplicatedCharacterCount: number;
}

/**
 * Find a repeated suffix conservatively. Repeated lines are counted once even
 * if they occur multiple times in the source text.
 */
export function analyzeDuplicateSuffix(
  content: string,
): DuplicateAnalysis | null {
  const uniqueLines = new Set(
    content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length >= MIN_REPEATED_LINE_LENGTH),
  );

  let boundary = content.length;
  const duplicatedLines: string[] = [];

  for (const line of uniqueLines) {
    const first = content.indexOf(line);
    const second = content.indexOf(line, first + line.length);
    if (second === -1) continue;
    duplicatedLines.push(line);
    boundary = Math.min(boundary, second);
  }

  const duplicatedCharacterCount = duplicatedLines.reduce(
    (sum, line) => sum + line.length,
    0,
  );
  if (
    duplicatedLines.length < 2 &&
    duplicatedCharacterCount <= MIN_TOTAL_REPEATED_CHARS
  ) {
    return null;
  }

  const cleaned = content.slice(0, boundary).trimEnd();
  if (cleaned.length < MIN_CLEANED_CONTENT_LENGTH) return null;

  return {
    boundary,
    cleaned,
    duplicatedLineCount: duplicatedLines.length,
    duplicatedCharacterCount,
  };
}

interface ReviewRow {
  id: string;
  reviewer_name: string;
  manuscript_title: string;
  content: string;
}

interface PlannedChange extends ReviewRow {
  cleaned: string;
  duplicatedLineCount: number;
  duplicatedCharacterCount: number;
}

function timestampForFilename(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeBackup(changes: PlannedChange[]): string {
  const backupDir = path.resolve(
    process.cwd(),
    "dev-tools",
    "backups",
  );
  fs.mkdirSync(backupDir, { recursive: true });
  const backupPath = path.join(
    backupDir,
    `review-content-cleanup-${timestampForFilename()}.jsonl`,
  );
  const body = changes
    .map((change) =>
      JSON.stringify({
        id: change.id,
        reviewer_name: change.reviewer_name,
        manuscript_title: change.manuscript_title,
        original_content: change.content,
        proposed_content: change.cleaned,
      }),
    )
    .join("\n");
  fs.writeFileSync(backupPath, `${body}\n`, { encoding: "utf8", mode: 0o600 });
  return backupPath;
}

async function applyChanges(
  client: Client,
  changes: PlannedChange[],
): Promise<void> {
  await client.query("BEGIN");
  try {
    for (const change of changes) {
      const result = await client.query(
        `UPDATE "Review"
         SET content = $1, "updatedAt" = NOW()
         WHERE id = $2 AND content = $3`,
        [change.cleaned, change.id, change.content],
      );
      if (result.rowCount !== 1) {
        throw new Error(
          `Review ${change.id} changed after analysis; no updates were committed.`,
        );
      }
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

async function main(): Promise<void> {
  const apply = process.argv.includes("--apply");
  const unknownArgs = process.argv.slice(2).filter((arg) => arg !== "--apply");
  if (unknownArgs.length > 0) {
    throw new Error(`Unknown argument(s): ${unknownArgs.join(", ")}`);
  }

  const envPath = path.resolve(process.cwd(), ".env.production");
  if (!fs.existsSync(envPath)) {
    throw new Error(`Missing ${envPath}`);
  }
  config({ path: envPath, override: true });
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Missing POSTGRES_URL_NON_POOLING / DATABASE_URL");
  }

  const client = new Client({ connectionString });
  await client.connect();
  try {
    const result = await client.query<ReviewRow>(`
      SELECT r.id,
             rv.name AS reviewer_name,
             m.title AS manuscript_title,
             r.content
      FROM "Review" r
      JOIN "Reviewer" rv ON r."reviewerId" = rv.id
      JOIN "ManuscriptVersion" mv ON r."versionId" = mv.id
      JOIN "Manuscript" m ON mv."manuscriptId" = m.id
      ORDER BY m.title, rv.name
    `);

    const changes: PlannedChange[] = [];
    for (const row of result.rows) {
      const analysis = analyzeDuplicateSuffix(row.content);
      if (!analysis) continue;
      changes.push({
        ...row,
        cleaned: analysis.cleaned,
        duplicatedLineCount: analysis.duplicatedLineCount,
        duplicatedCharacterCount: analysis.duplicatedCharacterCount,
      });
    }

    console.log(`${apply ? "APPLY" : "DRY RUN"}: scanned ${result.rows.length} reviews`);
    for (const change of changes) {
      console.log(
        `${change.id}: ${change.content.length} -> ${change.cleaned.length} chars; ` +
          `${change.duplicatedLineCount} repeated lines (${change.reviewer_name}; ` +
          `${change.manuscript_title.slice(0, 60)})`,
      );
    }
    console.log(`${changes.length} review(s) ${apply ? "to update" : "would be updated"}.`);

    if (!apply || changes.length === 0) return;

    const backupPath = writeBackup(changes);
    console.log(`Private backup written before updates: ${backupPath}`);
    await applyChanges(client, changes);
    console.log(`Committed ${changes.length} review update(s) atomically.`);
  } finally {
    await client.end();
  }
}

if (process.argv[1]?.endsWith("cleanup-review-content-duplicates.ts")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
