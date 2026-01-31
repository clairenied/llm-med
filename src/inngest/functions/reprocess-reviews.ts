import { inngest } from "../client";
import { db } from "../db";
import { extractReviews } from "../etl/extractors/reviews";
import { deduplicateReviews, formatFullName } from "../etl/transformers/helpers";

/**
 * Reprocess Reviews Function
 *
 * Triggered by: reviews.reprocess.requested
 * Purpose: Re-extract all reviews from stored f1000Document XML
 *
 * This function:
 * 1. Deletes all existing reviews (but keeps manuscripts and summaries)
 * 2. Re-extracts reviews from each f1000Document
 * 3. Creates new reviews with proper version tracking
 */
export const reprocessReviews = inngest.createFunction(
  {
    id: "reprocess-reviews",
    name: "Reprocess All Reviews",
  },
  { event: "reviews.reprocess.requested" },
  async ({ step }) => {
    // Step 1: Get count of existing reviews and documents
    const counts = await step.run("get-counts", async () => {
      const reviewCount = await db.review.count();
      const docCount = await db.f1000Document.count();
      return { reviewCount, docCount };
    });

    console.log(`📊 Found ${counts.reviewCount} existing reviews, ${counts.docCount} XML documents`);

    // Step 2: Delete all existing reviews
    await step.run("delete-existing-reviews", async () => {
      const deleted = await db.review.deleteMany({});
      console.log(`🗑️ Deleted ${deleted.count} existing reviews`);
      return deleted.count;
    });

    // Step 3: Get all f1000Documents with their manuscript info
    const documents = await step.run("fetch-documents", async () => {
      const docs = await db.f1000Document.findMany({
        select: {
          doi: true,
          xmlData: true,
        },
      });
      return docs.map(d => ({
        doi: d.doi,
        // Convert XML to string if needed
        xmlData: typeof d.xmlData === 'string' ? d.xmlData : String(d.xmlData),
      }));
    });

    console.log(`📄 Processing ${documents.length} documents`);

    // Step 4: Process each document and create reviews
    let totalReviewsCreated = 0;
    let documentsProcessed = 0;

    for (const doc of documents) {
      const result = await step.run(`process-${doc.doi}`, async () => {
        // Find the manuscript for this DOI
        const manuscriptSource = await db.manuscriptSource.findFirst({
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
          return { reviewsCreated: 0, skipped: true };
        }

        const manuscript = manuscriptSource.manuscript;
        const versionId = manuscript.versions[0]?.id;

        if (!versionId) {
          console.log(`⚠️ No version found for manuscript: ${manuscript.id}`);
          return { reviewsCreated: 0, skipped: true };
        }

        // Extract reviews from XML
        const extractedReviews = extractReviews(doc.xmlData);
        const uniqueReviews = deduplicateReviews(extractedReviews);

        let reviewsCreated = 0;

        for (const review of uniqueReviews) {
          // Find or create reviewer
          const fullName = formatFullName(review.reviewer.surname, review.reviewer.givenNames);

          let reviewer = await db.reviewer.findUnique({
            where: {
              name_affiliation: {
                name: fullName,
                affiliation: review.reviewer.affiliation || "",
              },
            },
          });

          if (!reviewer) {
            reviewer = await db.reviewer.create({
              data: {
                name: fullName,
                affiliation: review.reviewer.affiliation || "",
              },
            });
          }

          // Create review with version tracking
          await db.review.create({
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

        return { reviewsCreated, skipped: false };
      });

      totalReviewsCreated += result.reviewsCreated;
      documentsProcessed++;

      if (documentsProcessed % 20 === 0) {
        console.log(`📈 Progress: ${documentsProcessed}/${documents.length} docs, ${totalReviewsCreated} reviews created`);
      }
    }

    console.log(`✅ Reprocessing complete: ${totalReviewsCreated} reviews created from ${documentsProcessed} documents`);

    return {
      documentsProcessed,
      totalReviewsCreated,
      previousReviewCount: counts.reviewCount,
    };
  }
);
