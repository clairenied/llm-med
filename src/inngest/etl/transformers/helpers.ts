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
 * Deduplicate reviews by reviewer (name + affiliation)
 * Keeps only the first review from each unique reviewer
 */
export function deduplicateReviews(reviews: ExtractedReview[]): ExtractedReview[] {
  const seen = new Set<string>();
  const deduplicated: ExtractedReview[] = [];

  for (const review of reviews) {
    const normalized = normalizeName(review.reviewer.surname, review.reviewer.givenNames).normalized;
    const key = `${normalized}|${review.reviewer.affiliation || ""}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduplicated.push(review);
  }

  return deduplicated;
}

/**
 * Format full name from surname and given names
 */
export function formatFullName(surname: string, givenNames: string | null): string {
  return givenNames ? `${givenNames} ${surname}` : surname;
}
