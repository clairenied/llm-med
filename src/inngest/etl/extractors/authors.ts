/**
 * Authors Extractor
 *
 * Extracts author information from F1000Research JATS XML using Cheerio
 */

import * as cheerio from "cheerio";
import type { ExtractedAuthor } from "../types";

/**
 * Extract authors from F1000Research XML
 * Authors are in <contrib contrib-type="author"> elements in the main article
 */
export function extractAuthors(xmlString: string): ExtractedAuthor[] {
  const $ = cheerio.load(xmlString, {
    xml: {
      xmlMode: true,
      decodeEntities: true,
    },
  });

  const authors: ExtractedAuthor[] = [];

  // Find all author contributors in the main article (not in sub-articles/reviews)
  $("article > front > article-meta > contrib-group > contrib[contrib-type='author']").each(
    (_, contribEl) => {
      const $contrib = $(contribEl);

      // Extract name parts
      const surname = $contrib.find("name > surname").first().text().trim();
      const givenNames = $contrib.find("name > given-names").first().text().trim() || null;

      // Skip if no surname (invalid author)
      if (!surname) {
        return;
      }

      // Extract ORCID - check both formats
      let orcId: string | null = null;

      // Check for contrib-id format (older format)
      orcId = $contrib
        .find("contrib-id[contrib-id-type='orcid']")
        .first()
        .text()
        .trim() || null;

      // Check for uri format (F1000 format)
      if (!orcId) {
        orcId = $contrib
          .find("uri[content-type='orcid']")
          .first()
          .text()
          .trim() || null;
      }

      // Clean ORCID (remove URL prefix if present)
      if (orcId && orcId.startsWith("http")) {
        orcId = orcId.split("/").pop() || null;
      }

      // Extract email - check both direct email and corresp reference
      let email: string | null = null;

      // First, check for direct email in contrib
      const directEmail = $contrib.find("email").first().text().trim();
      if (directEmail) {
        email = directEmail;
      } else {
        // Check for corresp reference (F1000 format)
        const correspRef = $contrib.find("xref[ref-type='corresp']").first().attr("rid");
        if (correspRef) {
          // Find the corresponding corresp element in author-notes
          const correspEmail = $(`author-notes > corresp[id='${correspRef}'] > email`).first().text().trim();
          if (correspEmail) {
            email = correspEmail;
          }
        }
      }

      // Extract affiliation (concatenate all aff elements for this contributor)
      const affiliations: string[] = [];
      $contrib.find("aff").each((_, affEl) => {
        const affText = $(affEl).text().trim();
        if (affText) {
          affiliations.push(affText);
        }
      });

      // Also check for xref to aff elements by id
      const affRefs: string[] = [];
      $contrib.find("xref[ref-type='aff']").each((_, xrefEl) => {
        const rid = $(xrefEl).attr("rid");
        if (rid) {
          affRefs.push(rid);
        }
      });

      // Fetch referenced affiliations
      affRefs.forEach((rid) => {
        const affText = $(`aff[id='${rid}']`).text().trim();
        if (affText) {
          affiliations.push(affText);
        }
      });

      const affiliation = affiliations.length > 0 ? affiliations.join("; ") : null;

      authors.push({
        surname,
        givenNames,
        email,
        orcId,
        affiliation,
      });
    }
  );

  return authors;
}
