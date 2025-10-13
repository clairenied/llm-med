/**
 * Reviews Extractor
 *
 * Extracts peer review information from F1000Research JATS XML using Cheerio
 * Reviews are stored in <sub-article article-type="reviewer-report"> elements
 */

import * as cheerio from "cheerio";
import type { Cheerio } from "cheerio";
import type { ExtractedReview, ExtractedReviewer } from "../types";

/**
 * Extract reviews from F1000Research XML
 * Each review includes the reviewer information and review content
 */
export function extractReviews(xmlString: string): ExtractedReview[] {
  const $ = cheerio.load(xmlString, {
    xml: {
      xmlMode: true,
      decodeEntities: true,
    },
  });

  const reviews: ExtractedReview[] = [];

  // Find all reviewer-report sub-articles
  $("sub-article[article-type='reviewer-report']").each((_, subArticleEl) => {
    const $subArticle = $(subArticleEl);

    // Extract sub-article metadata
    const subArticleId = $subArticle.attr("id") || null;

    // Extract review title (e.g., "Reviewer response for version 1")
    const articleTitle =
      $subArticle.find("front-stub > title-group > article-title").first().text().trim() || null;

    // Extract review DOI
    const doi =
      $subArticle
        .find("front-stub > article-id[pub-id-type='doi']")
        .first()
        .text()
        .trim() || null;

    // Extract reviewer information
    const reviewer = extractReviewerFromSubArticle($subArticle);

    if (!reviewer) {
      // Skip if no reviewer found (shouldn't happen, but be defensive)
      return;
    }

    // Extract review content from body
    const content = extractReviewContent($subArticle);

    if (!content) {
      // Skip if no content (shouldn't happen, but be defensive)
      return;
    }

    reviews.push({
      reviewer,
      content,
      articleTitle,
      subArticleId,
      doi,
    });
  });

  return reviews;
}

/**
 * Extract reviewer information from a sub-article element
 */
function extractReviewerFromSubArticle($subArticle: Cheerio<any>): ExtractedReviewer | null {
  // Find the contrib element for the reviewer
  const $contrib = $subArticle
    .find("front-stub > contrib-group > contrib")
    .first();

  if ($contrib.length === 0) {
    return null;
  }

  // Extract name parts
  const surname = $contrib.find("name > surname").first().text().trim();
  const givenNames = $contrib.find("name > given-names").first().text().trim() || null;

  if (!surname) {
    return null;
  }

  // Extract role (usually "Referee")
  const role = $contrib.find("role").first().text().trim() || null;

  // Extract affiliation
  const affiliations: string[] = [];
  $contrib.find("aff").each((_, affEl) => {
    const affText = cheerio.load(affEl, {
      xml: { xmlMode: true, decodeEntities: true }
    })(affEl).text().trim();
    if (affText) {
      affiliations.push(affText);
    }
  });

  // Also check for xref to aff elements by id
  const affRefs: string[] = [];
  $contrib.find("xref[ref-type='aff']").each((_, xrefEl) => {
    const rid = cheerio.load(xrefEl, {
      xml: { xmlMode: true, decodeEntities: true }
    })(xrefEl).attr("rid");
    if (rid) {
      affRefs.push(rid);
    }
  });

  // Fetch referenced affiliations from the sub-article
  affRefs.forEach((rid) => {
    const affText = $subArticle.find(`aff[id='${rid}']`).text().trim();
    if (affText) {
      affiliations.push(affText);
    }
  });

  const affiliation = affiliations.length > 0 ? affiliations.join("; ") : null;

  return {
    surname,
    givenNames,
    affiliation,
    role,
  };
}

/**
 * Extract review content from sub-article body
 * Concatenates all paragraphs and sections
 */
function extractReviewContent($subArticle: Cheerio<any>): string | null {
  const contentParts: string[] = [];

  // Extract all paragraphs from the body
  $subArticle.find("body p").each((_, pEl) => {
    const text = cheerio.load(pEl, {
      xml: { xmlMode: true, decodeEntities: true }
    })(pEl).text().trim();
    if (text) {
      contentParts.push(text);
    }
  });

  // Also extract section titles for context
  $subArticle.find("body sec > title").each((_, titleEl) => {
    const title = cheerio.load(titleEl, {
      xml: { xmlMode: true, decodeEntities: true }
    })(titleEl).text().trim();
    if (title) {
      contentParts.push(`\n## ${title}\n`);
    }
  });

  return contentParts.length > 0 ? contentParts.join("\n\n") : null;
}
