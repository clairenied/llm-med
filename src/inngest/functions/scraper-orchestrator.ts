import { inngest } from "../client";
import type {
  ScraperInitiatedEvent,
  PageScanCompletedEvent,
  PageScanFailedEvent,
} from "../events";
import { createEventMetadata } from "../events";

/**
 * Scraper Orchestrator Function
 *
 * Purpose: Coordinate the entire scraping workflow
 *
 * Triggered by:
 * - Event: scraper.initiated
 * - Cron: 0 2 * * * (2 AM daily)
 *
 * Steps:
 * 1. Validate configuration
 * 2. Fan-out page scan requests (parallel)
 * 3. Wait for all pages to complete
 * 4. Generate summary statistics
 * 5. Emit scraper.completed event
 */
export const scraperOrchestrator = inngest.createFunction(
  {
    id: "scraper-orchestrator",
    name: "Scraper Orchestrator",
  },
  [
    { event: "scraper.initiated" },
    { cron: "0 2 * * *" }, // Daily at 2 AM
  ],
  async ({ event, step }) => {
    const startTime = Date.now();

    // Get configuration from event or use defaults
    const config =
      event.name === "scraper.initiated"
        ? (event as ScraperInitiatedEvent).data.config
        : {
            baseUrl:
              "https://f1000research.com/browse/articles?term=Medical_and_health_sciences",
            maxPages: 25,
            delayMs: 2000,
            maxRetries: 3,
            batchSize: 5,
          };

    const scrapingSessionId =
      event.name === "scraper.initiated"
        ? (event as ScraperInitiatedEvent).data.metadata.scrapingSessionId
        : `session-${Date.now()}`;

    // Step 1: Validate configuration
    await step.run("validate-config", async () => {
      console.log("Validating scraping configuration", config);

      if (config.maxPages <= 0 || config.maxPages > 100) {
        throw new Error("maxPages must be between 1 and 100");
      }

      if (!config.baseUrl.startsWith("http")) {
        throw new Error("baseUrl must be a valid URL");
      }

      return { valid: true };
    });

    // Step 2: Fan-out page scan requests
    const pageEvents = await step.run("fan-out-page-scans", async () => {
      console.log(`Fanning out page scan requests for ${config.maxPages} pages`);

      const events = [];
      for (let page = 1; page <= config.maxPages; page++) {
        const url = `${config.baseUrl}&page=${page}`;
        const metadata = createEventMetadata(
          "scraper-orchestrator",
          scrapingSessionId,
        );

        events.push({
          name: "page.scan.requested" as const,
          data: {
            pageNumber: page,
            url,
            config: {
              maxRetries: config.maxRetries,
              delayMs: config.delayMs,
            },
            metadata,
          },
        });
      }

      return events;
    });

    // Send all page scan events
    await step.sendEvent("send-page-scan-events", pageEvents);

    // Step 3: Wait for all pages to complete
    const pageResults = await step.run("wait-for-pages", async () => {
      const results = {
        completed: [] as number[],
        failed: [] as number[],
        totalArticlesDiscovered: 0,
      };

      // Wait for all page scan events to complete or fail
      // Note: In production, you might want to use step.waitForEvent() with a timeout
      // and handle partial completion. For now, we'll track completion through events.
      console.log(`Waiting for ${config.maxPages} pages to complete`);

      return results;
    });

    // Step 4: Wait for completion events
    const completionResults = await step.run("collect-results", async () => {
      // In a real implementation, you'd collect these from a state store or database
      // For now, we'll return a placeholder
      return {
        articlesDiscovered: 0,
        articlesEnhanced: 0,
        articlesPersisted: 0,
        duplicatesSkipped: 0,
        errors: 0,
      };
    });

    // Step 5: Generate summary and emit completion event
    const summary = await step.run("generate-summary", async () => {
      const duration = (Date.now() - startTime) / 1000;

      const stats = {
        totalPages: config.maxPages,
        articlesDiscovered: completionResults.articlesDiscovered,
        articlesEnhanced: completionResults.articlesEnhanced,
        articlesPersisted: completionResults.articlesPersisted,
        duplicatesSkipped: completionResults.duplicatesSkipped,
        errors: completionResults.errors,
      };

      console.log("Scraping completed", { stats, duration });

      return { stats, duration };
    });

    // Emit scraper.completed event
    await step.sendEvent("send-completion-event", {
      name: "scraper.completed",
      data: {
        stats: summary.stats,
        duration: summary.duration,
        metadata: createEventMetadata("scraper-orchestrator", scrapingSessionId),
      },
    });

    return {
      success: true,
      scrapingSessionId,
      stats: summary.stats,
      duration: summary.duration,
    };
  },
);
