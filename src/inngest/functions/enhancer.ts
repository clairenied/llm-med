import { inngest } from "../client";
import { createEventMetadata } from "../events";
import { sessionStore } from "../state";
import { isArticleDiscovered } from "../guards";

/**
 * Article Enhancer Function
 *
 * Fetches detailed metadata from individual article pages
 *
 * Features:
 * - Concurrent processing with rate limiting
 * - Automatic retries for transient failures
 * - Detailed metadata extraction from article pages
 * - Error tracking with fallback to basic metadata
 */
const enhancerFunction = inngest.createFunction(
  {
    id: "article-enhancer",
    name: "Article Enhancer",
    concurrency: {
      limit: 10, // Increased to handle burst of articles from scanner
    },
    rateLimit: {
      limit: 20, // Increased to handle burst of articles per page
      period: "1s",
    },
    retries: 1, // Reduced from defaultConfig.maxRetries to minimize replays
    onFailure: async ({ event, error }) => {
      if (isArticleDiscovered(event)) {
        const { article, pageNumber, metadata } = event.data;
        const { sessionId } = metadata;

        console.error(
          `Article enhancement failed after all retries: ${article.title?.substring(0, 50)}...`,
          error,
        );

        // Update session state
        try {
          sessionStore.incrementCounter(sessionId, "articlesEnhancementFailed");
          sessionStore.addError(sessionId, "article-enhancer", error.message, {
            article: article.url,
          });
        } catch (e) {
          console.error("Failed to update session state:", e);
        }

        // Emit failure event
        await inngest.send({
          name: "article.enhancement.failed",
          data: {
            article,
            error: error.message,
            pageNumber,
            metadata: createEventMetadata(
              "article-enhancer",
              sessionId,
              metadata.correlationId,
            ),
          },
        });
      }
    },
  },
  { event: "article.discovered" },
  async ({ event, step }) => {
    // Type guard
    if (!isArticleDiscovered(event)) {
      throw new Error("Invalid event type for article enhancer");
    }

    const { article, pageNumber, metadata } = event.data;
    const { sessionId } = metadata;

    if (!article.url || !article.title) {
      console.warn("Skipping article with missing url or title");
      throw new Error("Article must have url and title");
    }

    console.log(
      `Enhancing article: ${article.title.substring(0, 50)}... from page ${pageNumber}`,
    );

    // Fetch and parse article page in a single atomic step
    const enhanced = await step.run("fetch-and-parse-metadata", async () => {
      const response = await fetch(article.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ScraperBot/1.0)" },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch article page: ${article.url}`);
        throw new Error(`HTTP ${response.status} for ${article.url}`);
      }

      const html = await response.text();
      const cheerio = await import("cheerio");
      const $ = cheerio.load(html);

      // Extract authors from meta tags
      const authorNames: string[] = [];
      $('meta[name="citation_author"]').each((_, element) => {
        const author = $(element).attr("content");
        if (author && author.trim()) {
          authorNames.push(author.trim());
        }
      });

      // Extract abstract if not already present
      let abstract = article.abstract;
      if (!abstract) {
        const abstractText =
          $('meta[name="citation_abstract"]').attr("content") ||
          $(".abstract-content, .article-abstract").text().trim();
        if (abstractText && abstractText.length > 20) {
          abstract = abstractText;
        }
      }

      // Extract keywords
      const keywords: string[] = [];
      $('meta[name="citation_keywords"]').each((_, element) => {
        const keyword = $(element).attr("content");
        if (keyword && keyword.trim()) {
          keywords.push(keyword.trim());
        }
      });

      // Extract additional source metadata
      const doi = $('meta[name="citation_doi"]').attr("content");
      const publishedDate =
        $('meta[name="citation_publication_date"]').attr("content") ||
        $('meta[name="citation_date"]').attr("content");
      const articleType =
        $('meta[name="citation_article_type"]').attr("content") ||
        $(".article-type").text().trim();

      // Merge author data
      const enhancedAuthors =
        authorNames.length > 0
          ? authorNames.map((name) => ({ name }))
          : article.authors;

      // Validate we got useful data
      if (!enhancedAuthors || enhancedAuthors.length === 0) {
        console.warn(
          `Warning: No authors found for article: ${article.title.substring(0, 50)}...`,
        );
      }

      return {
        ...article,
        authors: enhancedAuthors,
        abstract: abstract || article.abstract,
        keywords: keywords.length > 0 ? keywords : article.keywords,
        sourceMetadata: {
          sourceName: "F1000Research",
          ...article.sourceMetadata,
          doi: doi || article.sourceMetadata?.doi,
          publishedDate: publishedDate
            ? new Date(publishedDate)
            : article.sourceMetadata?.publishedDate,
          articleType: articleType || article.sourceMetadata?.articleType,
        },
      };
    });

    // Update session state OUTSIDE of step to avoid replay issues
    // (sessionStore contains Date objects and counters that change on each access)
    try {
      sessionStore.incrementCounter(sessionId, "articlesEnhanced");
    } catch (error) {
      console.error("Failed to update session state:", error);
    }

    // Emit enhanced event using step.sendEvent() - the Inngest way
    await step.sendEvent("emit-enhanced-event", {
      name: "article.enhanced",
      data: {
        article: enhanced,
        pageNumber,
        metadata: createEventMetadata(
          "article-enhancer",
          sessionId,
          metadata.correlationId,
          metadata.timestamp, // Reuse timestamp from incoming event for determinism
        ),
      },
    });

    return {
      success: true,
      title: enhanced.title,
      url: enhanced.url,
      authorsCount: enhanced.authors?.length || 0,
      hasAbstract: !!enhanced.abstract,
      keywordsCount: enhanced.keywords?.length || 0,
    };
  },
);

export const enhancer = enhancerFunction;
