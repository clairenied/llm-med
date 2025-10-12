import { inngest } from "../client";
import { createEventMetadata } from "../events";
import { SCRAPING_HEADERS } from "../config";
import { parseArticlesFromHtml } from "../utils";
import { sessionStore } from "../state";
import { isPageScanRequested } from "../guards";

/**
 * Page Scanner Function
 *
 * Fetches and parses listing pages to discover articles
 *
 * Features:
 * - Automatic retries with exponential backoff
 * - Concurrency limiting to avoid overwhelming the server
 * - Duplicate detection within the same page
 * - Emits article.discovered events for downstream processing
 */
const scannerFunction = inngest.createFunction(
  {
    id: "page-scanner",
    name: "Page Scanner",
    concurrency: {
      limit: 2, // Conservative limit to prevent OOM
    },
    retries: 1, // Reduced from defaultConfig.maxRetries to minimize replays
    onFailure: async ({ event, error }) => {
      if (isPageScanRequested(event)) {
        const { pageNumber, metadata } = event.data;
        const { sessionId } = metadata;

        console.error(`Page ${pageNumber} failed after all retries:`, error);

        // Update session state
        try {
          sessionStore.addError(
            sessionId,
            "page-scanner",
            error.message,
            { pageNumber },
          );
        } catch (e) {
          console.error("Failed to update session state:", e);
        }

        // Emit failure event
        await inngest.send({
          name: "page.scan.failed",
          data: {
            pageNumber,
            error: error.message,
            metadata: createEventMetadata(
              "page-scanner",
              sessionId,
              metadata.correlationId,
              metadata.timestamp, // Reuse timestamp for determinism
            ),
          },
        });
      }
    },
  },
  { event: "page.scan.requested" },
  async ({ event, step }) => {
    // Type guard to ensure we have the right event
    if (!isPageScanRequested(event)) {
      throw new Error("Invalid event type for page scanner");
    }

    const { pageNumber, url, metadata } = event.data;
    const { sessionId } = metadata;

    console.log(`Scanning page ${pageNumber}: ${url}`);

    // Fetch and parse page HTML in a single atomic step
    const html = await step.run("fetch-and-extract-html", async () => {
      const response = await fetch(url, { headers: SCRAPING_HEADERS });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} for page ${pageNumber}`,
        );
      }

      return await response.text();
    });

    // Parse articles from HTML
    const articles = await step.run("parse-articles", async () => {
      const articles = parseArticlesFromHtml(html);
      console.log(`Found ${articles.length} articles on page ${pageNumber}`);
      return articles;
    });

    // Emit article.discovered events using step.sendEvent() - the Inngest way
    if (articles.length > 0) {
      for (let i = 0; i < articles.length; i++) {
        await step.sendEvent(`emit-discovered-${pageNumber}-${i}`, {
          name: "article.discovered",
          data: {
            article: articles[i],
            pageNumber,
            metadata: createEventMetadata(
              "page-scanner",
              sessionId,
              metadata.correlationId,
              metadata.timestamp, // Reuse timestamp for determinism
            ),
          },
        });
      }
      console.log(
        `Emitted ${articles.length} article.discovered events for page ${pageNumber}`,
      );
    }

    // Emit page completion event using step.sendEvent() - replay-safe
    await step.sendEvent("emit-page-completed", {
      name: "page.scan.completed",
      data: {
        pageNumber,
        articlesFound: articles.length,
        metadata: createEventMetadata(
          "page-scanner",
          sessionId,
          metadata.correlationId,
          metadata.timestamp, // Reuse timestamp for determinism
        ),
      },
    });

    return {
      success: true,
      pageNumber,
      articlesFound: articles.length,
    };
  },
);

export const scanner = scannerFunction;
