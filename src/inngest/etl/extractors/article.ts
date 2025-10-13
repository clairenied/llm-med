/**
 * Article Metadata Extractor
 *
 * Extracts article metadata from F1000Research JATS XML using Cheerio
 */

import * as cheerio from "cheerio";
import type { ExtractedArticle } from "../types";
import { extractVersionFromDoi, generateF1000Url } from "../types";

/**
 * Extract article metadata from F1000Research XML
 */
export function extractArticleMetadata(xmlString: string): ExtractedArticle {
  const $ = cheerio.load(xmlString, {
    xml: {
      xmlMode: true,
      decodeEntities: true,
    },
  });

  // Extract DOI (primary article DOI, not review DOIs)
  const doi = $("article > front > article-meta > article-id[pub-id-type='doi']")
    .first()
    .text()
    .trim();

  if (!doi) {
    throw new Error("DOI not found in article XML");
  }

  // Extract title
  const title = $("article > front > article-meta > title-group > article-title")
    .first()
    .text()
    .trim();

  if (!title) {
    throw new Error(`Title not found for article ${doi}`);
  }

  // Extract abstract (concatenate all paragraphs)
  const abstractParagraphs: string[] = [];
  $("article > front > article-meta > abstract p").each((_, el) => {
    const text = $(el).text().trim();
    if (text) {
      abstractParagraphs.push(text);
    }
  });
  const abstract = abstractParagraphs.length > 0 ? abstractParagraphs.join("\n\n") : null;

  // Extract keywords
  const keywords: string[] = [];
  $("article > front > article-meta > kwd-group > kwd").each((_, el) => {
    const keyword = $(el).text().trim();
    if (keyword) {
      keywords.push(keyword);
    }
  });

  // Extract article type
  const articleType = $("article").attr("article-type") || null;

  // Extract publication date (try various date types)
  let publishedDate: Date | null = null;
  const pubDateEl = $("article > front > article-meta > pub-date").first();
  if (pubDateEl.length > 0) {
    const year = pubDateEl.find("year").text().trim();
    const month = pubDateEl.find("month").text().trim();
    const day = pubDateEl.find("day").text().trim();

    if (year) {
      // Create date (default to Jan 1 if month/day missing)
      const dateStr = `${year}-${month || "01"}-${day || "01"}`;
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        publishedDate = date;
      }
    }
  }

  // Extract version from DOI
  const versionNumber = extractVersionFromDoi(doi);

  // Generate URL
  const url = generateF1000Url(doi);

  return {
    doi,
    title,
    abstract,
    keywords,
    articleType,
    publishedDate,
    versionNumber,
    url,
  };
}
