# F1000Research Scraper

Web scraper for importing medical research articles from F1000Research into the manuscript review system.

## Overview

This scraper extracts published research articles from F1000Research and automatically imports them into the database as manuscripts with full metadata (title, abstract, authors, keywords, URLs).

### What it does

1. **Fetches article listings** from F1000Research browse pages
2. **Parses HTML** to extract article metadata using cheerio
3. **Enhances metadata** by visiting individual article pages for detailed info
4. **Deduplicates** articles using multiple strategies (title, URL, article ID)
5. **Stores to database** via Prisma with proper relationships (manuscripts, authors, sources)

### Current Status

This is a working production scraper that:

- Runs on a nightly cron schedule (2 AM daily via Vercel cron)
- Can be triggered manually via admin API
- Can be run locally via CLI for bulk imports
- Has successfully imported hundreds of articles

## Quick Start

### CLI Usage

```bash
# Basic usage - scrape 10 pages with default settings
npm run scrape:bulk

# Quick test - scrape 3 pages
npm run scrape:quick

# Deep scrape - scrape 20 pages (takes longer)
npm run scrape:deep

# Advanced usage with custom options
tsx scraper/run-bulk-scraper.ts --pages 5 --delay 3000 --batch 3

# See all options
tsx scraper/run-bulk-scraper.ts --help
```

### Via Admin API

```bash
# Trigger manual scraping via API (requires admin auth)
curl -X POST http://localhost:3010/api/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{"pages": 5, "delay": 2000, "batchSize": 5}'
```

### Automated (Cron)

The scraper runs automatically every night at 2 AM via Vercel cron:

- Endpoint: `/api/cron/scrape-daily`
- Schedule: `0 2 * * *` (configured in `vercel.json`)
- Settings: 5 pages, 1500ms delay, batch size 3

## Configuration

### Command Line Options

| Option      | Default                        | Description                        |
| ----------- | ------------------------------ | ---------------------------------- |
| `--url`     | F1000Research medical articles | Base URL to scrape                 |
| `--pages`   | 10                             | Maximum pages to scrape            |
| `--delay`   | 2000                           | Delay between requests (ms)        |
| `--retries` | 3                              | Maximum retries per request        |
| `--batch`   | 5                              | Batch size for database operations |

### Default Configuration

```typescript
{
  baseUrl: 'https://f1000research.com/browse/articles?term=Medical_and_health_sciences',
  maxPages: 10,
  delayMs: 2000,
  maxRetries: 3,
  batchSize: 5,
}
```

### Presets (via npm scripts)

- **scrape:bulk** - Default (10 pages, 2000ms delay)
- **scrape:quick** - Fast test (3 pages, 1500ms delay)
- **scrape:deep** - Thorough scrape (20 pages, 3000ms delay)

## Architecture

### Files

```
scraper/
├── README.md                    # This file
├── run-bulk-scraper.ts         # Main scraper implementation
└── update-scraped-status.ts    # Utility to update article status
```

### Main Components

#### `ProgrammaticBulkScraper` Class

The core scraper class that handles the entire scraping workflow:

**Key Methods:**

- `run()` - Main entry point, orchestrates full scrape
- `scrapePage(page)` - Fetches and parses a single page
- `parseArticlesFromHtml(html)` - Extracts articles from HTML
- `enhanceArticleMetadata(article)` - Gets detailed metadata from article pages
- `processBatch(articles)` - Saves articles to database

**Features:**

- Exponential backoff retry logic
- Rate limiting with configurable delays
- Batch processing for database efficiency
- Multiple duplicate detection strategies
- Detailed progress logging

### Data Flow

```
F1000Research Website
    ↓ (fetch with retry)
HTML Pages
    ↓ (cheerio parsing)
Article Metadata (basic)
    ↓ (enhance with individual page requests)
Article Metadata (detailed)
    ↓ (deduplicate & validate)
Database via Prisma
```

### Duplicate Detection

The scraper uses multiple strategies to avoid duplicates:

1. **Exact title match** - Direct comparison
2. **Normalized title match** - Handles minor variations (punctuation, whitespace)
3. **URL matching** - Exact URL comparison
4. **Normalized URL** - Handles http/https, trailing slashes, query params
5. **Article ID extraction** - Extracts F1000Research article ID from URL

### Metadata Extraction

**From Browse Pages:**

- Article title
- Article URL
- Basic abstract (if visible)
- Author names (from various HTML structures)

**From Individual Article Pages:**

- Authors from `<meta name="citation_author">` tags
- Abstract from `<meta name="citation_abstract">` or `.abstract-content`
- Keywords from `<meta name="citation_keywords">` tags

## Integration Points

### 1. Admin Dashboard API (`src/app/api/admin/scrape/route.ts`)

Allows admins to trigger manual scraping jobs:

```typescript
import { ProgrammaticBulkScraper } from "../../../../../scraper/run-bulk-scraper";

// POST /api/admin/scrape
// Body: { pages?, delay?, batchSize?, url? }
```

**Security:** Requires authenticated admin session

**Limits:**

- Max 20 pages per request
- Min 1000ms delay

### 2. Daily Cron Job (`src/app/api/cron/scrape-daily/route.ts`)

Automated nightly scraping:

