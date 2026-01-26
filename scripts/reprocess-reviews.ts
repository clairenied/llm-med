/**
 * Reprocess Reviews Script
 *
 * Run with: npx tsx scripts/reprocess-reviews.ts
 */

import { PrismaClient } from "@prisma/client";
import { extractReviews } from "../src/inngest/etl/extractors/reviews";
import { deduplicateReviews, formatFullName } from "../src/inngest/etl/transformers/helpers";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Starting review reprocessing...\n");

  // Get all f1000Documents
  const documents = await prisma.f1000Document.findMany({
    select: {
      doi: true,
      xmlData: true,
    },
  });

  console.log(`📄 Found ${documents.length} XML documents to process\n`);

  let totalReviewsCreated = 0;
  let documentsProcessed = 0;
  let documentsSkipped = 0;

  for (const doc of documents) {
    // Find the manuscript for this DOI
    const manuscriptSource = await prisma.manuscriptSource.findFirst({
      where: { doi: doc.doi },
      include: {
        manuscript: {
          include: {
            versions: true,
          },
        },
      },
    });

    if (!manuscriptSource?.manuscript) {
      console.log(`⚠️ No manuscript found for DOI: ${doc.doi}`);
      documentsSkipped++;
      continue;
    }

    const manuscript = manuscriptSource.manuscript;
    const versionId = manuscript.versions[0]?.id;

    if (!versionId) {
      console.log(`⚠️ No version found for manuscript: ${manuscript.id}`);
      documentsSkipped++;
      continue;
    }

    // Extract reviews from XML
    const xmlString = typeof doc.xmlData === 'string' ? doc.xmlData : String(doc.xmlData);
    const extractedReviews = extractReviews(xmlString);
    const uniqueReviews = deduplicateReviews(extractedReviews);

    let reviewsCreated = 0;

    for (const review of uniqueReviews) {
      // Find or create reviewer
      const fullName = formatFullName(review.reviewer.surname, review.reviewer.givenNames);

      let reviewer = await prisma.reviewer.findUnique({
        where: {
          name_affiliation: {
            name: fullName,
            affiliation: review.reviewer.affiliation || "",
          },
        },
      });

      if (!reviewer) {
        reviewer = await prisma.reviewer.create({
          data: {
            name: fullName,
            affiliation: review.reviewer.affiliation || "",
          },
        });
      }

      // Check if this review already exists (prevent duplicates on re-run)
      const existingReview = await prisma.review.findFirst({
        where: {
          versionId,
          reviewerId: reviewer.id,
          reviewedVersionNumber: review.reviewedVersionNumber,
        },
      });

      if (existingReview) {
        // Review already exists, skip
        continue;
      }

      // Create review with version tracking
      await prisma.review.create({
        data: {
          versionId,
          reviewerId: reviewer.id,
          reviewType: "EXTERNAL",
          reviewedVersionNumber: review.reviewedVersionNumber,
          content: review.content,
          documentType: "FREE_TEXT",
        },
      });

      reviewsCreated++;
    }

    totalReviewsCreated += reviewsCreated;
    documentsProcessed++;

    if (documentsProcessed % 20 === 0) {
      console.log(`📈 Progress: ${documentsProcessed}/${documents.length} docs, ${totalReviewsCreated} reviews created`);
    }
  }

  console.log(`\n✅ Reprocessing complete!`);
  console.log(`   Documents processed: ${documentsProcessed}`);
  console.log(`   Documents skipped: ${documentsSkipped}`);
  console.log(`   Total reviews created: ${totalReviewsCreated}`);

  // Show distribution of reviewedVersionNumber
  const versionDistribution = await prisma.review.groupBy({
    by: ['reviewedVersionNumber'],
    _count: true,
    orderBy: {
      reviewedVersionNumber: 'asc',
    },
  });

  console.log(`\n📊 Reviews by version:`);
  for (const v of versionDistribution) {
    console.log(`   Version ${v.reviewedVersionNumber ?? 'unknown'}: ${v._count} reviews`);
  }
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
