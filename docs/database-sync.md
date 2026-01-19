# Database Sync Between Developers

Each developer runs PostgreSQL locally in Docker. The database schema is shared via git (Prisma), but the **data** needs to be synced separately using dump files.

## Quick Reference

| What | Shared via Git? | Notes |
|------|----------------|-------|
| Code | ✅ Yes | Normal git workflow |
| Schema (`prisma/schema.prisma`) | ✅ Yes | Run `npm run db:push` after pulling |
| Database dumps (`database-dumps/`) | ✅ Yes | ~4 MB compressed |
| Raw DB files (`postgres_data/`) | ❌ No | Machine-specific, in .gitignore |

---

## Exporting (After Making Data Changes)

When you've made significant data changes (ETL, reprocessing, etc.):

```bash
./scripts/db-export.sh
```

This creates a dated dump file like `database-dumps/2026-01-19-reviews-289.sql.gz`.

Then commit and push:
```bash
git add database-dumps/
git commit -m "Update database dump"
git push
```

---

## Importing (Getting Someone Else's Data)

After pulling changes that include a new dump:

```bash
git pull
./scripts/db-import.sh
```

This will:
1. Find the latest dump file
2. Ask for confirmation (it replaces all data)
3. Import and verify the data

To import a specific dump:
```bash
./scripts/db-import.sh database-dumps/2026-01-19-reviews-289.sql.gz
```

---

## First-Time Setup (Claire)

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd llm-med
   npm install
   ```

2. **Start Docker containers:**
   ```bash
   npm run docker:up
   ```

3. **Import the database:**
   ```bash
   ./scripts/db-import.sh
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

---

## Current Database Stats

As of 2026-01-19:
- 180 manuscripts with AI summaries
- 289 reviews with version tracking
- ~200 reviewers

---

## Troubleshooting

### Container not running
```bash
npm run docker:up
# Wait a few seconds, then retry
```

### "relation does not exist" after import
The schema might not match. Run:
```bash
npm run db:push
```

### Want to start fresh
```bash
npm run db:reset
./scripts/db-import.sh
```
