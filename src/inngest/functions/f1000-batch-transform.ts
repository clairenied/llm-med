import { inngest } from "../client";
import { createEventMetadata } from "../events";
import { db, transaction } from "../db";
import { extractDocument } from "../etl/extractors";
import { transformDocument } from "../etl/transformers";
import { bulkLoadManuscripts } from "../etl/loaders/bulk-loader";

/**
 * F1000 Batch Transform Function
 *
 * Triggered by: f1000.batch.transform.requested
 * Purpose: Process all unprocessed F1000 documents in chunks
 *
 * This function:
 * 1. Finds all f1000Document records
 * 2. Filters out already-processed documents (by checking ManuscriptSource)
 * 3. Processes documents in chunks of 20
 * 4. For each chunk: extract → transform → bulk insert
 *
 * This approach minimizes database queries by batching operations
 */
export const f1000BatchTransform = inngest.createFunction(
  {
    id: "f1000-batch-transform",
    name: "F1000: Batch Transform",
  },
  { event: "f1000.batch.transform.requested" },
  async ({ event, step }) => {
    const { metadata } = event.data;
    const timestamp = metadata.timestamp;

    const CHUNK_SIZE = 20; // Process 20 documents at a time

    // Step 1: Fetch all f1000Document DOIs (not XML to avoid output_too_large)
    const allDocuments = await step.run("fetch-all-documents", async () => {
      return await db.f1000Document.findMany({
        select: {
          doi: true,
          hash: true,
        },
      });
    });

    // Step 2: Get F1000Research source ID
    const sourceId = await step.run("get-source-id", async () => {
      const source = await db.source.findUnique({
        where: { name: "F1000Research" },
      });

      if (!source) {
        throw new Error("F1000Research source not found in database");
      }

      return source.id;
    });

    // Step 3: Filter out already-processed documents
    const unprocessedDocs = await step.run("filter-unprocessed", async () => {
      const dois = allDocuments.map((doc) => doc.doi);

      // Find all existing ManuscriptSource records with these DOIs
      const existingSources = await db.manuscriptSource.findMany({
        where: {
          doi: {
            in: dois,
          },
        },
        select: {
          doi: true,
        },
      });

      const processedDois = new Set(existingSources.map((s) => s.doi));

      // Return documents that haven't been processed yet
      return allDocuments.filter((doc) => !processedDois.has(doc.doi));
    });

    let totalManuscriptsCreated = 0;
    let totalAuthorsCreated = 0;
    let totalReviewersCreated = 0;
    let totalReviewsCreated = 0;
    let totalSkipped = 0;

    // Step 4: Process documents in chunks
    const numChunks = Math.ceil(unprocessedDocs.length / CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < numChunks; chunkIndex++) {
      const chunkStart = chunkIndex * CHUNK_SIZE;
      const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, unprocessedDocs.length);
      const chunk = unprocessedDocs.slice(chunkStart, chunkEnd);

      const chunkResult = await step.run(`process-chunk-${chunkIndex}`, async () => {
        // Fetch XML for this chunk only
        const chunkDois = chunk.map((doc) => doc.doi);
        const docsWithXml = await db.f1000Document.findMany({
          where: { doi: { in: chunkDois } },
          select: { doi: true, xmlData: true },
        });

        // Extract all documents in chunk
        const extracted = docsWithXml.map((doc) => ({
          doi: doc.doi,
          data: extractDocument(doc.xmlData),
        }));

        // Transform all documents in chunk
        const transformed = extracted.map((e) => ({
          doi: e.doi,
          data: transformDocument(e.data, sourceId),
        }));

        // Bulk load all manuscripts in chunk within a transaction
        return await transaction(async (tx) => {
          return await bulkLoadManuscripts(transformed, tx);
        });
      });

      totalManuscriptsCreated += chunkResult.manuscriptsCreated;
      totalAuthorsCreated += chunkResult.authorsCreated;
      totalReviewersCreated += chunkResult.reviewersCreated;
      totalReviewsCreated += chunkResult.reviewsCreated;
      totalSkipped += chunkResult.skipped;
    }

    // Step 5: Emit completion event
    await step.run("emit-completion-event", async () => {
      await inngest.send({
        name: "f1000.batch.transform.completed",
        data: {
          totalDocuments: allDocuments.length,
          unprocessedDocuments: unprocessedDocs.length,
          metadata: createEventMetadata(
            "f1000-batch-transform",
            metadata.sessionId,
            metadata.correlationId,
            timestamp
          ),
        },
      });
    });

    return {
      totalDocuments: allDocuments.length,
      unprocessedDocuments: unprocessedDocs.length,
      alreadyProcessed: allDocuments.length - unprocessedDocs.length,
      manuscriptsCreated: totalManuscriptsCreated,
      authorsCreated: totalAuthorsCreated,
      reviewersCreated: totalReviewersCreated,
      reviewsCreated: totalReviewsCreated,
      skipped: totalSkipped,
      chunksProcessed: numChunks,
    };
  }
);
