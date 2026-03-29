import { inngest } from "../client";
import { db } from "../db";
import { generateManuscriptReview } from "@/lib/deepseek";

// DeepSeek AI reviewer ID (created in production)
const DEEPSEEK_REVIEWER_ID = "d78dac432c684fca87846d4c5";

/**
 * Generate AI Review for a Single Manuscript
 *
 * Calls DeepSeek to generate a review, saves it as both:
 * - Manuscript.aiReview (raw JSON for reference)
 * - Review record (formatted text for grading)
 */
export const generateAiReview = inngest.createFunction(
  {
    id: "generate-ai-review",
    name: "Generate AI Review",
    concurrency: {
      limit: 3, // Limit concurrent DeepSeek API calls
    },
    retries: 2,
  },
  { event: "manuscript.review.ai.requested" },
  async ({ event, step }) => {
    const { manuscriptId } = event.data;

    // Step 1: Generate the review via DeepSeek
    const result = await step.run("generate-review", async () => {
      return await generateManuscriptReview(manuscriptId);
    });

    if (!result.success || !result.review) {
      return {
        manuscriptId,
        success: false,
        error: result.error,
      };
    }

    // Step 2: Create a Review record for the grading queue
    const reviewRecord = await step.run("create-review-record", async () => {
      // Find the latest version of this manuscript
      const latestVersion = await db.manuscriptVersion.findFirst({
        where: { manuscriptId },
        orderBy: { versionNumber: "desc" },
      });

      if (!latestVersion) {
        throw new Error(`No version found for manuscript ${manuscriptId}`);
      }

      // Check if an AI review already exists for this version
      const existing = await db.review.findFirst({
        where: {
          versionId: latestVersion.id,
          reviewType: "AI_GENERATED",
        },
      });

      if (existing) {
        // Update existing review content
        return db.review.update({
          where: { id: existing.id },
          data: {
            content: result.review as string,
          },
        });
      }

      // Create new Review record
      return db.review.create({
        data: {
          versionId: latestVersion.id,
          reviewerId: DEEPSEEK_REVIEWER_ID,
          reviewType: "AI_GENERATED",
          reviewedVersionNumber: latestVersion.versionNumber,
          content: result.review as string,
        },
      });
    });

    return {
      manuscriptId,
      reviewId: reviewRecord.id,
      success: true,
    };
  }
);

/**
 * Batch Generate AI Reviews for All Manuscripts
 *
 * Finds manuscripts without AI_GENERATED reviews and queues them
 */
export const batchGenerateAiReviews = inngest.createFunction(
  {
    id: "batch-generate-ai-reviews",
    name: "Batch Generate AI Reviews",
  },
  { event: "manuscript.reviews.ai.batch.requested" },
  async ({ step }) => {
    // Find manuscripts that don't have an AI_GENERATED review
    const manuscriptsToProcess = await step.run("find-manuscripts-without-ai-reviews", async () => {
      const manuscripts = await db.manuscript.findMany({
        select: {
          id: true,
          title: true,
          versions: {
            select: {
              reviews: {
                where: { reviewType: "AI_GENERATED" },
                select: { id: true },
              },
            },
          },
        },
      });

      // Filter to manuscripts with no AI review
      return manuscripts
        .filter((m) => !m.versions.some((v) => v.reviews.length > 0))
        .map((m) => ({ id: m.id, title: m.title }));
    });

    if (manuscriptsToProcess.length === 0) {
      return {
        message: "All manuscripts already have AI reviews",
        processed: 0,
      };
    }

    console.log(`🤖 Found ${manuscriptsToProcess.length} manuscripts without AI reviews`);

    // Queue individual generation events
    await step.run("queue-ai-review-generation", async () => {
      const events = manuscriptsToProcess.map((manuscript) => ({
        name: "manuscript.review.ai.requested" as const,
        data: {
          manuscriptId: manuscript.id,
          title: manuscript.title,
        },
      }));

      const batchSize = 50;
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize);
        await inngest.send(batch);
        console.log(`📤 Queued batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(events.length / batchSize)}`);
      }
    });

    return {
      message: `Queued ${manuscriptsToProcess.length} manuscripts for AI review generation`,
      processed: manuscriptsToProcess.length,
    };
  }
);
