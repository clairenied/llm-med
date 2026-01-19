/**
 * ETL Types - Intermediate data structures
 *
 * These types represent extracted data from XML before transformation to Prisma schema.
 * They are schema-agnostic to allow flexibility when the Prisma schema changes.
 */

/**
 * Extracted article metadata
 */
export interface ExtractedArticle {
  doi: string;
  title: string;
  abstract: string | null;
  keywords: string[];
  articleType: string | null; // e.g., "research-article", "review-article", "systematic-review"
  publishedDate: Date | null;
  versionNumber: number;
  url: string;
}

/**
 * Extracted author information
 */
export interface ExtractedAuthor {
  surname: string;
  givenNames: string | null;
  email: string | null;
  orcId: string | null;
  affiliation: string | null;
}

/**
 * Extracted reviewer information
 */
export interface ExtractedReviewer {
  surname: string;
  givenNames: string | null;
  affiliation: string | null;
  // Role is typically "Referee" in F1000
  role: string | null;
}

/**
 * Extracted review/referee report
 */
export interface ExtractedReview {
  reviewer: ExtractedReviewer;
  content: string;
  articleTitle: string | null; // e.g., "Reviewer response for version 1"
  subArticleId: string | null; // e.g., "report144207"
  doi: string | null; // Review-specific DOI if available
  reviewedVersionNumber: number | null; // Which version this review was written for (1, 2, 3, etc.)
}

/**
 * Complete extracted document with all related data
 */
export interface ExtractedDocument {
  article: ExtractedArticle;
  authors: ExtractedAuthor[];
  reviews: ExtractedReview[];
}

/**
 * Normalized name for deduplication
 */
export interface NormalizedName {
  surname: string;
  givenNames: string | null;
  normalized: string; // Lowercase, trimmed version for comparison
}

/**
 * Helper to normalize names for deduplication
 */
export function normalizeName(surname: string, givenNames: string | null): NormalizedName {
  const normalizedSurname = surname.toLowerCase().trim();
  const normalizedGiven = givenNames?.toLowerCase().trim() || null;
  const normalized = normalizedGiven
    ? `${normalizedSurname}, ${normalizedGiven}`
    : normalizedSurname;

  return {
    surname,
    givenNames,
    normalized,
  };
}

/**
 * Extract version number from DOI
 * F1000 DOIs end with .{version} for versions > 1
 * e.g., "10.12688/f1000research.122344.2" = version 2
 */
export function extractVersionFromDoi(doi: string): number {
  const match = doi.match(/\.(\d+)$/);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Generate F1000Research article URL from DOI
 */
export function generateF1000Url(doi: string): string {
  return `https://f1000research.com/articles/${doi}`;
}
