import { inngest } from "../client";
import { createEventMetadata } from "../events";
import { fetchArticleXml } from "../services/f1000-api";
import { db } from "../db";
import { createHash } from "crypto";

/**
 * F1000 Fetch Article Function
 *
 * Triggered by: f1000.article.fetch.requested
 * Purpose: Fetch article XML and save to f1000Document table
 *
 * This function:
 * 1. Fetches the article XML from F1000 API
 * 2. Calculates SHA256 hash of the XML
 * 3. Saves to f1000Document table (insert only)
 * 4. Emits f1000.article.saved or f1000.article.duplicate event
 *
 * Note: This function is fully idempotent. If the article already exists
 * (by DOI), we skip it and emit a duplicate event.
 */
export const f1000FetchArticle = inngest.createFunction(
  {
    id: "f1000-fetch-article",
    name: "F1000: Fetch Article",
    concurrency: {
      limit: 10, // Limit concurrent article fetches
    },
  },
  { event: "f1000.article.fetch.requested" },
  async ({ event, step }) => {
    const { doi, metadata } = event.data;
    const timestamp = metadata.timestamp;

    // Step 1: Fetch article XML
    const xmlData = await step.run("fetch-article-xml", async () => {
      return fetchArticleXml(doi);
    });

    // Step 2: Calculate SHA256 hash
    const hash = await step.run("calculate-hash", async () => {
      return createHash("sha256").update(xmlData).digest("hex");
    });

    // Step 3: Save to database (insert only)
    const result = await step.run("save-to-database", async () => {
      try {
        await db.f1000Document.create({
          data: {
            doi,
            xmlData,
            hash,
          },
        });
        return { saved: true, duplicate: false };
      } catch (error) {
        // Check if it's a duplicate key error
        if (
          error instanceof Error &&
          (error.message.includes("Unique constraint") ||
            error.message.includes("unique_violation"))
        ) {
          return { saved: false, duplicate: true };
        }
        throw error;
      }
    });

    // Step 4: Emit appropriate event
    await step.run("emit-result-event", async () => {
      if (result.saved) {
        await inngest.send({
          name: "f1000.article.saved",
          data: {
            doi,
            hash,
            metadata: createEventMetadata(
              "f1000-fetch-article",
              metadata.sessionId,
              metadata.correlationId,
              timestamp
            ),
          },
        });
      } else if (result.duplicate) {
        await inngest.send({
          name: "f1000.article.duplicate",
          data: {
            doi,
            hash,
            metadata: createEventMetadata(
              "f1000-fetch-article",
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
      hash,
      saved: result.saved,
      duplicate: result.duplicate,
    };
  }
);
