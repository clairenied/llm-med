#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import * as cheerio from 'cheerio';

const prisma = new PrismaClient();

interface ScrapingConfig {
  baseUrl: string;
  maxPages: number;
  delayMs: number;
  maxRetries: number;
  batchSize: number;
}

interface ScrapedArticle {
  title: string;
  url: string;
  abstract?: string;
  authors?: string[];
  keywords?: string[];
}

class ProgrammaticBulkScraper {
  private config: ScrapingConfig;
  private scrapedCount = 0;
  private duplicateCount = 0;
  private errorCount = 0;

  constructor(config: ScrapingConfig) {
    this.config = config;
  }

  async run(): Promise<void> {
    console.log('🚀 Starting programmatic bulk scraping...');
    console.log(`📋 Configuration:`, {
      baseUrl: this.config.baseUrl,
      maxPages: this.config.maxPages,
      delayMs: this.config.delayMs,
      maxRetries: this.config.maxRetries,
      batchSize: this.config.batchSize,
    });

    const startTime = Date.now();
    const allArticles: ScrapedArticle[] = [];

    try {
      // Scrape articles from multiple pages
      for (let page = 1; page <= this.config.maxPages; page++) {
        console.log(`\n📄 Scraping page ${page}/${this.config.maxPages}...`);
        
        const pageArticles = await this.scrapePage(page);
        allArticles.push(...pageArticles);
        
        console.log(`   ✅ Found ${pageArticles.length} articles on page ${page}`);
        
        // Delay between pages to avoid rate limiting
        if (page < this.config.maxPages) {
          console.log(`   ⏳ Waiting ${this.config.delayMs}ms before next page...`);
          await this.delay(this.config.delayMs);
        }
      }

      // Process articles in batches
      console.log(`\n💾 Processing ${allArticles.length} articles in batches of ${this.config.batchSize}...`);
      await this.processArticlesInBatches(allArticles);

      const duration = (Date.now() - startTime) / 1000;
      this.printSummary(duration);

    } catch (error) {
      console.error('❌ Bulk scraping failed:', error);
      throw error;
    }
  }

