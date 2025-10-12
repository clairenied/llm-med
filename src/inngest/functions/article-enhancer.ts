import { inngest } from "../client";
import type { ArticleDiscoveredEvent } from "../events";
import { createEventMetadata } from "../events";
import { enhanceArticleMetadata } from "../scraper-utils";

/**
 * Article Enhancer Function
 *
 * Purpose: Fetch detailed metadata from individual article pages
 *
 * Triggered by: article.discovered event
 *
 * Steps:
 * 1. Fetch individual article page
 * 2. Extract detailed metadata (authors, abstract, keywords, DOI)
 * 3. Validate required fields
 * 4. Emit article.enhanced or article.enhancement.failed event
 *
 * Concurrency: Max 10 articles being enhanced simultaneously
 * Rate Limit: 10 requests/second to F1000Research
 * Retry Strategy: 2 attempts with linear backoff (2s)
 */
export const articleEnhancer = inngest.createFunction(
  {
    id: "article-enhancer",
    name: "Article Enhancer",
    concurrency: {
      limit: 10, // Max 10 articles being enhanced simultaneously
    },
    rateLimit: {
      limit: 10, // 10 requests
      period: "1s", // per second
    },
    retries: 2, // Retry up to 2 times
  },
  { event: "article.discovered" },
  async ({ event, step }) => {
    const { article, pageNumber, metadata } = (
      event as ArticleDiscoveredEvent
    ).data;

    console.log(
      `Enhancing article from page ${pageNumber}: ${article.title?.substring(0, 50)}...`,
    );

    // Step 1: Validate basic article data
    await step.run("validate-article", async () => {
      if (!article.url || !article.title) {
        throw new Error("Article must have url and title");
      }
      return { valid: true };
    });

    // Step 2: Enhance article with detailed metadata
    const enhancedArticle = await step.run(
      "enhance-metadata",
      async () => {
        console.log(`Fetching detailed metadata for: ${article.url}`);

        const enhanced = await enhanceArticleMetadata(article);

        // Validate enhancement was successful
        if (!enhanced.authors || enhanced.authors.length === 0) {
          console.warn(
            `No authors found for article: ${article.title?.substring(0, 50)}...`,
          );
        }

        return enhanced;
      },
    );

    // Step 3: Brief delay to respect rate limits (additional to rate limit config)
    await step.sleep("enhancement-delay", "200ms");

    // Step 4: Emit enhanced event
    try {
      await step.sendEvent("emit-article-enhanced", {
        name: "article.enhanced",
        data: {
          article: enhancedArticle,
          pageNumber,
          metadata: createEventMetadata(
            "article-enhancer",
            metadata.scrapingSessionId,
            metadata.correlationId,
          ),
        },
      });

      return {
        success: true,
        title: enhancedArticle.title,
        url: enhancedArticle.url,
        authorsCount: enhancedArticle.authors?.length || 0,
        hasAbstract: !!enhancedArticle.abstract,
        keywordsCount: enhancedArticle.keywords?.length || 0,
      };
    } catch (error) {
      // If enhancement fails, emit failure event
      await step.sendEvent("emit-enhancement-failed", {
        name: "article.enhancement.failed",
        data: {
          article,
          error: error instanceof Error ? error.message : String(error),
          pageNumber,
          metadata: createEventMetadata(
            "article-enhancer",
            metadata.scrapingSessionId,
            metadata.correlationId,
          ),
        },
      });

      throw error;
    }
  },
);
