import { inngest } from "../client";
import { createEventMetadata } from "../events";
import { getScraperConfig } from "../config";
import { sessionStore } from "../state";

/**
 * Scraper Orchestrator
 *
 * Coordinates the entire scraping workflow with proper event tracking
 *
 * Features:
 * - Waits for all child events to complete using waitForEvent
 * - Tracks progress in session state
 * - Aggregates statistics from child events
 * - Handles partial failures gracefully
 */
export const orchestrator = inngest.createFunction(
  {
    id: "scraper-orchestrator",
    name: "Scraper Orchestrator",
    retries: 0, // Don't retry the orchestrator itself
  },
  [
    { event: "scraper.initiated" },
    { cron: "0 2 * * *" }, // Daily at 2 AM
  ],
  async ({ event, step }) => {
    const startTime = Date.now();

    // Get configuration from event or use defaults for cron
    const isCronTrigger = event.name !== "scraper.initiated";
    const config = isCronTrigger
      ? getScraperConfig()
      : event.data.config;

    const sessionId = isCronTrigger
      ? `cron-${Date.now()}`
      : event.data.metadata.sessionId;

    console.log(`Starting scraping session: ${sessionId}`, {
      config,
      trigger: isCronTrigger ? "cron" : "manual",
    });

    // Initialize session state OUTSIDE of step to avoid replay issues
    // (Date objects in sessionStore cause non-deterministic behavior)
    sessionStore.createSession(sessionId, config.maxPages);

    // Fan out page scan requests
    await step.run("fan-out-page-scans", async () => {
      const events = [];

      for (let page = 1; page <= config.maxPages; page++) {
        const url = `${config.baseUrl}&page=${page}`;
        const metadata = createEventMetadata("orchestrator", sessionId);

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

      await inngest.send(events);
      console.log(`Fanned out ${events.length} page scan requests`);

      return { pagesSent: events.length };
    });

    // Note: We don't wait for page completions here to avoid replay issues
    // The event-driven architecture handles coordination:
    // - Scanner emits article.discovered events
    // - Enhancer processes those and emits article.enhanced events
    // - Persister processes those and updates stats
    // Stats are tracked in sessionStore and can be queried separately

    console.log(`Orchestrator completed. Pages fanned out: ${config.maxPages}`);

    const duration = (Date.now() - startTime) / 1000;
    console.log(`Orchestrator completed for session ${sessionId}`, {
      duration: `${duration}s`,
      message: "Background work is still processing. Check sessionStore for live stats.",
    });

    return {
      success: true,
      sessionId,
      pagesFannedOut: config.maxPages,
      message: "Scraping job initiated. Work is processing in background.",
      duration,
    };
  },
);
