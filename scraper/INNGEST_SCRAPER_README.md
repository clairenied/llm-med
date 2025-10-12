# Inngest Scraper Implementation

This document describes the event-driven Inngest scraper implementation for F1000Research articles.

## Overview

The scraper has been ported from a monolithic class-based architecture to an event-driven Inngest architecture with 4 core functions that communicate through events.

## Architecture

### Event Flow

```
scraper.initiated (manual trigger or cron)
  ↓
  ├─→ page.scan.requested [page 1] ──→ article.discovered ──→ article.enhanced ──→ article.persisted
  ├─→ page.scan.requested [page 2] ──→ article.discovered ──→ article.enhanced ──→ article.persisted
  └─→ page.scan.requested [page 3] ──→ article.discovered ──→ article.enhanced ──→ article.persisted
                                           (parallel)           (parallel)        (batched)
  ↓
scraper.completed (summary statistics)
```

### Core Functions

#### 1. Scraper Orchestrator (`scraper-orchestrator.ts`)
- **Triggers**: `scraper.initiated` event OR cron `0 2 * * *` (2 AM daily)
- **Purpose**: Coordinates the entire workflow
- **Steps**:
  1. Validate configuration
  2. Fan-out page scan requests (parallel)
  3. Wait for all pages to complete
  4. Generate summary statistics
  5. Emit `scraper.completed` event

#### 2. Page Scanner (`page-scanner.ts`)
- **Trigger**: `page.scan.requested` event
- **Concurrency**: Max 3 pages simultaneously
- **Retry**: 3 attempts, exponential backoff (1s, 2s, 4s)
- **Purpose**: Fetch and parse listing pages
- **Steps**:
  1. Fetch page HTML with retries
  2. Parse HTML to extract article URLs/metadata
  3. Emit `article.discovered` for each article
  4. Emit `page.scan.completed` with statistics

#### 3. Article Enhancer (`article-enhancer.ts`)
- **Trigger**: `article.discovered` event
- **Concurrency**: Max 10 articles simultaneously
- **Rate Limit**: 10 requests/second to F1000Research
- **Retry**: 2 attempts, linear backoff (2s)
- **Purpose**: Fetch detailed metadata from individual article pages
- **Steps**:
  1. Fetch article page HTML
  2. Extract authors, abstract, keywords, DOI from meta tags
  3. Validate required fields
  4. Emit `article.enhanced` or `article.enhancement.failed`

#### 4. Article Persister (`article-persister.ts`)
- **Trigger**: `article.enhanced` event
- **Concurrency**: 1 (sequential for database integrity)
- **Batching**: Process in groups of 5, 10s timeout
- **Retry**: 1 attempt (transaction rollback on failure)
- **Purpose**: Save articles to database with deduplication
- **Steps**:
  1. Check for duplicates (title/URL/externalId)
  2. If duplicate, emit `article.skipped.duplicate`
  3. If unique, create Manuscript with relationships
  4. Emit `article.persisted`

## Files Created

```
src/inngest/
├── events.ts                           # Event type definitions
├── scraper-utils.ts                    # Shared utilities
├── functions/
│   ├── scraper-orchestrator.ts        # Main workflow coordinator
│   ├── page-scanner.ts                # Page fetching & parsing
│   ├── article-enhancer.ts            # Article metadata extraction
│   └── article-persister.ts           # Database persistence
└── functions.ts                        # Updated function registry

src/app/api/
├── inngest/route.ts                    # Updated Inngest endpoint
└── admin/scrape-inngest/route.ts       # Manual trigger endpoint
```

## Usage

### Manual Trigger via API

**Endpoint**: `POST /api/admin/scrape-inngest`

**Example with default config**:
```bash
curl -X POST http://localhost:3010/api/admin/scrape-inngest
```

**Example with custom config**:
```bash
curl -X POST http://localhost:3010/api/admin/scrape-inngest \
  -H "Content-Type: application/json" \
  -d '{
    "maxPages": 3,
    "delayMs": 1500,
    "baseUrl": "https://f1000research.com/browse/articles?term=COVID",
    "maxRetries": 3,
    "batchSize": 5
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Scraping job initiated successfully",
  "scrapingSessionId": "session-1234567890",
  "eventId": "01HXXX...",
  "config": {
    "baseUrl": "https://f1000research.com/browse/articles?term=Medical_and_health_sciences",
    "maxPages": 3,
    "delayMs": 1500,
    "maxRetries": 3,
    "batchSize": 5
  }
}
```

### Programmatic Trigger

```typescript
import { inngest } from "@/inngest/client";
import { createEventMetadata } from "@/inngest/events";

const scrapingSessionId = `session-${Date.now()}`;

await inngest.send({
  name: "scraper.initiated",
  data: {
    config: {
      baseUrl: "https://f1000research.com/browse/articles?term=COVID",
      maxPages: 5,
      delayMs: 2000,
      maxRetries: 3,
      batchSize: 5,
    },
    metadata: createEventMetadata("api-trigger", scrapingSessionId),
  },
});
```

### Automated Daily Scraping

