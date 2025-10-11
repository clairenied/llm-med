import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanupFakeData() {
  console.log("🧹 Cleaning up fake/sample data...");
  console.log("=====================================");

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
      `\n📊 Current manuscripts in database: ${allManuscripts.length}`,
    );

    // Identify fake data (manuscripts without external sources)
    const fakeManuscripts = allManuscripts.filter(
      (manuscript) => manuscript.sources.length === 0, // No external sources = fake/sample data
    );

    const realManuscripts = allManuscripts.filter(
      (manuscript) => manuscript.sources.length > 0, // Has external sources = real scraped data
    );

    console.log(`\n🔍 Analysis:`);
    console.log(`   Real scraped articles: ${realManuscripts.length}`);
    console.log(`   Fake/sample articles: ${fakeManuscripts.length}`);

    if (fakeManuscripts.length > 0) {
      console.log(`\n❌ Fake/sample articles to be deleted:`);
      fakeManuscripts.forEach((manuscript, index) => {
        console.log(`   ${index + 1}. ${manuscript.title}`);
      });

      console.log(`\n🗑️  Deleting fake/sample data...`);

      // Delete fake manuscripts (this will cascade to related data)
      for (const manuscript of fakeManuscripts) {
        await prisma.manuscript.delete({
          where: { id: manuscript.id },
        });
        console.log(`   ✅ Deleted: ${manuscript.title}`);
      }
    }

    if (realManuscripts.length > 0) {
      console.log(`\n✅ Real scraped articles (keeping):`);
      realManuscripts.forEach((manuscript, index) => {
        const source = manuscript.sources[0]?.source?.name || "Unknown";
        console.log(`   ${index + 1}. ${manuscript.title} (from ${source})`);
      });
    }

    // Clean up orphaned authors (authors not linked to any manuscripts)
    const orphanedAuthors = await prisma.author.findMany({
      where: {
        manuscripts: {
          none: {},
        },
      },
    });

    if (orphanedAuthors.length > 0) {
      console.log(
        `\n🧹 Cleaning up ${orphanedAuthors.length} orphaned authors...`,
      );
      await prisma.author.deleteMany({
        where: {
          manuscripts: {
            none: {},
          },
        },
      });
      console.log(`   ✅ Deleted ${orphanedAuthors.length} orphaned authors`);
    }

    // Clean up orphaned reviewers (reviewers not linked to any reviews)
    const orphanedReviewers = await prisma.reviewer.findMany({
      where: {
        reviews: {
          none: {},
        },
      },
    });

    if (orphanedReviewers.length > 0) {
      console.log(
        `\n🧹 Cleaning up ${orphanedReviewers.length} orphaned reviewers...`,
      );
      await prisma.reviewer.deleteMany({
        where: {
          reviews: {
            none: {},
          },
        },
      });
      console.log(
        `   ✅ Deleted ${orphanedReviewers.length} orphaned reviewers`,
      );
    }

    // Final count
    const finalCount = await prisma.manuscript.count();
    console.log(`\n🎉 Cleanup complete!`);
    console.log(`   Final manuscript count: ${finalCount}`);
    console.log(
      `   All remaining articles are real scraped data from external sources`,
    );
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanupFakeData().catch((error) => {
  console.error("Cleanup failed:", error);
  process.exit(1);
});
