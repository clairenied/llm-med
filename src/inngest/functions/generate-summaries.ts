import { inngest } from "../client";
import { db } from "../db";
import { generateManuscriptSummary } from "@/lib/deepseek";

/**
 * Generate Summary for Single Manuscript
 *
 * Triggered by: manuscript.summary.requested
 * Purpose: Generate AI summary for a single manuscript
 */
export const generateSummary = inngest.createFunction(
  {
    id: "generate-summary",
    name: "Generate Manuscript Summary",
    concurrency: {
      limit: 3, // Limit concurrent API calls to DeepSeek
    },
    retries: 2,
  },
  { event: "manuscript.summary.requested" },
  async ({ event, step }) => {
    const { manuscriptId } = event.data;

    const result = await step.run("generate-summary", async () => {
      return await generateManuscriptSummary(manuscriptId);
    });

    return {
      manuscriptId,
      success: result.success,
      error: result.error,
    };
  }
);

/**
 * Batch Generate Summaries for All Manuscripts
 *
 * Triggered by: manuscript.summaries.batch.requested
 * Purpose: Find all manuscripts without summaries and queue them for generation
 */
export const batchGenerateSummaries = inngest.createFunction(
  {
    id: "batch-generate-summaries",
    name: "Batch Generate Manuscript Summaries",
  },
  { event: "manuscript.summaries.batch.requested" },
  async ({ step }) => {
    // Step 1: Find manuscripts without summaries
    const manuscriptsToProcess = await step.run("find-manuscripts-without-summaries", async () => {
      const manuscripts = await db.manuscript.findMany({
        where: {
          aiSummary: null,
        },
        select: {
          id: true,
          title: true,
        },
      });
      return manuscripts;
    });

    if (manuscriptsToProcess.length === 0) {
      return {
        message: "All manuscripts already have summaries",
        processed: 0,
      };
    }

    console.log(`📚 Found ${manuscriptsToProcess.length} manuscripts without summaries`);

    // Step 2: Queue individual summary generation for each manuscript
    await step.run("queue-summary-generation", async () => {
      const events = manuscriptsToProcess.map((manuscript) => ({
        name: "manuscript.summary.requested" as const,
        data: {
          manuscriptId: manuscript.id,
          title: manuscript.title,
        },
      }));

      // Send events in batches of 50 to avoid overwhelming the system
      const batchSize = 50;
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize);
        await inngest.send(batch);
        console.log(`📤 Queued batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(events.length / batchSize)}`);
      }
    });

    return {
      message: `Queued ${manuscriptsToProcess.length} manuscripts for summary generation`,
      processed: manuscriptsToProcess.length,
    };
  }
);
