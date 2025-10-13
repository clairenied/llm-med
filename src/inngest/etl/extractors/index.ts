/**
 * Extractors Index
 *
 * Central export point for all extractor functions
 */

export { extractArticleMetadata } from "./article";
export { extractAuthors } from "./authors";
export { extractReviews } from "./reviews";

import type { ExtractedDocument } from "../types";
import { extractArticleMetadata } from "./article";
import { extractAuthors } from "./authors";
import { extractReviews } from "./reviews";

/**
 * Extract all data from an F1000Research XML document
 * This is the main entry point for the extraction phase
 */
export function extractDocument(xmlString: string): ExtractedDocument {
  return {
    article: extractArticleMetadata(xmlString),
    authors: extractAuthors(xmlString),
    reviews: extractReviews(xmlString),
  };
}
