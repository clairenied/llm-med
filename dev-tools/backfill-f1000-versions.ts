/**
 * Backfill older F1000 article versions for manuscripts whose stored paper text
 * is from a later revision than some reviews reference.
 *
 * Strategy: For each manuscript-version pair where a review exists but no
 * matching f1000Document is cached, derive the versioned DOI from the stored
 * DOI and fetch the XML from F1000Research's extapi. Persist as a new
 * f1000Document row keyed by versioned DOI.
 *
 * Usage:
 *   1. vercel env pull .env.production --environment=production --token=$VERCEL_TOKEN
 *   2. npx tsx dev-tools/backfill-f1000-versions.ts
 *
 * The export script later picks the right version's XML by DOI lookup.
 */

import { config } from "dotenv";
import path from "path";
import fs from "fs";
import crypto from "crypto";

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

const F1000_API = "https://f1000research.com/extapi/article/xml";

function deriveDoi(storedDoi: string, targetVersion: number): string | null {
  // Old format: 10.12688/f1000research.2-126.v2
  const m1 = storedDoi.match(/^(.+)\.v(\d+)$/);
  if (m1) return `${m1[1]}.v${targetVersion}`;
  // New format: 10.12688/f1000research.148191.2
  const m2 = storedDoi.match(/^(.+)\.(\d+)$/);
  if (m2) return `${m2[1]}.${targetVersion}`;
  return null;
}

async function fetchXml(doi: string): Promise<string> {
  const url = `${F1000_API}?doi=${encodeURIComponent(doi)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`F1000 ${res.status} for ${doi}`);
  }
  return res.text();
}

async function main() {
  console.log("Querying manuscripts with version mismatch...");

  // For each mismatched manuscript, get DOI, stored versionNumber, and all reviewed versions.
  const rows = await prisma.$queryRaw<
    Array<{
      id: string;
      stored_doi: string;
      stored_version: number;
      reviewed_versions: number[];
    }>
  >`
    SELECT m.id,
           ms.doi AS stored_doi,
           mv."versionNumber" AS stored_version,
           array_agg(DISTINCT r."reviewedVersionNumber" ORDER BY r."reviewedVersionNumber") AS reviewed_versions
    FROM "Manuscript" m
    JOIN "ManuscriptSource" ms ON ms."manuscriptId" = m.id
    JOIN "ManuscriptVersion" mv ON mv."manuscriptId" = m.id
    JOIN "Review" r ON r."versionId" = mv.id
    WHERE r."reviewedVersionNumber" IS NOT NULL
    GROUP BY m.id, ms.doi, mv."versionNumber"
    HAVING bool_or(r."reviewedVersionNumber" <> mv."versionNumber")
    ORDER BY m.id
  `;

  console.log(`Found ${rows.length} manuscripts with version mismatch`);

  const targets: Array<{
    manuscriptId: string;
    targetDoi: string;
    targetVersion: number;
  }> = [];
  const skipped: string[] = [];

  for (const row of rows) {
    for (const v of row.reviewed_versions) {
      if (v === row.stored_version) continue;
      const doi = deriveDoi(row.stored_doi, v);
      if (!doi) {
        skipped.push(`${row.id}: cannot derive DOI from ${row.stored_doi}`);
        continue;
      }
      targets.push({ manuscriptId: row.id, targetDoi: doi, targetVersion: v });
    }
  }

  console.log(`${targets.length} version-DOIs to consider`);
  if (skipped.length) {
    console.log("Skipped (DOI pattern unrecognized):");
    for (const s of skipped) console.log("  " + s);
  }

  // Filter out ones we already have cached
  const existing = await prisma.f1000Document.findMany({
    where: { doi: { in: targets.map((t) => t.targetDoi) } },
    select: { doi: true },
  });
  const have = new Set(existing.map((e) => e.doi));
  const toFetch = targets.filter((t) => !have.has(t.targetDoi));

  console.log(`Already cached: ${targets.length - toFetch.length}`);
  console.log(`To fetch: ${toFetch.length}`);

  let fetched = 0;
  let failed = 0;
  const failures: string[] = [];

  // F1000 rate limit is 100 req/60s. We're well under, but space them anyway.
  for (let i = 0; i < toFetch.length; i++) {
    const t = toFetch[i];
    try {
      const xml = await fetchXml(t.targetDoi);
      if (!xml.startsWith("<?xml") && !xml.includes("<article")) {
        throw new Error(`response doesn't look like article XML`);
      }
      const hash = crypto.createHash("sha256").update(xml).digest("hex");
      await prisma.f1000Document.upsert({
        where: { doi: t.targetDoi },
        create: { doi: t.targetDoi, xmlData: xml, hash },
        update: { xmlData: xml, hash },
      });
      fetched++;
      console.log(
        `  [${i + 1}/${toFetch.length}] ${t.targetDoi} (${xml.length} bytes)`,
      );
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      failures.push(`${t.targetDoi}: ${msg}`);
      console.log(`  [${i + 1}/${toFetch.length}] FAIL ${t.targetDoi} — ${msg}`);
    }
    await new Promise((r) => setTimeout(r, 700));
  }

  console.log(`\nFetched: ${fetched}, Failed: ${failed}`);
  if (failures.length) {
    console.log("Failures:");
    for (const f of failures) console.log("  " + f);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