```typescript
import { ProgrammaticBulkScraper } from "../../../../../scraper/run-bulk-scraper";

// GET /api/cron/scrape-daily
// Triggered by Vercel cron at 2 AM daily
```

**Security:** Protected by `CRON_SECRET` environment variable

**Configuration:** 5 pages, 1500ms delay, batch size 3 (optimized for cron timeouts)

### 3. NPM Scripts (`package.json`)

```json
{
  "scrape:bulk": "tsx scraper/run-bulk-scraper.ts",
  "scrape:quick": "tsx scraper/run-bulk-scraper.ts --pages 3 --delay 1500",
  "scrape:deep": "tsx scraper/run-bulk-scraper.ts --pages 20 --delay 3000",
  "fix:scraped-status": "tsx scraper/update-scraped-status.ts"
}
```

## Database Schema

### Created Records

The scraper creates three types of records:

**Manuscript**

```typescript
{
  title: string
  abstract?: string
  keywords: string[]
  status: 'PUBLISHED'  // F1000Research articles are already published
}
```

**Author** (linked to Manuscript)

```typescript
{
  name: string;
  email: null;
  affiliation: null;
}
```

**Source** (links Manuscript to F1000Research)

```typescript
{
  sourceId: "F1000Research";
  url: string; // Original article URL
}
```

### Source Record

The scraper creates/uses a single `Source` record:

```typescript
{
  name: 'F1000Research',
  baseUrl: 'https://f1000research.com',
  description: 'F1000Research is an open research publishing platform'
}
```

## Output & Logging

### Progress Indicators

```
🚀 Starting programmatic bulk scraping...
📄 Scraping page 1/10...
   ✅ Found 25 articles on page 1
   ⏳ Waiting 2000ms before next page...
💾 Processing 250 articles in batches of 5...
   📦 Processing batch 1/50 (5 articles)
     ✅ Created: Advances in immunotherapy for cancer treatment...
     ⏭️  Skipping duplicate: COVID-19 vaccine efficacy study...
```

### Summary Report

```
============================================================
📊 BULK SCRAPING SUMMARY
============================================================
⏱️  Duration: 145.3 seconds
✅ Articles scraped: 187
⏭️  Duplicates skipped: 63
❌ Errors: 0
📄 Pages processed: 10
⚡ Average rate: 77.2 articles/minute
============================================================
```

## Utility Scripts

### `update-scraped-status.ts`

Updates F1000Research manuscripts from DRAFT to PUBLISHED status:

```bash
npm run fix:scraped-status
```

**Use case:** If articles were imported with wrong status, this fixes them in bulk.

## Rate Limiting & Ethics

### Current Rate Limits

- **Default delay**: 2000ms between page requests
- **Batch delay**: 500ms between database batches
- **Retry backoff**: Exponential (1s, 2s, 4s, max 10s)

### Best Practices

1. **Respect robots.txt** - Currently scraping browse pages (public)
2. **Use delays** - Minimum 1000ms between requests
3. **Set User-Agent** - Identifies as a browser to avoid blocks
4. **Handle errors gracefully** - Retry with backoff, log failures
5. **Run during off-peak** - Cron job runs at 2 AM

## Troubleshooting

### Common Issues

**Problem: Timeout errors**

- Solution: Reduce `maxPages` or increase `delayMs`
- For cron jobs: Use smaller batches (5 pages max)

**Problem: Duplicates not detected**

- Check: Different article URLs or title variations
- Solution: Run `npm run fix:scraped-status` to normalize

**Problem: Missing metadata (authors, abstract)**

- Check: HTML structure may have changed on F1000Research
- Solution: Update selectors in `parseArticlesFromHtml()` and `enhanceArticleMetadata()`

**Problem: HTTP 429 (Rate Limited)**

- Solution: Increase `delayMs` (try 3000-5000ms)
- Solution: Reduce `maxPages` per run

### Debug Mode

To see detailed logs, run directly with tsx:

```bash
tsx scraper/run-bulk-scraper.ts --pages 1 --delay 5000
```

This will show:

- Each HTTP request URL
- Retry attempts
- Duplicate detection logic
- Database operations

## Future Improvements

Potential enhancements for the future:

1. **Refactor into modules** - Separate parsing, fetching, storage logic
2. **Add tests** - Unit tests for parsing, integration tests for full flow
3. **Support multiple sources** - Extend beyond F1000Research
4. **Incremental updates** - Only scrape new articles since last run
5. **Better error handling** - Categorize errors, add alerting
6. **Metrics dashboard** - Track scraping success rates over time
7. **Configuration file** - Move config out of code into JSON/YAML

## Dependencies

- **cheerio** - HTML parsing
- **@prisma/client** - Database access
- **tsx** - TypeScript execution

## Performance

### Typical Performance

- **Speed**: ~60-80 articles/minute
- **Pages/minute**: ~0.4 pages (with 2000ms delay)
- **10-page scrape**: ~2-3 minutes
- **Cron job (5 pages)**: ~70-90 seconds

### Optimization Tips

- Increase `batchSize` for faster database writes (but watch memory)
- Decrease `delayMs` if not rate limited (but be respectful)
- Use `scrape:quick` for testing to avoid long waits

## License

Part of the Manuscript Review Tracker project (MIT License)
