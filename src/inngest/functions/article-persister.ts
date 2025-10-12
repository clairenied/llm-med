import { PrismaClient } from "@prisma/client";
import { inngest } from "../client";
import type { ArticleEnhancedEvent } from "../events";
import { createEventMetadata } from "../events";
import {
  checkArticleExists,
  saveArticleToDatabase,
  normalizeTitle,
  normalizeUrl,
} from "../scraper-utils";

const prisma = new PrismaClient();

/**
 * Article Persister Function
 *
 * Purpose: Save enhanced articles to the database with deduplication
 *
 * Triggered by: article.enhanced event
 *
 * Steps:
 * 1. Check for duplicates using multiple strategies
 * 2. If duplicate, emit article.skipped.duplicate event
 * 3. If unique, create manuscript with relationships in transaction
 * 4. Emit article.persisted event
 *
 * Concurrency: 1 (sequential processing for database integrity)
 * Batching: Process in groups of 5 with 10s timeout
 * Retry Strategy: 1 attempt (transaction rollback on failure)
 */
export const articlePersister = inngest.createFunction(
  {
    id: "article-persister",
    name: "Article Persister",
    concurrency: {
      limit: 1, // Sequential processing to avoid race conditions
    },
    batchEvents: {
      maxSize: 5, // Process up to 5 articles in a batch
      timeout: "10s", // Wait up to 10 seconds to fill the batch
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

    // Process each article in the batch
    for (const event of events) {
      const { article, metadata } = (event as ArticleEnhancedEvent).data;

      if (!article.title || !article.url) {
        console.warn("Skipping article with missing title or URL");
        results.errors++;
        continue;
      }

      const articleId = `article-${article.url}`;

      // Step 1: Check for duplicates
      const isDuplicate = await step.run(
        `check-duplicate-${articleId}`,
        async () => {
          console.log(
            `Checking for duplicates: ${article.title.substring(0, 50)}...`,
          );
          return await checkArticleExists(prisma, article);
        },
      );

      if (isDuplicate) {
        console.log(
          `Duplicate found, skipping: ${article.title.substring(0, 50)}...`,
        );
        results.duplicates++;

        // Emit duplicate skipped event
        await step.sendEvent(`emit-duplicate-${articleId}`, {
          name: "article.skipped.duplicate",
          data: {
            title: article.title,
            url: article.url,
            reason: "Duplicate article found by title or URL match",
            metadata: createEventMetadata(
              "article-persister",
              metadata.scrapingSessionId,
              metadata.correlationId,
            ),
          },
        });

        continue;
      }

      // Step 2: Save article to database
      try {
        const manuscriptId = await step.run(
          `save-article-${articleId}`,
          async () => {
            console.log(
              `Saving article to database: ${article.title.substring(0, 50)}...`,
            );
            const id = await saveArticleToDatabase(prisma, article);
            console.log(`Successfully saved article with ID: ${id}`);
            return id;
          },
        );

        results.persisted++;

        // Step 3: Emit persisted event
        await step.sendEvent(`emit-persisted-${articleId}`, {
          name: "article.persisted",
          data: {
            manuscriptId,
            title: article.title,
            url: article.url,
            metadata: createEventMetadata(
              "article-persister",
              metadata.scrapingSessionId,
              metadata.correlationId,
            ),
          },
        });
      } catch (error) {
        console.error(
          `Error saving article "${article.title.substring(0, 30)}...":`,
          error instanceof Error ? error.message : error,
        );
        results.errors++;
      }
    }

    console.log(
      `Batch processing complete. Persisted: ${results.persisted}, Duplicates: ${results.duplicates}, Errors: ${results.errors}`,
    );

    return {
      success: true,
      batchSize: events.length,
      ...results,
    };
  },
);
