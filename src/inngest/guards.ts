import type { Events } from "./events";
import {
  ScraperInitiatedDataSchema,
  PageScanRequestedDataSchema,
  PageScanCompletedDataSchema,
  PageScanFailedDataSchema,
  ArticleDiscoveredDataSchema,
  ArticleEnhancedDataSchema,
  ArticleEnhancementFailedDataSchema,
  ArticlePersistedDataSchema,
  ArticleSkippedDuplicateDataSchema,
  ScraperCompletedDataSchema,
} from "./events";

/**
 * Type guards for Inngest events
 * Provides runtime type safety without type assertions
 */

// Define a union type for all possible events
type InngestEvent = {
  [K in keyof Events]: { name: K; data: Events[K]["data"] };
}[keyof Events];

// Helper to check event name and narrow type
function hasEventName<T extends keyof Events>(
  event: { name: string; data?: unknown },
  name: T,
): event is { name: T; data: Events[T]["data"] } {
  return event.name === name;
}

// Type guard functions with Zod validation
export function isScraperInitiated(
  event: { name: string; data?: unknown },
): event is { name: "scraper.initiated"; data: Events["scraper.initiated"]["data"] } {
  if (!hasEventName(event, "scraper.initiated")) return false;
  const result = ScraperInitiatedDataSchema.safeParse(event.data);
  return result.success;
}

export function isPageScanRequested(
  event: { name: string; data?: unknown },
): event is { name: "page.scan.requested"; data: Events["page.scan.requested"]["data"] } {
  if (!hasEventName(event, "page.scan.requested")) return false;
  const result = PageScanRequestedDataSchema.safeParse(event.data);
  return result.success;
}

export function isPageScanCompleted(
  event: { name: string; data?: unknown },
): event is { name: "page.scan.completed"; data: Events["page.scan.completed"]["data"] } {
  if (!hasEventName(event, "page.scan.completed")) return false;
  const result = PageScanCompletedDataSchema.safeParse(event.data);
  return result.success;
}

export function isPageScanFailed(
  event: { name: string; data?: unknown },
): event is { name: "page.scan.failed"; data: Events["page.scan.failed"]["data"] } {
  if (!hasEventName(event, "page.scan.failed")) return false;
  const result = PageScanFailedDataSchema.safeParse(event.data);
  return result.success;
}

export function isArticleDiscovered(
  event: { name: string; data?: unknown },
): event is { name: "article.discovered"; data: Events["article.discovered"]["data"] } {
  if (!hasEventName(event, "article.discovered")) return false;
  const result = ArticleDiscoveredDataSchema.safeParse(event.data);
  return result.success;
}

export function isArticleEnhanced(
  event: { name: string; data?: unknown },
): event is { name: "article.enhanced"; data: Events["article.enhanced"]["data"] } {
  if (!hasEventName(event, "article.enhanced")) return false;
  const result = ArticleEnhancedDataSchema.safeParse(event.data);
  return result.success;
}

export function isArticleEnhancementFailed(
  event: { name: string; data?: unknown },
): event is { name: "article.enhancement.failed"; data: Events["article.enhancement.failed"]["data"] } {
  if (!hasEventName(event, "article.enhancement.failed")) return false;
  const result = ArticleEnhancementFailedDataSchema.safeParse(event.data);
  return result.success;
}

export function isArticlePersisted(
  event: { name: string; data?: unknown },
): event is { name: "article.persisted"; data: Events["article.persisted"]["data"] } {
  if (!hasEventName(event, "article.persisted")) return false;
  const result = ArticlePersistedDataSchema.safeParse(event.data);
  return result.success;
}

export function isArticleSkippedDuplicate(
  event: { name: string; data?: unknown },
): event is { name: "article.skipped.duplicate"; data: Events["article.skipped.duplicate"]["data"] } {
  if (!hasEventName(event, "article.skipped.duplicate")) return false;
  const result = ArticleSkippedDuplicateDataSchema.safeParse(event.data);
  return result.success;
}

export function isScraperCompleted(
  event: { name: string; data?: unknown },
): event is { name: "scraper.completed"; data: Events["scraper.completed"]["data"] } {
  if (!hasEventName(event, "scraper.completed")) return false;
  const result = ScraperCompletedDataSchema.safeParse(event.data);
  return result.success;
}
