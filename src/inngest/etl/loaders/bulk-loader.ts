/**
 * Bulk Loader
 *
 * Processes multiple manuscripts at once with batch inserts
 * for maximum performance
 */

import type { Prisma, PrismaClient } from "@prisma/client";
import type { TransformedManuscriptData } from "../transformers";
import { formatFullName } from "../transformers/helpers";

export interface BulkLoadResult {
  manuscriptsCreated: number;
  authorsCreated: number;
  reviewersCreated: number;
  reviewsCreated: number;
  skipped: number;
}

/**
 * Bulk load multiple manuscripts with their authors, reviewers, and reviews
 * This function aggregates all data and uses batch inserts for efficiency
 */
export async function bulkLoadManuscripts(
  manuscripts: Array<{ doi: string; data: TransformedManuscriptData }>,
  prisma: PrismaClient | Prisma.TransactionClient
): Promise<BulkLoadResult> {
  const result: BulkLoadResult = {
    manuscriptsCreated: 0,
    authorsCreated: 0,
    reviewersCreated: 0,
    reviewsCreated: 0,
    skipped: 0,
  };

  if (manuscripts.length === 0) {
    return result;
  }

  // Step 1: Filter out already-processed manuscripts
  const dois = manuscripts.map((m) => m.doi);
  const existingSources = await prisma.manuscriptSource.findMany({
    where: { doi: { in: dois } },
    select: { doi: true },
  });
  const processedDois = new Set(existingSources.map((s) => s.doi));

  const unprocessedManuscripts = manuscripts.filter(
    (m) => !processedDois.has(m.doi)
  );

  result.skipped = manuscripts.length - unprocessedManuscripts.length;

  if (unprocessedManuscripts.length === 0) {
    return result;
  }

  // Step 2: Aggregate all unique authors across all manuscripts
  const allAuthors = unprocessedManuscripts.flatMap((m) => m.data.authors);

  // Deduplicate authors by ORCID or name+email
  const authorMap = new Map<string, typeof allAuthors[0]>();
  for (const author of allAuthors) {
    const key = author.orcId || `${author.surname}|${author.givenNames}|${author.email || ""}`;
    if (!authorMap.has(key)) {
      authorMap.set(key, author);
    }
  }
  const uniqueAuthors = Array.from(authorMap.values());

  // Step 3: Aggregate all unique reviewers across all manuscripts
  const allReviewers = unprocessedManuscripts.flatMap((m) =>
    m.data.reviews.map((r) => r.reviewer)
  );

  console.log(`[BULK LOADER] Total reviews before deduplication: ${allReviewers.length}`);

  // Deduplicate reviewers by NAME + AFFILIATION
  const reviewerMap = new Map<string, typeof allReviewers[0]>();
  for (const reviewer of allReviewers) {
    const fullName = formatFullName(reviewer.surname, reviewer.givenNames);
    const key = `${fullName}|${reviewer.affiliation || ""}`;
    if (!reviewerMap.has(key)) {
      reviewerMap.set(key, reviewer);
    }
  }
  const uniqueReviewers = Array.from(reviewerMap.values());

  console.log(`[BULK LOADER] Unique reviewers after deduplication: ${uniqueReviewers.length}`);

  // Step 4: Bulk insert authors
  if (uniqueAuthors.length > 0) {
    const authorsToCreate = uniqueAuthors.map((author) => ({
      name: formatFullName(author.surname, author.givenNames),
      email: author.email || null,
      orcId: author.orcId || null,
      affiliation: author.affiliation || null,
    }));

    const batchResult = await prisma.author.createMany({
      data: authorsToCreate,
      skipDuplicates: true,
    });

    result.authorsCreated = batchResult.count;
  }

  // Step 5: Bulk insert reviewers
  if (uniqueReviewers.length > 0) {
    console.log(`[BULK LOADER] Attempting to create ${uniqueReviewers.length} unique reviewers`);

    const reviewersToCreate = uniqueReviewers.map((reviewer) => ({
      name: formatFullName(reviewer.surname, reviewer.givenNames),
      affiliation: reviewer.affiliation || null,
    }));

    console.log(`[BULK LOADER] First 5 reviewers to create:`, reviewersToCreate.slice(0, 5));

    const batchResult = await prisma.reviewer.createMany({
      data: reviewersToCreate,
      skipDuplicates: true,
    });

    console.log(`[BULK LOADER] Created ${batchResult.count} reviewers (attempted ${reviewersToCreate.length})`);
    result.reviewersCreated = batchResult.count;
  }

  // Step 6: Fetch all author and reviewer IDs we'll need
  const authorOrcIds = uniqueAuthors.filter((a) => a.orcId).map((a) => a.orcId!);
  const authorNames = uniqueAuthors.map((a) => formatFullName(a.surname, a.givenNames));

  const [dbAuthors, dbReviewers] = await Promise.all([
    prisma.author.findMany({
      where: {
        OR: [
          { orcId: { in: authorOrcIds } },
          { name: { in: authorNames } },
        ],
      },
      select: { id: true, name: true, orcId: true, email: true },
    }),
    prisma.reviewer.findMany({
      select: { id: true, name: true, affiliation: true },
    }),
  ]);

  // Create lookup maps
  const authorIdByOrcId = new Map(dbAuthors.filter((a) => a.orcId).map((a) => [a.orcId, a.id]));
  const authorIdByNameEmail = new Map(
    dbAuthors.map((a) => [`${a.name}|${a.email || ""}`, a.id])
  );
  const reviewerIdByNameAffiliation = new Map(
    dbReviewers.map((r) => [`${r.name}|${r.affiliation || ""}`, r.id])
  );

  // Step 7: Create each manuscript with its relationships
  for (const { doi, data } of unprocessedManuscripts) {
    // Create the manuscript with version and source
    const manuscript = await prisma.manuscript.create({
      data: data.manuscript,
      include: {
        versions: true,
        sources: true,
      },
    });

    result.manuscriptsCreated++;

    // Get author IDs for this manuscript
    const manuscriptAuthorIds: string[] = [];
    for (const author of data.authors) {
      let authorId: string | undefined;

      if (author.orcId && authorIdByOrcId.has(author.orcId)) {
        authorId = authorIdByOrcId.get(author.orcId);
      } else {
        const fullName = formatFullName(author.surname, author.givenNames);
        const key = `${fullName}|${author.email || ""}`;
        authorId = authorIdByNameEmail.get(key);
      }

      if (authorId) {
        manuscriptAuthorIds.push(authorId);
      }
    }

    // Connect authors to manuscript
    if (manuscriptAuthorIds.length > 0) {
      await prisma.manuscript.update({
        where: { id: manuscript.id },
        data: {
          authors: {
            connect: manuscriptAuthorIds.map((id) => ({ id })),
          },
        },
      });
    }

    // Create reviews
    const versionId = manuscript.versions[0].id;
    const reviewsToCreate = data.reviews.map((review) => {
      const reviewer = review.reviewer;
      const fullName = formatFullName(reviewer.surname, reviewer.givenNames);
      const key = `${fullName}|${reviewer.affiliation || ""}`;
      const reviewerId = reviewerIdByNameAffiliation.get(key);

      if (!reviewerId) {
        throw new Error(`Reviewer not found for ${fullName} @ ${reviewer.affiliation || "N/A"}`);
      }

      return {
        versionId,
        reviewerId,
        reviewType: "EXTERNAL" as const,
        content: review.content,
        documentType: "FREE_TEXT" as const,
      };
    });

    if (reviewsToCreate.length > 0) {
      await prisma.review.createMany({
        data: reviewsToCreate,
      });

      result.reviewsCreated += reviewsToCreate.length;
    }
  }

  return result;
}
