import { inngest } from "../client";
import { createEventMetadata, type EventMetadata } from "../events";
import { saveArticleToDatabase } from "../utils";
import { sessionStore } from "../state";
import { isArticleEnhanced } from "../guards";
import { db } from "../db";
import type { ScrapedArticle } from "../schema";

/**
 * Article Persister Function
 *
 * Saves enhanced articles to the database with deduplication
 *
 * Features:
 * - Batch processing for efficiency
 * - Duplicate detection before saving
 * - Uses Prisma singleton (no connection leaks)
 * - Transactional saves with proper error handling
 * - Sequential processing to avoid race conditions
 */
export const persister = inngest.createFunction(
  {
    id: "article-persister",
    name: "Article Persister",
    concurrency: {
      limit: 1, // Sequential processing to avoid race conditions
    },
    batchEvents: {
      maxSize: 10, // Increased from 5 to process more articles per batch
      timeout: "30s", // Increased from 10s to allow more time for events to accumulate
    },
    retries: 1, // Single retry on failure
  },
  { event: "article.enhanced" },
  async ({ events, step }) => {
    const results = {
      persisted: 0,
      duplicates: 0,
      errors: 0,
    };

    console.log(`Processing batch of ${events.length} enhanced articles`);

    // Validate all events and extract articles
    const validArticles: Array<{
      article: Partial<ScrapedArticle>;
      metadata: EventMetadata;
      sessionId: string;
    }> = [];

    for (const event of events) {
      if (!isArticleEnhanced(event)) {
        console.warn("Skipping invalid event in batch");
        results.errors++;
        continue;
      }

      const { article, metadata } = event.data;
      const { sessionId } = metadata;

      if (!article.title || !article.url) {
        console.warn("Skipping article with missing title or URL");
        results.errors++;
        continue;
      }

      validArticles.push({ article, metadata, sessionId });
    }

    // BULK DUPLICATE CHECK - ONE query for entire batch instead of N queries
    // Note: Return array from step.run, convert to Set outside (Sets don't serialize)
    const existingUrlsArray = await step.run(
      "bulk-check-duplicates",
      async () => {
        if (validArticles.length === 0) return [];

        const urls = validArticles.map((a) => a.article.url!);
        console.log(`Checking ${urls.length} URLs for duplicates...`);

        const existing = await db.manuscriptSource.findMany({
          where: { url: { in: urls } },
          select: { url: true },
        });

        const foundUrls = existing.map((e) => e.url);
        console.log(
          `Found ${foundUrls.length} existing URLs out of ${urls.length} in batch`,
        );
        return foundUrls;
      },
    );

    const existingUrls = new Set(existingUrlsArray);

    // Process each article
    for (const { article, metadata, sessionId } of validArticles) {
      const articleUrl = article.url!;

      try {
        // Check if duplicate (from bulk check)
        if (existingUrls.has(articleUrl)) {
          console.log(
            `Duplicate found: ${article.title!.substring(0, 50)}...`,
          );
          results.duplicates++;

          // Update session state OUTSIDE of step to avoid replay issues
          try {
            sessionStore.incrementCounter(sessionId, "articlesDuplicate");
          } catch (error) {
            console.error("Failed to update session state:", error);
          }

          // Emit duplicate event using step.sendEvent() - replay-safe
          await step.sendEvent(`emit-duplicate-${articleUrl}`, {
            name: "article.skipped.duplicate",
            data: {
              title: article.title!,
              url: article.url!,
              reason: "Duplicate article found by URL match",
              metadata: createEventMetadata(
                "article-persister",
                sessionId,
                metadata.correlationId,
                metadata.timestamp, // Reuse timestamp for determinism
              ),
            },
          });

          continue;
        }

        // Save article to database
        console.log(`Preparing to save: ${article.title!.substring(0, 50)}...`);
        const manuscriptId = await step.run(
          `save-article-${articleUrl}`,
          async () => {
            console.log(
              `[STEP] Saving: ${article.title!.substring(0, 50)}...`,
            );
            const id = await saveArticleToDatabase(article);
            console.log(`[STEP] Successfully saved with ID: ${id}`);
            return id;
          },
        );

        results.persisted++;
        console.log(`Persisted article ${manuscriptId}`);

        // Update session state OUTSIDE of step to avoid replay issues
        try {
          sessionStore.incrementCounter(sessionId, "articlesPersisted");
        } catch (error) {
          console.error("Failed to update session state:", error);
        }

        // Emit persisted event using step.sendEvent() - replay-safe
        await step.sendEvent(`emit-persisted-${articleUrl}`, {
          name: "article.persisted",
          data: {
            manuscriptId,
            title: article.title!,
            url: article.url!,
            metadata: createEventMetadata(
              "article-persister",
              sessionId,
              metadata.correlationId,
              metadata.timestamp, // Reuse timestamp for determinism
            ),
          },
        });
      } catch (error) {
        console.error(
          `Error processing article "${article.title?.substring(0, 30) || 'Unknown'}...":`,
          error instanceof Error ? error.message : error,
        );
        results.errors++;

        // Update session state OUTSIDE of step to avoid replay issues
        try {
          sessionStore.incrementCounter(sessionId, "articlesPersistFailed");
          sessionStore.addError(
            sessionId,
            "article-persister",
            error instanceof Error ? error.message : String(error),
            { article: article.url },
          );
        } catch (e) {
          console.error("Failed to update session state:", e);
        }
      }
    }

    console.log(
      `Batch complete. Persisted: ${results.persisted}, Duplicates: ${results.duplicates}, Errors: ${results.errors}`,
    );

    return {
      success: true,
      batchSize: events.length,
      ...results,
    };
  },
);
