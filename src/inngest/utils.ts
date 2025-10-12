import * as cheerio from "cheerio";
import type { ScrapedArticle } from "./schema";
import { db, transaction } from "./db";
import { SCRAPING_HEADERS } from "./config";

/**
 * Shared utilities for the Inngest scraper functions
 */

/**
 * Parse articles from HTML listing page
 */
export function parseArticlesFromHtml(html: string): Partial<ScrapedArticle>[] {
  const $ = cheerio.load(html);
  const articles: Partial<ScrapedArticle>[] = [];
  const seenUrls = new Set<string>();

  // Look for article links
  $('a[href*="/articles/"]').each((_, element) => {
    const $link = $(element);
    const href = $link.attr("href");
    const title = $link.text().trim();

    if (href && title && title.length > 10) {
      const fullUrl = href.startsWith("http")
        ? href
        : `https://f1000research.com${href}`;

      // Skip duplicates within the same page
      if (seenUrls.has(fullUrl)) return;
      seenUrls.add(fullUrl);

      // Extract additional metadata if available
      const $parent = $link.closest(
        ".article-item, .search-result, .article-card",
      );
      const abstract =
        $parent.find(".abstract, .summary").text().trim() || undefined;

      // Try to extract authors from various sources
      const authorNames: string[] = [];

      // Method 1: Look for author elements in the parent
      const authorText = $parent
        .find(".authors, .author-list, .author-names")
        .text()
        .trim();
      if (authorText) {
        authorNames.push(
          ...authorText
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a.length > 0),
        );
      }

      // Method 2: Look for author links
      if (authorNames.length === 0) {
        const authorLinks = $parent
          .find('a[href*="/authors/"], .author-link')
          .map((_, el) => $(el).text().trim())
          .get();
        authorNames.push(...authorLinks.filter((a) => a.length > 0));
      }

      // Convert author names to ScrapedAuthor objects
      const authors =
        authorNames.length > 0 ? authorNames.map((name) => ({ name })) : [];

      // Extract article ID from URL
      const externalId = extractArticleId(fullUrl);

      articles.push({
        title,
        url: fullUrl,
        abstract: abstract && abstract.length > 20 ? abstract : undefined,
        authors,
        keywords: [],
        sourceMetadata: {
          sourceName: "F1000Research",
          externalId: externalId || undefined,
        },
      });
    }
  });

  return articles;
}

/**
 * Enhance article with detailed metadata from individual article page
 */
export async function enhanceArticleMetadata(
  article: Partial<ScrapedArticle>,
): Promise<Partial<ScrapedArticle>> {
  if (!article.url) {
    return article;
  }

  try {
    // Fetch the individual article page to get detailed metadata
    const response = await fetch(article.url, { headers: SCRAPING_HEADERS });
    if (!response.ok) {
      console.warn(`Failed to fetch article page: ${article.url}`);
      return article;
    }

    const html = await response.text();
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

    return {
      ...article,
      authors: enhancedAuthors,
      abstract: abstract || article.abstract,
      keywords: keywords.length > 0 ? keywords : article.keywords,
      sourceMetadata: {
        sourceName: "F1000Research",
        ...article.sourceMetadata,
        doi: doi || article.sourceMetadata?.doi,
        // Store as Date object for consistency with schema
        // The date string from the page is deterministic, so parsing it is safe
        publishedDate: publishedDate
          ? new Date(publishedDate)
          : article.sourceMetadata?.publishedDate,
        articleType: articleType || article.sourceMetadata?.articleType,
      },
    };
  } catch (error) {
    console.error(`Error enhancing metadata for ${article.url}:`, error);
    throw error; // Propagate error for retry logic
  }
}

/**
 * Normalize title for duplicate detection
 */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[""'']/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[.!?]+$/, "");
}

/**
 * Normalize URL for duplicate detection
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.protocol = "https:";
    urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
    urlObj.searchParams.delete("utm_source");
    urlObj.searchParams.delete("utm_medium");
    urlObj.searchParams.delete("utm_campaign");
    urlObj.searchParams.delete("ref");
    return urlObj.toString();
  } catch {
    return url
      .replace(/^http:/, "https:")
      .replace(/\/$/, "")
      .toLowerCase();
  }
}

/**
 * Extract article ID from F1000Research URLs
 */
export function extractArticleId(url: string): string {
  const match = url.match(/\/articles\/([^/?#]+)/);
  return match ? match[1] : "";
}

/**
 * Check if an article already exists in the database
 */
export async function checkArticleExists(
  article: Partial<ScrapedArticle>,
): Promise<boolean> {
  if (!article.title || !article.url) {
    return false;
  }

  const normalizedTitle = normalizeTitle(article.title);
  const normalizedUrl = normalizeUrl(article.url);
  const articleId = extractArticleId(article.url);

  const existing = await db.manuscript.findFirst({
    where: {
      OR: [
        { title: article.title },
        { title: normalizedTitle },
        {
          sources: {
            some: {
              OR: [
                { url: article.url },
                { url: normalizedUrl },
                ...(articleId ? [{ url: { contains: articleId } }] : []),
              ],
            },
          },
        },
      ],
    },
  });

  return existing !== null;
}

/**
 * Save article to database with all relationships
 * Uses upsert logic to handle potential duplicates gracefully
 */
export async function saveArticleToDatabase(
  article: Partial<ScrapedArticle>,
): Promise<string> {
  if (!article.title || !article.url) {
    throw new Error("Article must have title and url");
  }

  const manuscript = await transaction(async (tx) => {
    // Upsert F1000Research source
    const source = await tx.source.upsert({
      where: {
        name: article.sourceMetadata?.sourceName || "F1000Research",
      },
      update: {},
      create: {
        name: article.sourceMetadata?.sourceName || "F1000Research",
        baseUrl: "https://f1000research.com",
        description: "F1000Research is an open research publishing platform",
      },
    });

    // Ensure url is defined before creating manuscript
    if (!article.url) {
      throw new Error("Article URL is required");
    }

    // Create manuscript
    const manuscript = await tx.manuscript.create({
      data: {
        title: article.title,
        abstract: article.abstract || null,
        keywords: article.keywords || [],
        status: "PUBLISHED",
        authors:
          article.authors && article.authors.length > 0
            ? {
                create: article.authors.map((author) => ({
                  name: author.name,
                  email: author.email || null,
                  affiliation: author.affiliation || null,
                })),
              }
            : undefined,
        sources: {
          create: {
            sourceId: source.id,
            url: article.url,
            externalId: article.sourceMetadata?.externalId || null,
            doi: article.sourceMetadata?.doi || null,
            publishedDate: article.sourceMetadata?.publishedDate || null,
            articleType: article.sourceMetadata?.articleType || null,
            peerReviewStatus: article.sourceMetadata?.peerReviewStatus || null,
          },
        },
      },
    });

    return manuscript;
  });

  return manuscript.id;
}
