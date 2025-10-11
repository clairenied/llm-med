#!/usr/bin/env tsx

import { prisma } from "../src/lib/prisma";
import * as cheerio from "cheerio";

async function extractAuthorsFromUrl(url: string): Promise<string[]> {
  try {
    console.log(`Fetching authors from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch: ${url}`);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const authors: string[] = [];
    $('meta[name="citation_author"]').each((_, element) => {
      const author = $(element).attr("content");
      if (author && author.trim()) {
        authors.push(author.trim());
      }
    });

    console.log(`Found ${authors.length} authors: ${authors.join(", ")}`);
    return authors;
  } catch (error) {
    console.error(`Error fetching authors from ${url}:`, error);
    return [];
  }
}

async function createAuthorIfNotExists(name: string) {
  const existingAuthor = await prisma.author.findFirst({
    where: { name },
  });

  if (existingAuthor) {
    return existingAuthor;
  }

  return await prisma.author.create({
    data: { name },
  });
}

async function fixMissingAuthors() {
  console.log("🔍 Finding manuscripts without authors...");

  const manuscriptsWithoutAuthors = await prisma.manuscript.findMany({
    where: {
      authors: {
        none: {},
      },
    },
    include: {
      sources: true,
      authors: true,
    },
  });

  console.log(
    `Found ${manuscriptsWithoutAuthors.length} manuscripts without authors`,
  );

  for (const manuscript of manuscriptsWithoutAuthors) {
    console.log(`\n📄 Processing: ${manuscript.title}`);

    // Get the first source URL to extract authors from
    const sourceUrl = manuscript.sources[0]?.url;
    if (!sourceUrl) {
      console.log("   ⚠️  No source URL found, skipping");
      continue;
    }

    const authorNames = await extractAuthorsFromUrl(sourceUrl);
    if (authorNames.length === 0) {
      console.log("   ⚠️  No authors found, skipping");
      continue;
    }

    // Create authors and connect them to the manuscript
    const authorIds: string[] = [];
    for (const authorName of authorNames) {
      const author = await createAuthorIfNotExists(authorName);
      authorIds.push(author.id);
    }

    // Update the manuscript to connect the authors
    await prisma.manuscript.update({
      where: { id: manuscript.id },
      data: {
        authors: {
          connect: authorIds.map((id) => ({ id })),
        },
      },
    });

    console.log(`   ✅ Added ${authorNames.length} authors to manuscript`);

    // Add a small delay to be respectful to the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n🎉 Finished fixing missing authors!");
}

// Run the script
fixMissingAuthors()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
