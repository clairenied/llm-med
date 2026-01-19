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

// f1000.article.transformed
export const F1000ArticleTransformedDataSchema = z.object({
  doi: z.string(),
  manuscriptId: z.string(),
  authorsCreated: z.number().int().nonnegative(),
  reviewsCreated: z.number().int().nonnegative(),
  metadata: EventMetadataSchema,
});

export type F1000ArticleTransformedData = z.infer<
  typeof F1000ArticleTransformedDataSchema
>;

// f1000.article.transform.skipped
export const F1000ArticleTransformSkippedDataSchema = z.object({
  doi: z.string(),
  reason: z.string(),
  metadata: EventMetadataSchema,
});

export type F1000ArticleTransformSkippedData = z.infer<
  typeof F1000ArticleTransformSkippedDataSchema
>;

// f1000.batch.transform.requested
export const F1000BatchTransformRequestedDataSchema = z.object({
  metadata: EventMetadataSchema,
});

export type F1000BatchTransformRequestedData = z.infer<
  typeof F1000BatchTransformRequestedDataSchema
>;

// f1000.batch.transform.completed
export const F1000BatchTransformCompletedDataSchema = z.object({
  totalDocuments: z.number().int().nonnegative(),
  unprocessedDocuments: z.number().int().nonnegative(),
  metadata: EventMetadataSchema,
});

export type F1000BatchTransformCompletedData = z.infer<
  typeof F1000BatchTransformCompletedDataSchema
>;

// manuscript.summary.requested
export const ManuscriptSummaryRequestedDataSchema = z.object({
  manuscriptId: z.string(),
  title: z.string().optional(),
});

export type ManuscriptSummaryRequestedData = z.infer<
  typeof ManuscriptSummaryRequestedDataSchema
>;

// manuscript.summaries.batch.requested
export const ManuscriptSummariesBatchRequestedDataSchema = z.object({});

export type ManuscriptSummariesBatchRequestedData = z.infer<
  typeof ManuscriptSummariesBatchRequestedDataSchema
>;

// reviews.reprocess.requested
export const ReviewsReprocessRequestedDataSchema = z.object({});

export type ReviewsReprocessRequestedData = z.infer<
  typeof ReviewsReprocessRequestedDataSchema
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
  "f1000.article.transformed": {
    data: F1000ArticleTransformedData;
  };
  "f1000.article.transform.skipped": {
    data: F1000ArticleTransformSkippedData;
  };
  "f1000.batch.transform.requested": {
    data: F1000BatchTransformRequestedData;
  };
  "f1000.batch.transform.completed": {
    data: F1000BatchTransformCompletedData;
  };
  "manuscript.summary.requested": {
    data: ManuscriptSummaryRequestedData;
  };
  "manuscript.summaries.batch.requested": {
    data: ManuscriptSummariesBatchRequestedData;
  };
  "reviews.reprocess.requested": {
    data: ReviewsReprocessRequestedData;
  };
};
