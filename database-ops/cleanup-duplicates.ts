#!/usr/bin/env tsx

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DuplicateGroup {
  title: string;
  manuscripts: Array<{
    id: string;
    title: string;
    createdAt: Date;
    sources: Array<{ url: string; sourceId: string }>;
  }>;
}

class DuplicateCleanup {
  private duplicatesFound = 0;
  private duplicatesRemoved = 0;

  async run(): Promise<void> {
    console.log("🧹 Starting duplicate cleanup...");

    try {
      // Find duplicates by title
      await this.findAndCleanTitleDuplicates();

      // Find duplicates by URL
      await this.findAndCleanUrlDuplicates();

      console.log("\n" + "=".repeat(60));
      console.log("📊 DUPLICATE CLEANUP SUMMARY");
      console.log("=".repeat(60));
      console.log(`🔍 Duplicates found: ${this.duplicatesFound}`);
      console.log(`🗑️  Duplicates removed: ${this.duplicatesRemoved}`);
      console.log("=".repeat(60));
    } catch (error) {
      console.error("❌ Duplicate cleanup failed:", error);
      throw error;
    }
  }

  private async findAndCleanTitleDuplicates(): Promise<void> {
    console.log("\n🔍 Finding title-based duplicates...");

    // Group manuscripts by normalized title
    const manuscripts = await prisma.manuscript.findMany({
      include: {
        sources: {
          select: { url: true, sourceId: true },
        },
      },
      orderBy: { createdAt: "asc" }, // Keep the oldest one
    });

    const titleGroups = new Map<string, typeof manuscripts>();

    for (const manuscript of manuscripts) {
      const normalizedTitle = this.normalizeTitle(manuscript.title);

      if (!titleGroups.has(normalizedTitle)) {
        titleGroups.set(normalizedTitle, []);
      }
      titleGroups.get(normalizedTitle)!.push(manuscript);
    }

    // Process groups with duplicates
    for (const [normalizedTitle, group] of titleGroups) {
      if (group.length > 1) {
        console.log(
          `\n📝 Found ${group.length} duplicates for: "${group[0].title.substring(0, 50)}..."`,
        );
        this.duplicatesFound += group.length - 1;

        // Keep the first (oldest) manuscript, remove the rest
        const [keeper, ...duplicates] = group;

        for (const duplicate of duplicates) {
          console.log(`   🗑️  Removing duplicate: ${duplicate.id}`);
          await this.removeDuplicate(duplicate.id);
          this.duplicatesRemoved++;
        }
      }
    }
  }

  private async findAndCleanUrlDuplicates(): Promise<void> {
    console.log("\n🔗 Finding URL-based duplicates...");

    // Find manuscripts that share the same source URL
    const sources = await prisma.manuscriptSource.findMany({
      include: {
        manuscript: {
          select: { id: true, title: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const urlGroups = new Map<string, typeof sources>();

    for (const source of sources) {
      const normalizedUrl = this.normalizeUrl(source.url);

      if (!urlGroups.has(normalizedUrl)) {
        urlGroups.set(normalizedUrl, []);
      }
      urlGroups.get(normalizedUrl)!.push(source);
    }

    // Process groups with duplicates
    for (const [normalizedUrl, group] of urlGroups) {
      if (group.length > 1) {
        console.log(
          `\n🔗 Found ${group.length} manuscripts with same URL: "${normalizedUrl.substring(0, 50)}..."`,
        );

        // Group by manuscript ID to avoid removing sources from the same manuscript
        const manuscriptGroups = new Map<string, typeof group>();
        for (const source of group) {
          const manuscriptId = source.manuscript.id;
          if (!manuscriptGroups.has(manuscriptId)) {
            manuscriptGroups.set(manuscriptId, []);
          }
          manuscriptGroups.get(manuscriptId)!.push(source);
        }

        // If multiple manuscripts share the same URL, keep the oldest
        const uniqueManuscripts = Array.from(manuscriptGroups.keys());
        if (uniqueManuscripts.length > 1) {
          const manuscripts = await prisma.manuscript.findMany({
            where: { id: { in: uniqueManuscripts } },
            orderBy: { createdAt: "asc" },
          });

          const [keeper, ...duplicates] = manuscripts;

          for (const duplicate of duplicates) {
            console.log(
              `   🗑️  Removing URL duplicate manuscript: ${duplicate.id}`,
            );
            await this.removeDuplicate(duplicate.id);
            this.duplicatesRemoved++;
          }
        }
      }
    }
  }

  private async removeDuplicate(manuscriptId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Delete reviews first (cascade should handle this, but being explicit)
      await tx.review.deleteMany({
        where: {
          version: {
            manuscriptId: manuscriptId,
          },
        },
      });

      // Delete versions
      await tx.manuscriptVersion.deleteMany({
        where: { manuscriptId: manuscriptId },
      });

      // Delete sources
      await tx.manuscriptSource.deleteMany({
        where: { manuscriptId: manuscriptId },
      });

      // Delete authors (they will be automatically disconnected due to the many-to-many relationship)
      // No need to explicitly delete authors as they may be associated with other manuscripts

      // Finally delete the manuscript
      await tx.manuscript.delete({
        where: { id: manuscriptId },
      });
    });
  }

  private normalizeTitle(title: string): string {
    return (
      title
        .toLowerCase()
        .trim()
        // Remove extra whitespace
        .replace(/\s+/g, " ")
        // Remove common punctuation variations
        .replace(/[""'']/g, '"')
        .replace(/[–—]/g, "-")
        // Remove trailing punctuation that might vary
        .replace(/[.!?]+$/, "")
    );
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Normalize protocol to https
      urlObj.protocol = "https:";
      // Remove trailing slash
      urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
      // Remove common tracking parameters
      urlObj.searchParams.delete("utm_source");
      urlObj.searchParams.delete("utm_medium");
      urlObj.searchParams.delete("utm_campaign");
      urlObj.searchParams.delete("ref");
      return urlObj.toString();
    } catch {
      // If URL parsing fails, just clean up basic issues
      return url
        .replace(/^http:/, "https:")
        .replace(/\/$/, "")
        .toLowerCase();
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    console.log(`
Usage: tsx scripts/cleanup-duplicates.ts [options]

Options:
  --help            Show this help message

This script will:
1. Find manuscripts with identical or very similar titles
2. Find manuscripts with identical URLs
3. Keep the oldest manuscript in each duplicate group
4. Remove all other duplicates

⚠️  WARNING: This operation is destructive and cannot be undone!
Make sure to backup your database before running this script.
    `);
    process.exit(0);
  }

  // Confirmation prompt
  console.log(
    "⚠️  WARNING: This will permanently delete duplicate manuscripts!",
  );
  console.log("Make sure you have a database backup before proceeding.");
  console.log("");

  try {
    const cleanup = new DuplicateCleanup();
    await cleanup.run();
    console.log("\n🎉 Duplicate cleanup completed successfully!");
  } catch (error) {
    console.error("\n💥 Duplicate cleanup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { DuplicateCleanup };
