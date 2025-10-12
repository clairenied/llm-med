# F1000Research Scraper: Inngest Architecture

## Overview

This document describes how to express the F1000Research scraper using Inngest's event-driven semantics. The monolithic scraper will be decomposed into discrete functions that communicate through events, providing improved reliability and scalability.

## Current vs Inngest Architecture

### Current: Monolithic Sequential Process
```
Single process → Fetch pages → Parse HTML → Enhance articles → Batch save → Report
```

**Problems**: Timeout vulnerability, all-or-nothing retries, limited observability

### Inngest: Event-Driven Functions
```
Orchestrator → [Page Scanners] → [Article Enhancers] → [Persisters]
                 (parallel)         (parallel)           (batched)
```

**Benefits**: Step-level durability, granular retries, natural parallelization

## Core Functions

### 1. Scraper Orchestrator
**Trigger**: `scraper.initiated` event or cron `0 2 * * *`

**Purpose**: Coordinate the entire workflow

**Steps**:
1. Validate configuration
2. Fan-out page scan requests
3. Wait for all pages to complete
4. Generate summary statistics

**Events Emitted**:
- `page.scan.requested` (×N pages)
- `scraper.completed`

### 2. Page Scanner
**Trigger**: `page.scan.requested`

**Purpose**: Fetch and parse a single page

**Steps**:
1. Fetch page HTML with retries
2. Parse HTML and extract articles (no separate event - parsing is CPU-bound)
3. Emit discovery event for each article

**Events Emitted**:
- `article.discovered` (×M articles per page)
- `page.scan.completed`

**Concurrency**: Max 3 simultaneous pages

### 3. Article Enhancer
**Trigger**: `article.discovered`

**Purpose**: Fetch detailed metadata from individual article pages

**Steps**:
1. Fetch article page
2. Extract authors, abstract, keywords, DOI
3. Validate required fields
4. Emit enhanced article

**Events Emitted**:
- `article.enhanced`
- `article.enhancement.failed`

**Rate Limit**: 10 requests/second to F1000Research

### 4. Article Persister
**Trigger**: `article.enhanced`

**Purpose**: Save to database with deduplication

**Steps**:
1. Check duplicates (multiple strategies)
2. Create manuscript and relationships
3. Handle transaction

**Events Emitted**:
- `article.persisted`
- `article.skipped.duplicate`

**Batching**: Process in groups of 5

## Event Flow

```yaml
scraper.initiated
  ├→ page.scan.requested [page: 1]
  │    ├→ article.discovered [url: /articles/123]
  │    │    ├→ article.enhanced [title: "COVID-19 Study..."]
  │    │    │    └→ article.persisted [manuscriptId: abc-123]
  │    │    └→ article.enhanced [title: "Cancer Research..."]
  │    │         └→ article.skipped.duplicate [reason: "title_match"]
  │    └→ page.scan.completed [articlesFound: 25]
  ├→ page.scan.requested [page: 2]
  └→ page.scan.requested [page: 3]
       ...
```

## Key Semantic Mappings

| Current Code | Inngest Expression | Why |
|--------------|-------------------|-----|
| `for (page of pages)` | Fan-out events | Enables parallelization |
| `try/catch` with retries | Step-level retries | Granular failure recovery |
| `await delay(ms)` | `step.sleep()` | Platform-managed delays |
| Batch array processing | Event streams | Natural backpressure |
| Method calls | Event emissions | Loose coupling |
| Class state | Function state | Durable across retries |

## Error Handling

### Retry Strategies
- **Page Scanner**: 3 attempts, exponential backoff (1s, 2s, 4s)
- **Article Enhancer**: 2 attempts, linear backoff (2s)
- **Persister**: 1 attempt (transaction rollback on failure)

### Failure Modes
- **Page fails**: Continue with other pages, report in summary
- **Enhancement fails**: Save with basic metadata only
- **Persistence fails**: Dead letter queue for investigation

## Concurrency Controls

```yaml
Page Scanning:
  concurrency: 3    # Max 3 pages simultaneously

Article Enhancement:
  concurrency: 10   # Max 10 articles simultaneously
  rateLimit:        # Respect F1000Research limits
    key: "f1000research"
    limit: 10
    period: "1s"

Persistence:
  concurrency: 1    # Sequential batches
  batch:
    size: 5
    timeout: "10s"
```

## State Management

Each function maintains durable state that survives failures:

```typescript
// Orchestrator State
{
  totalPages: number,
  completedPages: number[],
  startTime: timestamp,
  stats: { scraped: 0, duplicates: 0, errors: 0 }
}

// Page Scanner State
{
  pageNumber: number,
  retryCount: number,
  articlesFound: string[]  // URLs for idempotency
}

// Article State (flows through enhancement → persistence)
{
  url: string,
  title: string,
  metadata: { /* accumulated through pipeline */ }
}
```

## Observability

### Event Metadata Standard
```typescript
{
  correlationId: string,      // Trace entire scraping session
  timestamp: ISO8601,
  source: string,              // Function name
  scrapingSessionId: string,
  pageNumber?: number,
  articleUrl?: string
}
```

### Key Metrics
- Articles per minute
- Duplicate detection rate
- Enhancement success rate
- Page scan duration (P50, P95)
- Error rate by function

## Migration Path

1. **Phase 1**: Implement Inngest functions alongside existing scraper
2. **Phase 2**: Route test traffic through Inngest
3. **Phase 3**: Compare outputs, tune concurrency
4. **Phase 4**: Full cutover, deprecate monolithic scraper

## Benefits Summary

**Reliability**
- Survives timeouts through durable execution
- Granular retries instead of full restarts
- Partial progress preserved on failures

**Performance**
- Parallel page scanning
- Concurrent article enhancement
- Batched database writes

**Operability**
- Event stream provides natural audit log
- Built-in metrics and tracing
- Dynamic configuration without code changes

**Maintainability**
- Clear separation of concerns
- Testable units
- Reusable for multiple sources