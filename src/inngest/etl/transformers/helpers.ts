/**
 * Transformer Helpers
 *
 * Utility functions for transforming extracted data
 */

import type { ExtractedAuthor, ExtractedReviewer, ExtractedReview } from "../types";
import { normalizeName } from "../types";

/**
 * Deduplicate authors by ORCID (if available) or normalized name
 */
export function deduplicateAuthors(authors: ExtractedAuthor[]): ExtractedAuthor[] {
  const seen = new Set<string>();
  const deduplicated: ExtractedAuthor[] = [];

  for (const author of authors) {
    // Use ORCID as primary key if available
    if (author.orcId) {
      if (seen.has(`orcid:${author.orcId}`)) {
        continue;
      }
      seen.add(`orcid:${author.orcId}`);
      deduplicated.push(author);
      continue;
    }

    // Otherwise use normalized name
    const normalized = normalizeName(author.surname, author.givenNames).normalized;
    if (seen.has(`name:${normalized}`)) {
      continue;
    }
    seen.add(`name:${normalized}`);
    deduplicated.push(author);
  }

  return deduplicated;
}

/**
 * Deduplicate reviewers by normalized name AND affiliation
 * Same person at different institutions = different reviewers
 */
export function deduplicateReviewers(reviewers: ExtractedReviewer[]): ExtractedReviewer[] {
  const seen = new Set<string>();
  const deduplicated: ExtractedReviewer[] = [];

  for (const reviewer of reviewers) {
    const normalized = normalizeName(reviewer.surname, reviewer.givenNames).normalized;
    // Include affiliation in the deduplication key
    const key = `${normalized}|${reviewer.affiliation || ""}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduplicated.push(reviewer);
  }

  return deduplicated;
}

/**
 * Deduplicate reviews by their unique identifier (subArticleId or doi)
 *
 * NOTE: We intentionally keep multiple reviews from the same reviewer
 * because reviewers often review multiple versions of a paper.
 * Each review has a unique subArticleId in F1000 XML.
 */
export function deduplicateReviews(reviews: ExtractedReview[]): ExtractedReview[] {
  const seen = new Set<string>();
  const deduplicated: ExtractedReview[] = [];

  for (const review of reviews) {
    // Use subArticleId or doi as unique key - these are truly unique per review
    const key = review.subArticleId || review.doi ||
      // Fallback: combine reviewer + content hash for uniqueness
      `${review.reviewer.surname}|${review.content?.substring(0, 100)}`;

    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduplicated.push(review);
  }

  return deduplicated;
}

/**
 * Extract version number from review article title
 * e.g., "Reviewer response for version 2" -> 2
 */
export function extractReviewVersionNumber(articleTitle: string | null): number | null {
  if (!articleTitle) return null;
  const match = articleTitle.match(/version\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Format full name from surname and given names
 */
export function formatFullName(surname: string, givenNames: string | null): string {
  return givenNames ? `${givenNames} ${surname}` : surname;
}
