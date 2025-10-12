import { z } from "zod";

/**
 * Scraper Configuration Schema
 * Validates and provides type safety for scraper configuration
 */
export const ScraperConfigSchema = z.object({
  // Source configuration
  baseUrl: z
    .string()
    .url()
    .default(
      "https://f1000research.com/browse/articles?term=Medical_and_health_sciences",
    ),

  // Scraping limits
  maxPages: z.number().int().min(1).max(100).default(10),

  // Rate limiting
  delayMs: z.number().int().min(0).max(10000).default(2000),
  maxRetries: z.number().int().min(0).max(5).default(3),

  // Batch processing
  batchSize: z.number().int().min(1).max(20).default(5),

  // Concurrency limits
  maxConcurrentPages: z.number().int().min(1).max(10).default(3),
  maxConcurrentArticles: z.number().int().min(1).max(50).default(10),

  // Rate limit for article fetching (requests per second)
  articleRateLimit: z.number().int().min(1).max(50).default(10),
});

export type ScraperConfig = z.infer<typeof ScraperConfigSchema>;

/**
 * Get scraper configuration from environment variables with defaults
 */
export function getScraperConfig(
  overrides?: Partial<ScraperConfig>,
): ScraperConfig {
  const envConfig = {
    baseUrl: process.env.SCRAPER_BASE_URL,
    maxPages: process.env.SCRAPER_MAX_PAGES
      ? parseInt(process.env.SCRAPER_MAX_PAGES, 10)
      : undefined,
    delayMs: process.env.SCRAPER_DELAY_MS
      ? parseInt(process.env.SCRAPER_DELAY_MS, 10)
      : undefined,
    maxRetries: process.env.SCRAPER_MAX_RETRIES
      ? parseInt(process.env.SCRAPER_MAX_RETRIES, 10)
      : undefined,
    batchSize: process.env.SCRAPER_BATCH_SIZE
      ? parseInt(process.env.SCRAPER_BATCH_SIZE, 10)
      : undefined,
    maxConcurrentPages: process.env.SCRAPER_CONCURRENT_PAGES
      ? parseInt(process.env.SCRAPER_CONCURRENT_PAGES, 10)
      : undefined,
    maxConcurrentArticles: process.env.SCRAPER_CONCURRENT_ARTICLES
      ? parseInt(process.env.SCRAPER_CONCURRENT_ARTICLES, 10)
      : undefined,
    articleRateLimit: process.env.SCRAPER_ARTICLE_RATE_LIMIT
      ? parseInt(process.env.SCRAPER_ARTICLE_RATE_LIMIT, 10)
      : undefined,
  };

  // Remove undefined values
  const cleanedEnvConfig = Object.fromEntries(
    Object.entries(envConfig).filter(([, v]) => v !== undefined),
  );

  // Merge env config with overrides
  const mergedConfig = {
    ...cleanedEnvConfig,
    ...overrides,
  };

  // Parse and validate with defaults
  return ScraperConfigSchema.parse(mergedConfig);
}

/**
 * Standard HTTP headers for scraping
 */
export const SCRAPING_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
} as const;
