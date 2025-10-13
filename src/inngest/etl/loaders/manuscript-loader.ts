/**
 * Manuscript Loader
 *
 * Loads transformed manuscript data into the database with transactional support
 */

import type { Prisma, PrismaClient } from "@prisma/client";
import type { TransformedManuscriptData } from "../transformers";
import {
  formatAuthorForUpsert,
  formatReviewerForUpsert,
} from "../transformers";

/**
 * Load manuscript data into database
 * This creates the manuscript, connects authors, creates reviewers, and creates reviews
 * All operations are wrapped in a transaction for atomicity
 */
export async function loadManuscript(
  data: TransformedManuscriptData,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<{
  manuscriptId: string;
  authorsCreated: number;
  reviewsCreated: number;
}> {
  // Step 1: Create the manuscript with version and source
  const manuscript = await prisma.manuscript.create({
    data: data.manuscript,
    include: {
      versions: true,
      sources: true,
    },
  });

  // Step 2: Upsert authors and connect them to the manuscript
  const authorIds: string[] = [];
  for (const author of data.authors) {
    if (author.orcId) {
      // Upsert by ORCID
      const formatted = formatAuthorForUpsert(author);
      const dbAuthor = await prisma.author.upsert(formatted);
      authorIds.push(dbAuthor.id);
    } else {
      // No ORCID - check if author exists by name, otherwise create
      const fullName = author.givenNames
        ? `${author.givenNames} ${author.surname}`
        : author.surname;

      const existing = await prisma.author.findFirst({
        where: {
          name: fullName,
          // Also match on email if available for better deduplication
          ...(author.email ? { email: author.email } : {}),
        },
      });

      if (existing) {
        authorIds.push(existing.id);
      } else {
        const dbAuthor = await prisma.author.create({
          data: {
            name: fullName,
            email: author.email,
            affiliation: author.affiliation,
          },
        });
        authorIds.push(dbAuthor.id);
      }
    }
  }

  // Connect authors to manuscript
  if (authorIds.length > 0) {
    await prisma.manuscript.update({
      where: { id: manuscript.id },
      data: {
        authors: {
          connect: authorIds.map((id) => ({ id })),
        },
      },
    });
  }

  // Step 3: Create reviews with reviewers
  let reviewsCreated = 0;
  const versionId = manuscript.versions[0].id; // Get the created version ID

  console.log(`[LOADER] Processing ${data.reviews.length} reviews for manuscript`);

  for (const { review, reviewerCode } of data.reviews) {
    // Look up reviewer by name first (to avoid overwriting by code)
    const fullName = review.reviewer.givenNames
      ? `${review.reviewer.givenNames} ${review.reviewer.surname}`
      : review.reviewer.surname;

    console.log(`[REVIEWER DEBUG] Looking for reviewer: ${fullName}, affiliation: ${review.reviewer.affiliation?.substring(0, 50)}`);

    let reviewer = await prisma.reviewer.findFirst({
      where: {
        name: fullName,
        // Also match on affiliation if available for better deduplication
        ...(review.reviewer.affiliation ? { affiliation: review.reviewer.affiliation } : {}),
      },
    });

    console.log(`[REVIEWER DEBUG] Found existing? ${reviewer ? `Yes: ${reviewer.name} (${reviewer.code})` : 'No'}`);

    // If reviewer doesn't exist, create with a globally unique code
    if (!reviewer) {
      // Find the highest existing code to generate next unique code
      const lastReviewer = await prisma.reviewer.findMany({
        orderBy: { code: 'desc' },
        take: 1,
      });

      let newCode = reviewerCode; // Start with suggested code
      if (lastReviewer.length > 0) {
        // Generate next code: A->B->C...Z->AA->AB...
        const lastCode = lastReviewer[0].code;
        newCode = generateNextCode(lastCode);
      } else {
        newCode = "A"; // First reviewer
      }

      reviewer = await prisma.reviewer.create({
        data: {
          name: fullName,
          code: newCode,
          affiliation: review.reviewer.affiliation,
        },
      });
    }

    // Create review
    await prisma.review.create({
      data: {
        version: {
          connect: { id: versionId },
        },
        reviewer: {
          connect: { id: reviewer.id },
        },
        reviewType: "EXTERNAL", // F1000 reviews are external peer reviews
        content: review.content,
        documentType: "FREE_TEXT",
      },
    });

    reviewsCreated++;
  }

  return {
    manuscriptId: manuscript.id,
    authorsCreated: authorIds.length,
    reviewsCreated,
  };
}

/**
 * Generate the next reviewer code in sequence
 * A -> B -> C -> ... -> Z -> AA -> AB -> ... -> AZ -> BA -> ...
 */
function generateNextCode(currentCode: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Convert code to array of character indices
  const indices: number[] = [];
  for (let i = 0; i < currentCode.length; i++) {
    indices.push(alphabet.indexOf(currentCode[i]));
  }

  // Increment like a base-26 number
  let carry = 1;
  for (let i = indices.length - 1; i >= 0 && carry; i--) {
    indices[i] += carry;
    if (indices[i] >= 26) {
      indices[i] = 0;
      carry = 1;
    } else {
      carry = 0;
    }
  }

  // If we still have carry, we need to add a new letter at the front
  if (carry) {
    indices.unshift(0);
  }

  // Convert back to string
  return indices.map(i => alphabet[i]).join('');
}

/**
 * Check if a manuscript has already been processed
 * This checks if a ManuscriptSource with the given DOI already exists
 */
export async function isManuscriptProcessed(
  doi: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<boolean> {
  const existing = await prisma.manuscriptSource.findFirst({
    where: { doi },
  });

  return existing !== null;
}

/**
 * Load manuscript with idempotency check
 * Skips loading if manuscript already exists
 */
export async function loadManuscriptIdempotent(
  data: TransformedManuscriptData,
  doi: string,
  prisma: PrismaClient | Prisma.TransactionClient,
): Promise<
  | { skipped: true; reason: string }
  | {
      skipped: false;
      manuscriptId: string;
      authorsCreated: number;
      reviewsCreated: number;
    }
> {
  // Check if already processed
  const alreadyProcessed = await isManuscriptProcessed(doi, prisma);

  if (alreadyProcessed) {
    return {
      skipped: true,
      reason: `Manuscript with DOI ${doi} already exists`,
    };
  }

  // Load manuscript
  const result = await loadManuscript(data, prisma);

  return {
    skipped: false,
    ...result,
  };
}