The orchestrator is configured to run automatically at 2 AM daily via cron:
```typescript
{ cron: "0 2 * * *" }
```

To disable automatic scraping, comment out the cron trigger in `scraper-orchestrator.ts`.

## Event Types

All events are fully typed in `src/inngest/events.ts`:

- `scraper.initiated` - Start a scraping session
- `page.scan.requested` - Request to scan a specific page
- `page.scan.completed` - Page scan finished successfully
- `page.scan.failed` - Page scan failed after retries
- `article.discovered` - Article found on a listing page
- `article.enhanced` - Article metadata extracted successfully
- `article.enhancement.failed` - Article enhancement failed
- `article.persisted` - Article saved to database
- `article.skipped.duplicate` - Article skipped as duplicate
- `scraper.completed` - Entire scraping session finished

## Benefits Over Monolithic Scraper

### Reliability
- **Durable execution**: Survives timeouts and crashes
- **Granular retries**: Individual steps retry instead of entire process
- **Partial progress**: Work is never lost on failure

### Performance
- **Parallel page scanning**: Up to 3 pages simultaneously
- **Concurrent article enhancement**: Up to 10 articles simultaneously
- **Batched database writes**: Process 5 articles per transaction
- **Rate limiting**: Built-in 10 req/sec limit to F1000Research

### Operability
- **Event stream**: Natural audit log of all operations
- **Built-in metrics**: Duration, success rate, error tracking
- **Visual debugging**: Use Inngest dashboard to inspect runs
- **Dynamic configuration**: Change settings without code changes

### Maintainability
- **Separation of concerns**: Each function has a single responsibility
- **Testable units**: Functions can be tested in isolation
- **Reusable**: Easy to add new article sources
- **Type-safe**: Full TypeScript support for events and data

## Monitoring

### Inngest Dashboard

Access the Inngest dashboard at `http://localhost:3010/api/inngest` (when dev server is running) to:
- View all function runs
- Inspect event payloads
- Debug failed steps
- Monitor performance metrics
- Replay failed runs

### Event Tracing

All events include metadata for tracing:
```typescript
{
  correlationId: string,      // Trace entire session
  timestamp: ISO8601,
  source: string,              // Function that emitted event
  scrapingSessionId: string,
  pageNumber?: number,
  articleUrl?: string
}
```

## Configuration

### Default Configuration
```typescript
{
  baseUrl: "https://f1000research.com/browse/articles?term=Medical_and_health_sciences",
  maxPages: 10,
  delayMs: 2000,
  maxRetries: 3,
  batchSize: 5
}
```

### Concurrency Limits
- **Page Scanner**: 3 concurrent pages
- **Article Enhancer**: 10 concurrent articles
- **Article Persister**: 1 (sequential batches of 5)

### Rate Limits
- **F1000Research**: 10 requests/second (configured in Article Enhancer)

## Troubleshooting

### Functions Not Registering

If you see 400 errors when Inngest tries to register functions:
1. Check that all function imports are correct
2. Verify event type definitions match
3. Restart the dev server
4. Check Inngest dashboard for specific error messages

### Articles Not Being Saved

1. Check that Prisma is properly configured
2. Verify database connection
3. Check for duplicate detection issues
4. Review error events: `article.enhancement.failed`, `page.scan.failed`

### Rate Limiting

If you're hitting rate limits:
1. Increase `delayMs` in configuration
2. Reduce `maxPages` for testing
3. Lower concurrency limits in function configs

## Migration from Monolithic Scraper

### Comparison

| Feature | Monolithic (`run-bulk-scraper.ts`) | Inngest |
|---------|-----------------------------------|---------|
| Execution | Sequential | Parallel + Event-driven |
| Timeout handling | Fails entire run | Step-level durability |
| Retry logic | Manual with delays | Built-in with backoff |
| Observability | Console logs | Event stream + Dashboard |
| Configuration | Command-line args | Event data + Cron |
| Scalability | Single process | Distributed workers |

### Gradual Migration (Recommended)

1. **Phase 1**: Test Inngest scraper alongside existing scraper
2. **Phase 2**: Compare outputs and tune concurrency
3. **Phase 3**: Switch to Inngest for production
4. **Phase 4**: Deprecate monolithic scraper

### Running Both Scrapers

Monolithic:
```bash
npm run scrape:bulk
npm run scrape:quick  # 3 pages
npm run scrape:deep   # 20 pages
```

Inngest:
```bash
curl -X POST http://localhost:3010/api/admin/scrape-inngest
```

## Next Steps

1. **Test the implementation**: Trigger a small scraping job (1-3 pages)
2. **Monitor in Inngest dashboard**: Observe function execution and events
3. **Adjust concurrency**: Tune limits based on performance
4. **Add monitoring**: Set up alerts for failures
5. **Deploy**: Configure production Inngest environment

## Additional Resources

- [Inngest Documentation](https://www.inngest.com/docs)
- [Original Architecture Document](./inngest-architecture.md)
- [Monolithic Scraper](./run-bulk-scraper.ts)
- [Schema Definitions](./schema.ts)
