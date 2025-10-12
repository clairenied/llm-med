import type { ScrapedArticle } from "../../scraper/schema";

/**
 * Event type definitions for the Inngest scraper workflow
 */

// Base event metadata included in all events
export interface EventMetadata {
  correlationId: string; // Trace entire scraping session
  timestamp: string; // ISO8601 timestamp
  source: string; // Function name that emitted the event
  scrapingSessionId: string;
}

// Configuration for the scraping process
export interface ScrapingConfig {
  baseUrl: string;
  maxPages: number;
  delayMs: number;
  maxRetries: number;
  batchSize: number;
}

// Event: scraper.initiated
export interface ScraperInitiatedEvent {
  name: "scraper.initiated";
  data: {
    config: ScrapingConfig;
    metadata: EventMetadata;
  };
}

// Event: page.scan.requested
export interface PageScanRequestedEvent {
  name: "page.scan.requested";
  data: {
    pageNumber: number;
    url: string;
    config: Pick<ScrapingConfig, "maxRetries" | "delayMs">;
    metadata: EventMetadata;
  };
}

// Event: article.discovered
export interface ArticleDiscoveredEvent {
  name: "article.discovered";
  data: {
    article: Partial<ScrapedArticle>;
    pageNumber: number;
    metadata: EventMetadata;
  };
}

// Event: article.enhanced
export interface ArticleEnhancedEvent {
  name: "article.enhanced";
  data: {
    article: Partial<ScrapedArticle>;
    pageNumber: number;
    metadata: EventMetadata;
  };
}

// Event: article.enhancement.failed
export interface ArticleEnhancementFailedEvent {
  name: "article.enhancement.failed";
  data: {
    article: Partial<ScrapedArticle>;
    error: string;
    pageNumber: number;
    metadata: EventMetadata;
  };
}

// Event: article.persisted
export interface ArticlePersistedEvent {
  name: "article.persisted";
  data: {
    manuscriptId: string;
    title: string;
    url: string;
    metadata: EventMetadata;
  };
}

// Event: article.skipped.duplicate
export interface ArticleSkippedDuplicateEvent {
  name: "article.skipped.duplicate";
  data: {
    title: string;
    url: string;
    reason: string;
    metadata: EventMetadata;
  };
}

// Event: page.scan.completed
export interface PageScanCompletedEvent {
  name: "page.scan.completed";
  data: {
    pageNumber: number;
    articlesFound: number;
    metadata: EventMetadata;
  };
}

// Event: page.scan.failed
export interface PageScanFailedEvent {
  name: "page.scan.failed";
  data: {
    pageNumber: number;
    error: string;
    metadata: EventMetadata;
  };
}

// Event: scraper.completed
export interface ScraperCompletedEvent {
  name: "scraper.completed";
  data: {
    stats: {
      totalPages: number;
      articlesDiscovered: number;
      articlesEnhanced: number;
      articlesPersisted: number;
      duplicatesSkipped: number;
      errors: number;
    };
    duration: number; // Duration in seconds
    metadata: EventMetadata;
  };
}

// Union type of all events
export type ScraperEvent =
  | ScraperInitiatedEvent
  | PageScanRequestedEvent
  | ArticleDiscoveredEvent
  | ArticleEnhancedEvent
  | ArticleEnhancementFailedEvent
  | ArticlePersistedEvent
  | ArticleSkippedDuplicateEvent
  | PageScanCompletedEvent
  | PageScanFailedEvent
  | ScraperCompletedEvent;

// Helper function to create event metadata
export function createEventMetadata(
  source: string,
  scrapingSessionId: string,
  correlationId?: string,
): EventMetadata {
  return {
    correlationId: correlationId || scrapingSessionId,
    timestamp: new Date().toISOString(),
    source,
    scrapingSessionId,
  };
}
