import { z } from "zod";

/**
 * Zod schema for author data scraped from research articles
 */
export const ScrapedAuthorSchema = z.object({
  name: z.string().min(1, "Author name cannot be empty"),
  email: z.string().email().optional(),
  affiliation: z.string().optional(),
  // Note: orcId exists in DB schema but is not currently extracted during scraping
});

/**
 * Source metadata for tracking where the article came from
 */
export const SourceMetadataSchema = z.object({
  sourceName: z.string().default("F1000Research"),
  externalId: z.string().optional(), // Article ID from the source (e.g., "12-345")
  doi: z.string().optional(), // Digital Object Identifier
  publishedDate: z.coerce.date().optional(), // Coerce strings to Date objects
  lastModifiedDate: z.coerce.date().optional(),
  articleType: z.string().optional(), // e.g., "Research Article", "Review", "Case Report"
  peerReviewStatus: z.string().optional(), // e.g., "Peer reviewed", "Not peer reviewed"
  license: z.string().optional(), // e.g., "CC BY 4.0"
  citationCount: z.number().int().nonnegative().optional(),
});

/**
 * Main schema for scraped article data
 * This serves as an intermediary format between scraping and database storage
 */
export const ScrapedArticleSchema = z.object({
  // Core required fields
  title: z.string().max(1000, "Title exceeds maximum length"),
  url: z.string().url("Invalid article URL"),

  // Content fields (optional but validated when present)
  abstract: z.string().max(10000, "Abstract exceeds maximum length").optional(),
  keywords: z.array(z.string().min(1)).default([]),

  // Author information
  authors: z.array(ScrapedAuthorSchema).default([]),

  // Source-specific metadata
  sourceMetadata: SourceMetadataSchema.optional(),

  // Raw metadata for future processing or debugging
  // Can store any additional structured data that doesn't fit the main schema
  rawMetadata: z.record(z.string(), z.any()).optional(),

  // Scraping metadata
  scrapedAt: z.date().default(() => new Date()),
  scrapedFrom: z.string().url().optional(), // The list page URL where this was found
});

/**
 * Schema for batch scraping results
 * Useful for validating entire collections of scraped articles
 */
export const ScrapedArticleBatchSchema = z.object({
  articles: z.array(ScrapedArticleSchema),
  scrapedAt: z.date().default(() => new Date()),
  source: z.string().default("F1000Research"),
  pageNumber: z.number().int().positive().optional(),
  totalArticles: z.number().int().nonnegative().optional(),
});

// Type inference from Zod schemas
export type ScrapedArticle = z.infer<typeof ScrapedArticleSchema>;
export type ScrapedAuthor = z.infer<typeof ScrapedAuthorSchema>;
export type SourceMetadata = z.infer<typeof SourceMetadataSchema>;
export type ScrapedArticleBatch = z.infer<typeof ScrapedArticleBatchSchema>;

/**
 * Helper function to validate and parse scraped article data
 * Returns validation result with parsed data or errors
 */
export function validateScrapedArticle(data: unknown): {
  success: boolean;
  data?: ScrapedArticle;
  error?: z.ZodError;
} {
  const result = ScrapedArticleSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

/**
 * Helper function to validate and parse a batch of scraped articles
 * Returns validation results for all articles, including which ones failed
 */
export function validateScrapedArticleBatch(articles: unknown[]): {
  valid: ScrapedArticle[];
  invalid: Array<{ data: unknown; error: any; issues: any[] }>;
} {
  const valid: ScrapedArticle[] = [];
  const invalid: Array<{ data: unknown; error: any; issues: any[] }> = [];

  for (const article of articles) {
    const result = ScrapedArticleSchema.safeParse(article);
    if (result.success) {
      valid.push(result.data);
    } else {
      invalid.push({
        data: article,
        error: result.error,
        issues: result.error.issues || [],
      });
    }
  }

  return { valid, invalid };
}

/**
 * Partial schema for article updates
 * Allows updating specific fields without requiring the entire object
 */
export const ScrapedArticleUpdateSchema = ScrapedArticleSchema.partial();
export type ScrapedArticleUpdate = z.infer<typeof ScrapedArticleUpdateSchema>;
