import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupProductionFakeData() {
  console.log("🧹 PRODUCTION: Cleaning up fake/sample data...");
  console.log("===============================================");

  // Safety check - only run if we detect we're in production
  if (
    !process.env.DATABASE_URL?.includes("postgres") &&
    !process.env.DATABASE_URL?.includes("postgresql")
  ) {
    console.log(
      "❌ This script should only be run in production with a PostgreSQL database",
    );
    console.log("   Current DATABASE_URL does not appear to be PostgreSQL");
    process.exit(1);
  }

  try {
    // Get all manuscripts to see what we have
    const allManuscripts = await prisma.manuscript.findMany({
      include: {
        authors: true,
        sources: {
          include: {
            source: true,
          },
        },
      },
    });

    console.log(
      `\n📊 Current manuscripts in production database: ${allManuscripts.length}`,
    );

    // Identify fake data patterns
    const fakeManuscripts = allManuscripts.filter((manuscript) => {
      // Multiple criteria for identifying fake data:
      return (
        manuscript.sources.length === 0 || // No external sources
        manuscript.title.includes("Telemedicine on Rural Healthcare") ||
        manuscript.title.includes("Machine Learning Applications in Medical") ||
        manuscript.title.includes("Novel Approaches to Cardiovascular") ||
        manuscript.title.includes("Sample") ||
        manuscript.title.includes("Test") ||
        manuscript.title.includes("Demo") ||
        manuscript.abstract?.includes(
          "This research examines how telemedicine",
        ) ||
        manuscript.abstract?.includes(
          "comprehensive review of machine learning",
        ) ||
        manuscript.abstract?.includes("innovative therapeutic strategies")
      );
    });

    const realManuscripts = allManuscripts.filter(
      (manuscript) => !fakeManuscripts.includes(manuscript),
    );

    console.log(`\n🔍 Analysis:`);
    console.log(`   Real scraped articles: ${realManuscripts.length}`);
    console.log(`   Fake/sample articles: ${fakeManuscripts.length}`);

    if (fakeManuscripts.length > 0) {
      console.log(`\n❌ Fake/sample articles to be deleted:`);
      fakeManuscripts.forEach((manuscript, index) => {
        console.log(`   ${index + 1}. ${manuscript.title.substring(0, 80)}...`);
      });

      // Ask for confirmation in production
      console.log(
        `\n⚠️  WARNING: This will permanently delete ${fakeManuscripts.length} manuscripts from PRODUCTION!`,
      );
      console.log(
        `   Real articles (${realManuscripts.length}) will be preserved.`,
      );

      // In production, we want to be extra careful
      if (process.env.NODE_ENV === "production") {
        console.log(`\n🛑 PRODUCTION SAFETY: Automatic deletion disabled.`);
        console.log(
          `   To proceed, set CONFIRM_PRODUCTION_CLEANUP=true environment variable`,
        );

        if (process.env.CONFIRM_PRODUCTION_CLEANUP !== "true") {
          console.log(`   Exiting without making changes.`);
          process.exit(0);
        }
      }

      console.log(`\n🗑️  Deleting fake/sample data...`);

      // Delete fake manuscripts (this will cascade to related data)
      for (const manuscript of fakeManuscripts) {
        await prisma.manuscript.delete({
          where: { id: manuscript.id },
        });
        console.log(`   ✅ Deleted: ${manuscript.title.substring(0, 60)}...`);
      }
    }

    if (realManuscripts.length > 0) {
      console.log(`\n✅ Real scraped articles (preserved):`);
      realManuscripts.forEach((manuscript, index) => {
        const source = manuscript.sources[0]?.source?.name || "Unknown";
        console.log(
          `   ${index + 1}. ${manuscript.title.substring(0, 60)}... (from ${source})`,
        );
      });
    }

    // Clean up orphaned data
    const orphanedAuthors = await prisma.author.findMany({
      where: { manuscripts: { none: {} } },
    });

    if (orphanedAuthors.length > 0) {
      console.log(
        `\n🧹 Cleaning up ${orphanedAuthors.length} orphaned authors...`,
      );
      await prisma.author.deleteMany({
        where: { manuscripts: { none: {} } },
      });
      console.log(`   ✅ Deleted ${orphanedAuthors.length} orphaned authors`);
    }

    const orphanedReviewers = await prisma.reviewer.findMany({
      where: { reviews: { none: {} } },
    });

    if (orphanedReviewers.length > 0) {
      console.log(
        `\n🧹 Cleaning up ${orphanedReviewers.length} orphaned reviewers...`,
      );
      await prisma.reviewer.deleteMany({
        where: { reviews: { none: {} } },
      });
      console.log(
        `   ✅ Deleted ${orphanedReviewers.length} orphaned reviewers`,
      );
    }

    // Final count
    const finalCount = await prisma.manuscript.count();
    console.log(`\n🎉 Production cleanup complete!`);
    console.log(`   Final manuscript count: ${finalCount}`);
    console.log(
      `   All remaining articles are real scraped data from external sources`,
    );
  } catch (error) {
    console.error("❌ Error during production cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupProductionFakeData().catch((error) => {
  console.error("Production cleanup failed:", error);
  process.exit(1);
});
