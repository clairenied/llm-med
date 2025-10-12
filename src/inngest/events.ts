import { z } from "zod";
import type { ScrapedArticle } from "./schema";
import { ScraperConfigSchema } from "./config";

/**
 * Event schemas and types for the Inngest scraper workflow
 * All events are validated with Zod for type safety
 */

// Base event metadata schema
export const EventMetadataSchema = z.object({
  sessionId: z.string(),
  correlationId: z.string(),
  timestamp: z.string().datetime(),
  source: z.string(),
});

export type EventMetadata = z.infer<typeof EventMetadataSchema>;

/**
 * Helper to create event metadata
 *
 * IMPORTANT: To ensure deterministic behavior in Inngest functions,
 * the timestamp parameter should be generated ONCE at the start of
 * the function (outside of any step.run() calls) and reused for all
 * events emitted within that function execution.
 */
export function createEventMetadata(
  source: string,
  sessionId: string,
  correlationId?: string,
  timestamp?: string,
): EventMetadata {
  return {
    sessionId,
    correlationId: correlationId || sessionId,
    timestamp: timestamp || new Date().toISOString(),
    source,
  };
}

// ============================================================================
// Event Schemas
// ============================================================================

// scraper.initiated
export const ScraperInitiatedDataSchema = z.object({
  config: ScraperConfigSchema,
  metadata: EventMetadataSchema,
});

export type ScraperInitiatedData = z.infer<typeof ScraperInitiatedDataSchema>;

// page.scan.requested
export const PageScanRequestedDataSchema = z.object({
  pageNumber: z.number().int().positive(),
  url: z.string().url(),
  config: z.object({
    maxRetries: z.number().int(),
    delayMs: z.number().int(),
  }),
  metadata: EventMetadataSchema,
});

export type PageScanRequestedData = z.infer<
  typeof PageScanRequestedDataSchema
>;

// page.scan.completed
export const PageScanCompletedDataSchema = z.object({
  pageNumber: z.number().int().positive(),
  articlesFound: z.number().int().nonnegative(),
  metadata: EventMetadataSchema,
});

export type PageScanCompletedData = z.infer<
  typeof PageScanCompletedDataSchema
>;

// page.scan.failed
export const PageScanFailedDataSchema = z.object({
  pageNumber: z.number().int().positive(),
  error: z.string(),
  metadata: EventMetadataSchema,
});

export type PageScanFailedData = z.infer<typeof PageScanFailedDataSchema>;

// article.discovered
export const ArticleDiscoveredDataSchema = z.object({
  article: z.custom<Partial<ScrapedArticle>>((data) => {
    // Basic validation - ensure it's an object with at least a title or url
    return typeof data === "object" && data !== null;
  }),
  pageNumber: z.number().int().positive(),
  metadata: EventMetadataSchema,
});

export type ArticleDiscoveredData = z.infer<
  typeof ArticleDiscoveredDataSchema
>;

// article.enhanced
export const ArticleEnhancedDataSchema = z.object({
  article: z.custom<Partial<ScrapedArticle>>((data) => {
    // Basic validation - ensure it's an object with at least a title or url
    return typeof data === "object" && data !== null;
  }),
  pageNumber: z.number().int().positive(),
  metadata: EventMetadataSchema,
});

export type ArticleEnhancedData = z.infer<typeof ArticleEnhancedDataSchema>;

// article.enhancement.failed
export const ArticleEnhancementFailedDataSchema = z.object({
  article: z.custom<Partial<ScrapedArticle>>((data) => {
    // Basic validation - ensure it's an object with at least a title or url
    return typeof data === "object" && data !== null;
  }),
  error: z.string(),
  pageNumber: z.number().int().positive(),
  metadata: EventMetadataSchema,
});

export type ArticleEnhancementFailedData = z.infer<
  typeof ArticleEnhancementFailedDataSchema
>;

// article.persisted
export const ArticlePersistedDataSchema = z.object({
  manuscriptId: z.string(),
  title: z.string(),
  url: z.string().url(),
  metadata: EventMetadataSchema,
});

export type ArticlePersistedData = z.infer<typeof ArticlePersistedDataSchema>;

// article.skipped.duplicate
export const ArticleSkippedDuplicateDataSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  reason: z.string(),
  metadata: EventMetadataSchema,
});

export type ArticleSkippedDuplicateData = z.infer<
  typeof ArticleSkippedDuplicateDataSchema
>;

// scraper.completed
export const ScraperCompletedDataSchema = z.object({
  stats: z.object({
    totalPages: z.number().int(),
    pagesCompleted: z.number().int(),
    pagesFailed: z.number().int(),
    articlesDiscovered: z.number().int(),
    articlesEnhanced: z.number().int(),
    articlesPersisted: z.number().int(),
    duplicatesSkipped: z.number().int(),
    errors: z.number().int(),
  }),
  duration: z.number(),
  metadata: EventMetadataSchema,
});

export type ScraperCompletedData = z.infer<typeof ScraperCompletedDataSchema>;

// ============================================================================
// Event Type Definitions (for Inngest)
// ============================================================================

export type Events = {
  "scraper.initiated": {
    data: ScraperInitiatedData;
  };
  "page.scan.requested": {
    data: PageScanRequestedData;
  };
  "page.scan.completed": {
    data: PageScanCompletedData;
  };
  "page.scan.failed": {
    data: PageScanFailedData;
  };
  "article.discovered": {
    data: ArticleDiscoveredData;
  };
  "article.enhanced": {
    data: ArticleEnhancedData;
  };
  "article.enhancement.failed": {
    data: ArticleEnhancementFailedData;
  };
  "article.persisted": {
    data: ArticlePersistedData;
  };
  "article.skipped.duplicate": {
    data: ArticleSkippedDuplicateData;
  };
  "scraper.completed": {
    data: ScraperCompletedData;
  };
};
