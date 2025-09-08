# Production Fake Data Cleanup Guide

## Overview
This guide explains how to clean up fake/sample data from your production database while preserving real scraped articles.

## Local Cleanup (Already Done)
```bash
npm run cleanup:fake-data
```

## Production Cleanup

### Option 1: Safe Production Cleanup (Recommended)
```bash
# Set the confirmation environment variable
export CONFIRM_PRODUCTION_CLEANUP=true

# Run the cleanup script
npm run cleanup:production
```

### Option 2: Manual Database Cleanup
If you prefer to clean up manually via database queries:

```sql
-- Delete manuscripts without external sources (fake data)
DELETE FROM "Manuscript" 
WHERE id NOT IN (
  SELECT DISTINCT "manuscriptId" 
  FROM "ManuscriptSource"
);

-- Clean up orphaned authors
DELETE FROM "Author" 
WHERE id NOT IN (
  SELECT DISTINCT "authorId" 
  FROM "_AuthorToManuscript"
);

-- Clean up orphaned reviewers
DELETE FROM "Reviewer" 
WHERE id NOT IN (
  SELECT DISTINCT "reviewerId" 
  FROM "Review"
);
```

## What Gets Deleted
The cleanup script identifies and removes:

1. **Fake Manuscripts**: Articles without external source links
2. **Sample Data**: Articles with titles containing:
   - "Telemedicine on Rural Healthcare"
   - "Machine Learning Applications in Medical"
   - "Novel Approaches to Cardiovascular"
   - "Sample", "Test", "Demo"
3. **Orphaned Data**: Authors and reviewers no longer linked to any manuscripts

## What Gets Preserved
- ✅ All real scraped articles from F1000Research
- ✅ All external source metadata
- ✅ All manuscript-source relationships
- ✅ Authors linked to real articles
- ✅ Reviews and reviewers linked to real manuscripts

## Verification
After cleanup, verify the results:

```bash
# Check manuscript count
curl https://your-domain.com/api/manuscripts | jq 'length'

# Check that all remaining manuscripts have external sources
curl https://your-domain.com/api/manuscripts | jq '.[] | {title: .title, sources: .sources}'
```

## Safety Features
- **Production Safety**: Requires `CONFIRM_PRODUCTION_CLEANUP=true` environment variable
- **Database Validation**: Only runs on PostgreSQL databases
- **Dry Run Logging**: Shows what will be deleted before proceeding
- **Cascade Protection**: Uses proper foreign key relationships to prevent orphaned data

## Deployment Steps
1. Deploy your application to production
2. Set the confirmation environment variable
3. Run the cleanup script
4. Verify the results
5. Remove the confirmation environment variable

## Rollback
If you need to restore sample data for testing:
```bash
npm run db:seed
```

**Note**: This will add sample data back, but won't affect your real scraped articles.
