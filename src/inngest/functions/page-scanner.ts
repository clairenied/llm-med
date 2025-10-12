import { inngest } from "../client";
import type { PageScanRequestedEvent } from "../events";
import { createEventMetadata } from "../events";
import { SCRAPING_HEADERS, parseArticlesFromHtml } from "../scraper-utils";

/**
 * Page Scanner Function
 *
 * Purpose: Fetch and parse a single listing page to discover articles
 *
 * Triggered by: page.scan.requested event
 *
 * Steps:
 * 1. Fetch page HTML with retries and exponential backoff
 * 2. Parse HTML to extract article URLs and basic metadata
 * 3. Emit article.discovered event for each article found
 * 4. Emit page.scan.completed event with statistics
 *
 * Concurrency: Max 3 simultaneous pages
 * Retry Strategy: 3 attempts with exponential backoff (1s, 2s, 4s)
 */
export const pageScanner = inngest.createFunction(
  {
    id: "page-scanner",
    name: "Page Scanner",
    concurrency: {
      limit: 3, // Max 3 pages being scanned simultaneously
    },
    retries: 3,
  },
  { event: "page.scan.requested" },
  async ({ event, step }) => {
    const { pageNumber, url, config, metadata } = (
      event as PageScanRequestedEvent
    ).data;

    console.log(`Starting page scan for page ${pageNumber}: ${url}`);

    // Step 1: Fetch page HTML with retries
    const html = await step.run("fetch-page-html", async () => {
      console.log(`Fetching page ${pageNumber}`);

      const response = await fetch(url, {
        headers: SCRAPING_HEADERS,
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText} for page ${pageNumber}`,
        );
      }

      const html = await response.text();
      console.log(`Successfully fetched page ${pageNumber}`);
      return html;
    });

    // Step 2: Parse HTML to extract articles
    const articles = await step.run("parse-articles", async () => {
      console.log(`Parsing articles from page ${pageNumber}`);
      const articles = parseArticlesFromHtml(html);
      console.log(`Found ${articles.length} articles on page ${pageNumber}`);
      return articles;
    });

    // Step 3: Emit article.discovered events for each article
    if (articles.length > 0) {
      const articleEvents = await step.run("prepare-article-events", async () => {
        console.log(
          `Preparing ${articles.length} article.discovered events for page ${pageNumber}`,
        );

        return articles.map((article) => ({
          name: "article.discovered" as const,
          data: {
            article,
            pageNumber,
            metadata: createEventMetadata(
              "page-scanner",
              metadata.scrapingSessionId,
              metadata.correlationId,
            ),
          },
        }));
      });

      await step.sendEvent("emit-article-discovered", articleEvents);
    }

    // Step 4: Wait briefly before completing (respect rate limits)
    if (config.delayMs > 0) {
      await step.sleep("rate-limit-delay", `${config.delayMs}ms`);
    }

    // Step 5: Emit page.scan.completed event
    await step.sendEvent("emit-page-completed", {
      name: "page.scan.completed",
      data: {
        pageNumber,
        articlesFound: articles.length,
        metadata: createEventMetadata(
          "page-scanner",
          metadata.scrapingSessionId,
          metadata.correlationId,
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
