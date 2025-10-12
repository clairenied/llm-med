import * as cheerio from "cheerio";
import { PrismaClient } from "@prisma/client";
import type { ScrapedArticle } from "../../scraper/schema";

/**
 * Shared utilities for the Inngest scraper functions
 * Extracted from the monolithic scraper for reusability
 */

// Standard headers for scraping F1000Research
export const SCRAPING_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};

/**
 * Parse articles from HTML listing page
 */
export function parseArticlesFromHtml(html: string): Partial<ScrapedArticle>[] {
  const $ = cheerio.load(html);
  const articles: Partial<ScrapedArticle>[] = [];

  // Look for article links
  $('a[href*="/articles/"]').each((_, element) => {
    const $link = $(element);
    const href = $link.attr("href");
    const title = $link.text().trim();

    if (href && title && title.length > 10) {
      const fullUrl = href.startsWith("http")
        ? href
        : `https://f1000research.com${href}`;

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
  try {
    if (!article.url) {
      return article;
    }

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
        publishedDate: publishedDate
          ? new Date(publishedDate)
          : article.sourceMetadata?.publishedDate,
        articleType: articleType || article.sourceMetadata?.articleType,
      },
    };
  } catch (error) {
    console.warn(`Error enhancing metadata for ${article.url}:`, error);
    return article;
  }
}

/**
 * Normalize title for duplicate detection
 */
export function normalizeTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      // Remove common punctuation variations
      .replace(/[""'']/g, '"')
      .replace(/[–—]/g, "-")
      // Remove trailing punctuation that might vary
      .replace(/[.!?]+$/, "")
  );
}

/**
 * Normalize URL for duplicate detection
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Normalize protocol to https
    urlObj.protocol = "https:";
    // Remove trailing slash
    urlObj.pathname = urlObj.pathname.replace(/\/$/, "");
    // Remove common tracking parameters
    urlObj.searchParams.delete("utm_source");
    urlObj.searchParams.delete("utm_medium");
    urlObj.searchParams.delete("utm_campaign");
    urlObj.searchParams.delete("ref");
    return urlObj.toString();
  } catch {
    // If URL parsing fails, just clean up basic issues
    return url
      .replace(/^http:/, "https:")
      .replace(/\/$/, "")
      .toLowerCase();
  }
}

/**
 * Extract article ID from F1000Research URLs
 * e.g., https://f1000research.com/articles/12-345 -> "12-345"
 */
export function extractArticleId(url: string): string {
  const match = url.match(/\/articles\/([^/?#]+)/);
  return match ? match[1] : "";
}

/**
 * Check if an article already exists in the database
 * Uses multiple strategies for duplicate detection
 */
export async function checkArticleExists(
  prisma: PrismaClient,
  article: Partial<ScrapedArticle>,
): Promise<boolean> {
  if (!article.title || !article.url) {
    return false;
  }

  const normalizedTitle = normalizeTitle(article.title);
  const normalizedUrl = normalizeUrl(article.url);
  const articleId = extractArticleId(article.url);

  const existing = await prisma.manuscript.findFirst({
    where: {
      OR: [
        // Exact title match
        { title: article.title },
        // Normalized title match (handles minor variations)
        { title: normalizedTitle },
        // URL-based matching
        {
          sources: {
            some: {
              OR: [
                { url: article.url },
                { url: normalizedUrl },
                // Handle URL variations (http vs https, trailing slashes, etc.)
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
 */
export async function saveArticleToDatabase(
  prisma: PrismaClient,
  article: Partial<ScrapedArticle>,
): Promise<string> {
  if (!article.title || !article.url) {
    throw new Error("Article must have title and url");
  }

  // Create manuscript with source in a transaction
  const manuscript = await prisma.$transaction(async (tx) => {
    // Create or get F1000Research source
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

    // Create manuscript
    const manuscript = await tx.manuscript.create({
      data: {
        title: article.title,
        abstract: article.abstract || null,
        keywords: article.keywords || [],
        status: "PUBLISHED", // F1000Research articles are already published
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
            peerReviewStatus:
              article.sourceMetadata?.peerReviewStatus || null,
          },
        },
      },
    });

    return manuscript;
  });

  return manuscript.id;
}