  private async scrapePage(page: number): Promise<ScrapedArticle[]> {
    const url = `${this.config.baseUrl}&page=${page}`;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`   🔍 Fetching: ${url} (attempt ${attempt})`);
        
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        return this.parseArticlesFromHtml(html);

      } catch (error) {
        console.log(`   ⚠️  Attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
        
        if (attempt === this.config.maxRetries) {
          this.errorCount++;
          console.log(`   ❌ All attempts failed for page ${page}`);
          return [];
        }
        
        // Exponential backoff
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`   ⏳ Retrying in ${backoffDelay}ms...`);
        await this.delay(backoffDelay);
      }
    }

    return [];
  }

  private parseArticlesFromHtml(html: string): ScrapedArticle[] {
    const $ = cheerio.load(html);
    const articles: ScrapedArticle[] = [];

    // Look for article links
    $('a[href*="/articles/"]').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      const title = $link.text().trim();

      if (href && title && title.length > 10) {
        const fullUrl = href.startsWith('http') ? href : `https://f1000research.com${href}`;
        
        // Extract additional metadata if available
        const $parent = $link.closest('.article-item, .search-result, .article-card');
        const abstract = $parent.find('.abstract, .summary').text().trim() || undefined;
        
        // Try to extract authors from various sources
        let authors: string[] | undefined;
        
        // Method 1: Look for author elements in the parent
        const authorText = $parent.find('.authors, .author-list, .author-names').text().trim();
        if (authorText) {
          authors = authorText.split(',').map(a => a.trim()).filter(a => a.length > 0);
        }
        
        // Method 2: Look for author links
        if (!authors || authors.length === 0) {
          const authorLinks = $parent.find('a[href*="/authors/"], .author-link').map((_, el) => $(el).text().trim()).get();
          if (authorLinks.length > 0) {
            authors = authorLinks.filter(a => a.length > 0);
          }
        }

        articles.push({
          title,
          url: fullUrl,
          abstract: abstract && abstract.length > 20 ? abstract : undefined,
          authors: authors && authors.length > 0 ? authors : undefined,
          keywords: undefined, // Could be extracted if available in the HTML
        });
      }
    });

    return articles;
  }

  private async processArticlesInBatches(articles: ScrapedArticle[]): Promise<void> {
    for (let i = 0; i < articles.length; i += this.config.batchSize) {
      const batch = articles.slice(i, i + this.config.batchSize);
      console.log(`   📦 Processing batch ${Math.floor(i / this.config.batchSize) + 1}/${Math.ceil(articles.length / this.config.batchSize)} (${batch.length} articles)`);
      
      await this.processBatch(batch);
      
      // Small delay between batches
      if (i + this.config.batchSize < articles.length) {
        await this.delay(500);
      }
    }
  }

  private async enhanceArticleMetadata(article: ScrapedArticle): Promise<ScrapedArticle> {
    try {
      // Fetch the individual article page to get detailed metadata
      const response = await fetch(article.url);
      if (!response.ok) {
        console.warn(`Failed to fetch article page: ${article.url}`);
        return article;
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract authors from meta tags
      const authors: string[] = [];
      $('meta[name="citation_author"]').each((_, element) => {
        const author = $(element).attr('content');
        if (author && author.trim()) {
          authors.push(author.trim());
        }
      });
      
      // Extract abstract if not already present
      let abstract = article.abstract;
      if (!abstract) {
        const abstractText = $('meta[name="citation_abstract"]').attr('content') || 
                           $('.abstract-content, .article-abstract').text().trim();
        if (abstractText && abstractText.length > 20) {
          abstract = abstractText;
        }
      }
      
      // Extract keywords
      const keywords: string[] = [];
      $('meta[name="citation_keywords"]').each((_, element) => {
        const keyword = $(element).attr('content');
        if (keyword && keyword.trim()) {
          keywords.push(keyword.trim());
        }
      });
      
      return {
        ...article,
        authors: authors.length > 0 ? authors : article.authors,
        abstract: abstract || article.abstract,
        keywords: keywords.length > 0 ? keywords : article.keywords,
      };
    } catch (error) {
      console.warn(`Error enhancing metadata for ${article.url}:`, error);
      return article;
    }
  }

  private async processBatch(articles: ScrapedArticle[]): Promise<void> {
    // First enhance all articles with detailed metadata
    const enhancedArticles = await Promise.all(articles.map(article => this.enhanceArticleMetadata(article)));
    
    for (const article of enhancedArticles) {
      try {
        // Normalize title and URL for better duplicate detection
        const normalizedTitle = this.normalizeTitle(article.title);
        const normalizedUrl = this.normalizeUrl(article.url);

        // Check if article already exists with multiple strategies
        const existing = await prisma.manuscript.findFirst({
          where: {
            OR: [
              // Exact title match
              { title: article.title },
              // Normalized title match (handles minor variations)
              { title: normalizedTitle },
              // URL-based matching
              {
                sources: {
                  some: {
                    OR: [
                      { url: article.url },
                      { url: normalizedUrl },
                      // Handle URL variations (http vs https, trailing slashes, etc.)
                      { url: { contains: this.extractArticleId(article.url) } }
                    ]
                  }
                }
              }
            ]
          },
          include: {
            sources: {
              select: { url: true }
            }
          }
        });

        if (existing) {
          this.duplicateCount++;
          console.log(`     ⏭️  Skipping duplicate: ${article.title.substring(0, 50)}...`);
          console.log(`        Existing: ${existing.title.substring(0, 50)}...`);
          continue;
        }

        // Create manuscript with source
        await prisma.$transaction(async (tx) => {
          // Create or get F1000Research source
          const source = await tx.source.upsert({
            where: { name: 'F1000Research' },
            update: {},
            create: {
              name: 'F1000Research',
              baseUrl: 'https://f1000research.com',
              description: 'F1000Research is an open research publishing platform'
            }
          });

          // Create manuscript
          const manuscript = await tx.manuscript.create({
            data: {
              title: article.title,
              abstract: article.abstract,
              keywords: article.keywords || [],
              status: 'PUBLISHED', // F1000Research articles are already published
              authors: article.authors ? {
                create: article.authors.map(name => ({
                  name,
                  email: null,
                  affiliation: null,
                }))
              } : undefined,
              sources: {
                create: {
                  sourceId: source.id,
                  url: article.url,
                }
              }
            }
          });

          this.scrapedCount++;
          console.log(`     ✅ Created: ${manuscript.title.substring(0, 50)}...`);
        });

      } catch (error) {
        this.errorCount++;
        console.log(`     ❌ Error processing "${article.title.substring(0, 30)}...":`, error instanceof Error ? error.message : error);
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove common punctuation variations
      .replace(/[""'']/g, '"')
      .replace(/[–—]/g, '-')
      // Remove trailing punctuation that might vary
      .replace(/[.!?]+$/, '');
  }

  private normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Normalize protocol to https
      urlObj.protocol = 'https:';
      // Remove trailing slash
      urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
      // Remove common tracking parameters
      urlObj.searchParams.delete('utm_source');
      urlObj.searchParams.delete('utm_medium');
      urlObj.searchParams.delete('utm_campaign');
      urlObj.searchParams.delete('ref');
      return urlObj.toString();
    } catch {
      // If URL parsing fails, just clean up basic issues
      return url
        .replace(/^http:/, 'https:')
        .replace(/\/$/, '')
        .toLowerCase();
    }
  }

  private extractArticleId(url: string): string {
    // Extract article ID from F1000Research URLs
    // e.g., https://f1000research.com/articles/12-345 -> "12-345"
    const match = url.match(/\/articles\/([^/?#]+)/);
    return match ? match[1] : '';
  }

  private printSummary(durationSeconds: number): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 BULK SCRAPING SUMMARY');
    console.log('='.repeat(60));
    console.log(`⏱️  Duration: ${durationSeconds.toFixed(1)} seconds`);
    console.log(`✅ Articles scraped: ${this.scrapedCount}`);
    console.log(`⏭️  Duplicates skipped: ${this.duplicateCount}`);
    console.log(`❌ Errors: ${this.errorCount}`);
    console.log(`📄 Pages processed: ${this.config.maxPages}`);
    console.log(`⚡ Average rate: ${(this.scrapedCount / durationSeconds * 60).toFixed(1)} articles/minute`);
    console.log('='.repeat(60));
  }
}

// Default configuration
const DEFAULT_CONFIG: ScrapingConfig = {
  baseUrl: 'https://f1000research.com/browse/articles?term=Medical_and_health_sciences',
  maxPages: 10,
  delayMs: 2000,
  maxRetries: 3,
  batchSize: 5,
};

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  // Parse command line arguments
  const config = { ...DEFAULT_CONFIG };
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i];
    const value = args[i + 1];
    
    switch (key) {
      case '--url':
        config.baseUrl = value;
        break;
      case '--pages':
        config.maxPages = parseInt(value) || config.maxPages;
        break;
      case '--delay':
        config.delayMs = parseInt(value) || config.delayMs;
        break;
      case '--retries':
        config.maxRetries = parseInt(value) || config.maxRetries;
        break;
      case '--batch':
        config.batchSize = parseInt(value) || config.batchSize;
        break;
      case '--help':
        console.log(`
Usage: tsx scripts/run-bulk-scraper.ts [options]

Options:
  --url <url>       Base URL to scrape (default: F1000Research medical articles)
  --pages <num>     Maximum pages to scrape (default: 10)
  --delay <ms>      Delay between requests in milliseconds (default: 2000)
  --retries <num>   Maximum retries per request (default: 3)
  --batch <num>     Batch size for database operations (default: 5)
  --help            Show this help message

Examples:
  tsx scripts/run-bulk-scraper.ts
  tsx scripts/run-bulk-scraper.ts --pages 5 --delay 3000
  tsx scripts/run-bulk-scraper.ts --url "https://f1000research.com/browse/articles?term=COVID" --pages 3
        `);
        process.exit(0);
    }
  }

  try {
    const scraper = new ProgrammaticBulkScraper(config);
    await scraper.run();
    console.log('\n🎉 Bulk scraping completed successfully!');
  } catch (error) {
    console.error('\n💥 Bulk scraping failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

export { ProgrammaticBulkScraper };
export type { ScrapingConfig };
