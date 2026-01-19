import { inngest } from "../client";
import { createEventMetadata } from "../events";
import { db, transaction } from "../db";
import { extractDocument } from "../etl/extractors";
import { transformDocument } from "../etl/transformers";
import { loadManuscriptIdempotent } from "../etl/loaders/manuscript-loader";

/**
 * F1000 Transform Article Function
 *
 * Triggered by: f1000.article.saved
 * Purpose: Extract, transform, and load F1000 XML into relational schema
 *
 * This function:
 * 1. Fetches the XML from f1000Document table
 * 2. Extracts data using Cheerio-based extractors
 * 3. Transforms data to Prisma schema structures
 * 4. Loads data into database (Manuscript, Authors, Reviewers, Reviews)
 * 5. Emits f1000.article.transformed event
 *
 * Note: This function is idempotent - it skips articles already in the database
 */
export const f1000TransformArticle = inngest.createFunction(
  {
    id: "f1000-transform-article",
    name: "F1000: Transform Article",
    concurrency: {
      limit: 5, // Process up to 5 articles in parallel
    },
  },
  { event: "f1000.article.saved" },
  async ({ event, step }) => {
    const { doi, metadata } = event.data;
    const timestamp = metadata.timestamp;

    // Step 1: Fetch XML from f1000Document table
    const document = await step.run("fetch-xml-document", async () => {
      const doc = await db.f1000Document.findUnique({
        where: { doi },
      });

      if (!doc) {
        throw new Error(`Document not found for DOI: ${doi}`);
      }

      return doc;
    });

    // Step 2: Extract data from XML
    const extracted = await step.run("extract-data", async () => {
      return extractDocument(document.xmlData);
    }) as any; // Inngest serializes data, so types change

    // Step 3: Get F1000Research source ID
    const sourceId = await step.run("get-source-id", async () => {
      const source = await db.source.findUnique({
        where: { name: "F1000Research" },
      });

      if (!source) {
        throw new Error("F1000Research source not found in database");
      }

      return source.id;
    });

    // Step 4: Transform data
    const transformed = await step.run("transform-data", async () => {
      return transformDocument(extracted, sourceId);
    }) as any; // Inngest serializes data, so types change

    // Step 5: Load data into database in a transaction
    const result = await step.run("load-to-database-v2", async () => {
      return await transaction(async (tx) => {
        return await loadManuscriptIdempotent(transformed, doi, tx);
      });
    });

    // Step 6: Queue summary generation if manuscript was created
    if (!result.skipped && result.manuscriptId) {
      await step.run("queue-summary-generation", async () => {
        await inngest.send({
          name: "manuscript.summary.requested",
          data: {
            manuscriptId: result.manuscriptId,
          },
        });
        console.log(`📝 Queued summary generation for manuscript: ${result.manuscriptId}`);
      });
    }

    // Step 7: Emit result event
    await step.run("emit-result-event", async () => {
      if (result.skipped) {
        await inngest.send({
          name: "f1000.article.transform.skipped",
          data: {
            doi,
            reason: result.reason,
            metadata: createEventMetadata(
              "f1000-transform-article",
              metadata.sessionId,
              metadata.correlationId,
              timestamp
            ),
          },
        });
      } else {
        await inngest.send({
          name: "f1000.article.transformed",
          data: {
            doi,
            manuscriptId: result.manuscriptId,
            authorsCreated: result.authorsCreated,
            reviewsCreated: result.reviewsCreated,
            metadata: createEventMetadata(
              "f1000-transform-article",
              metadata.sessionId,
              metadata.correlationId,
              timestamp
            ),
          },
        });
      }
    });

    return {
      doi,
      ...result,
    };
  }
);
