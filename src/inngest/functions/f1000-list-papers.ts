import { inngest } from "../client";
import { createEventMetadata } from "../events";
import { listPapers } from "../services/f1000-api";

/**
 * F1000 List Papers Function
 *
 * Triggered by: f1000.list.requested
 * Purpose: List all papers for a given subject and emit fetch events for each DOI
 *
 * This function:
 * 1. Fetches the first page to determine total pages
 * 2. Fetches remaining pages in parallel with concurrency control
 * 3. Emits f1000.article.fetch.requested for each DOI found
 * 4. Emits f1000.list.completed when done
 */
export const f1000ListPapers = inngest.createFunction(
  {
    id: "f1000-list-papers",
    name: "F1000: List Papers",
    concurrency: {
      limit: 5, // Limit concurrent page fetches
    },
  },
  { event: "f1000.list.requested" },
  async ({ event, step }) => {
    const { subject, metadata } = event.data;
    const timestamp = metadata.timestamp;

    // Step 1: Fetch first page to determine total pages
    const firstPage = await step.run("fetch-first-page", async () => {
      return listPapers(subject, 1);
    });

    const { dois: firstPageDois, totalNumberOfPages } = firstPage;
    const allDois: string[] = [...firstPageDois];

    // Step 2: Fetch remaining pages in parallel if there are more pages
    if (totalNumberOfPages > 1) {
      const remainingPages = Array.from(
        { length: totalNumberOfPages - 1 },
        (_, i) => i + 2 // Pages 2 through totalNumberOfPages
      );

      const remainingDois = await step.run("fetch-remaining-pages", async () => {
        // Fetch all remaining pages in parallel
        const results = await Promise.all(
          remainingPages.map((page) => listPapers(subject, page))
        );

        // Flatten all DOIs from all pages
        return results.flatMap((result) => result.dois);
      });

      allDois.push(...remainingDois);
    }

    // Step 3: Emit fetch events for each DOI
    await step.run("emit-fetch-events", async () => {
      const events = allDois.map((doi) => ({
        name: "f1000.article.fetch.requested" as const,
        data: {
          doi,
          metadata: createEventMetadata(
            "f1000-list-papers",
            metadata.sessionId,
            metadata.correlationId,
            timestamp
          ),
        },
      }));

      // Emit all events in batches to avoid overwhelming the system
      const batchSize = 50;
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize);
        await inngest.send(batch);
      }

      return allDois.length;
    });

    // Step 4: Emit completion event
    await step.run("emit-completion-event", async () => {
      await inngest.send({
        name: "f1000.list.completed",
        data: {
          subject,
          totalDoisFound: allDois.length,
          metadata: createEventMetadata(
            "f1000-list-papers",
            metadata.sessionId,
            metadata.correlationId,
            timestamp
          ),
        },
      });
    });

    return {
      subject,
      totalPages: totalNumberOfPages,
      totalDoisFound: allDois.length,
    };
  }
);
