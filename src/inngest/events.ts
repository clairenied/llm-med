import { z } from "zod";

/**
 * Event schemas and types for the F1000 API workflow
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

// f1000.list.requested
export const F1000ListRequestedDataSchema = z.object({
  subject: z.string(),
  metadata: EventMetadataSchema,
});

export type F1000ListRequestedData = z.infer<
  typeof F1000ListRequestedDataSchema
>;

// f1000.article.fetch.requested
export const F1000ArticleFetchRequestedDataSchema = z.object({
  doi: z.string(),
  metadata: EventMetadataSchema,
});

export type F1000ArticleFetchRequestedData = z.infer<
  typeof F1000ArticleFetchRequestedDataSchema
>;

// f1000.article.saved
export const F1000ArticleSavedDataSchema = z.object({
  doi: z.string(),
  hash: z.string(),
  metadata: EventMetadataSchema,
});

export type F1000ArticleSavedData = z.infer<typeof F1000ArticleSavedDataSchema>;

// f1000.article.duplicate
export const F1000ArticleDuplicateDataSchema = z.object({
  doi: z.string(),
  hash: z.string(),
  metadata: EventMetadataSchema,
});

export type F1000ArticleDuplicateData = z.infer<
  typeof F1000ArticleDuplicateDataSchema
>;

// f1000.list.completed
export const F1000ListCompletedDataSchema = z.object({
  subject: z.string(),
  totalDoisFound: z.number().int().nonnegative(),
  metadata: EventMetadataSchema,
});

export type F1000ListCompletedData = z.infer<
  typeof F1000ListCompletedDataSchema
>;

// ============================================================================
// Event Type Definitions (for Inngest)
// ============================================================================

export type Events = {
  "f1000.list.requested": {
    data: F1000ListRequestedData;
  };
  "f1000.article.fetch.requested": {
    data: F1000ArticleFetchRequestedData;
  };
  "f1000.article.saved": {
    data: F1000ArticleSavedData;
  };
  "f1000.article.duplicate": {
    data: F1000ArticleDuplicateData;
  };
  "f1000.list.completed": {
    data: F1000ListCompletedData;
  };
};
