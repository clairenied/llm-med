/**
 * Transformers
 *
 * Transform extracted data into Prisma schema structures
 */

import type { Prisma } from "@prisma/client";
import type { ExtractedDocument, ExtractedAuthor, ExtractedReview } from "../types";
import {
  deduplicateAuthors,
  deduplicateReviews,
  formatFullName,
} from "./helpers";

/**
 * Transformed data ready for database insertion
 */
export interface TransformedManuscriptData {
  manuscript: Prisma.ManuscriptCreateInput;
  authors: ExtractedAuthor[]; // Deduplicated
  reviews: ExtractedReview[]; // Deduplicated
}

/**
 * Transform extracted document to Prisma-compatible structure
 * This handles all deduplication and mapping logic
 */
export function transformDocument(
  extracted: ExtractedDocument,
  sourceId: string
): TransformedManuscriptData {
  const { article, authors, reviews } = extracted;

  // Deduplicate authors
  const uniqueAuthors = deduplicateAuthors(authors);

  // Deduplicate reviewers (within this manuscript)
  const uniqueReviews = deduplicateReviews(reviews);

  // Build manuscript create input
  // Note: We'll handle authors and reviews in the loader using separate queries
  // to avoid complex nested creates
  const manuscript: Prisma.ManuscriptCreateInput = {
    title: article.title,
    abstract: article.abstract,
    keywords: article.keywords,
    status: "PUBLISHED", // All F1000 articles in our dataset are published
    versions: {
      create: {
        versionNumber: article.versionNumber,
        documentType: "FREE_TEXT",
        notes: article.articleType ? `Article type: ${article.articleType}` : null,
      },
    },
    sources: {
      create: {
        source: {
          connect: {
            id: sourceId,
          },
        },
        externalId: article.doi.split("/").pop() || article.doi, // Use last part of DOI as external ID
        url: article.url,
        doi: article.doi,
        publishedDate: article.publishedDate,
        articleType: article.articleType,
        peerReviewStatus: reviews.length > 0 ? "Peer reviewed" : "Not peer reviewed",
        isImported: true,
        metadata: {
          versionNumber: article.versionNumber,
          reviewCount: reviews.length,
        },
      },
    },
  };

  return {
    manuscript,
    authors: uniqueAuthors,
    reviews: uniqueReviews,
  };
}

/**
 * Helper to format author for database upsert
 */
export function formatAuthorForUpsert(author: ExtractedAuthor): {
  where: Prisma.AuthorWhereUniqueInput;
  create: Prisma.AuthorCreateInput;
  update: Prisma.AuthorUpdateInput;
} {
  const fullName = formatFullName(author.surname, author.givenNames);

  // Use ORCID as unique key if available, otherwise skip upsert and just create
  if (author.orcId) {
    return {
      where: {
        orcId: author.orcId,
      },
      create: {
        name: fullName,
        email: author.email,
        orcId: author.orcId,
        affiliation: author.affiliation,
      },
      update: {
        name: fullName,
        email: author.email || undefined,
        affiliation: author.affiliation || undefined,
        // Don't update orcId since it's the unique key
      },
    };
  }

  // For authors without ORCID, we'll need to handle them differently in the loader
  // Return a placeholder that the loader will handle specially
  throw new Error("formatAuthorForUpsert should only be called for authors with ORCID");
}

/**
 * Helper to format reviewer for database upsert
 */
export function formatReviewerForUpsert(
  reviewer: ExtractedReviewer,
  code: string
): {
  where: Prisma.ReviewerWhereUniqueInput;
  create: Prisma.ReviewerCreateInput;
  update: Prisma.ReviewerUpdateInput;
} {
  const fullName = formatFullName(reviewer.surname, reviewer.givenNames);

  return {
    where: {
      code,
    },
    create: {
      name: fullName,
      code,
      affiliation: reviewer.affiliation,
    },
    update: {
      name: fullName,
      affiliation: reviewer.affiliation || undefined,
      // Don't update code since it's the unique key
    },
  };
}
