# Production Database Sync Instructions

**Date:** 2026-01-30
**From:** Craig's development environment
**To:** Claire's production deployment

## Overview

This document provides instructions for syncing the development database to production. The database dump file `2026-01-30-full-db.sql.gz` contains the complete state of the dev database, but **not all data should go to production**.

## What TO Sync (Keep in Production)

1. **Email Templates** (`EmailTemplate` table)
   - The invitation email template with customized urology AI reviewer messaging
   - The communication/reminder template

2. **Manuscripts and Related Data**
   - All `Manuscript` records
   - All `ManuscriptVersion` records
   - All `Source` records
   - AI summaries (`aiSummary` field on Manuscript)

3. **Reviews and Reviewers**
   - All `Review` records
   - All `Reviewer` records

4. **Authors**
   - All `Author` records
   - All `ManuscriptAuthor` junction records

5. **Schema Changes**
   - `firstName` and `lastName` fields on `User` model
   - `EmailTemplate` model (if not already present)

## What NOT TO Sync (Exclude from Production)

1. **ReviewGrade records** - These are test grades from development. Production should start fresh with no grades.

2. **Test Users** - Do not overwrite production users. The dev database may have test users like `craign@uic.edu` that were used for testing.

3. **Session/Account data** - These are authentication tokens that are environment-specific.

## Recommended Sync Procedure

### Option A: Selective Data Import (Recommended)

1. **Export only the data you need from the dump:**
   ```bash
   # Decompress the dump
   gunzip -k 2026-01-30-full-db.sql.gz

   # Extract specific tables (example using grep/sed)
   # Or use a tool like pgloader for selective import
   ```

2. **Or use these SQL commands on production to import just what's needed:**

   ```sql
   -- First, ensure the EmailTemplate table has the invitation template
   -- Check if it exists:
   SELECT * FROM "EmailTemplate" WHERE type = 'INVITATION';

   -- If not, insert it (get the content from dev):
   INSERT INTO "EmailTemplate" (id, name, subject, body, type, "isDefault", "createdAt", "updatedAt")
   SELECT id, name, subject, body, type, "isDefault", "createdAt", "updatedAt"
   FROM dev_database."EmailTemplate"
   WHERE type = 'INVITATION';
   ```

### Option B: Full Restore Then Clean

1. Restore the full dump to production
2. Then clean up unwanted data:
   ```sql
   -- Remove all test grades
   DELETE FROM "ReviewGrade";

   -- Remove test users (keep only production users)
   -- Be careful here - identify which users are real
   DELETE FROM "User" WHERE email IN ('test@example.com', 'craign@uic.edu');
   ```

## Email Template Content

The invitation template includes:
- Subject: "Invitation to Grade Peer Reviews - Urology AI Reviewer Project"
- Body: Customized HTML explaining the project, grading domains, and magic link sign-in
- Placeholders: `{{firstName}}`, `{{signInUrl}}`

## Important Notes

1. **Run Prisma migrations first** if there are schema changes:
   ```bash
   npx prisma migrate deploy
   # or
   npx prisma db push
   ```

2. **Backup production before any sync:**
   ```bash
   pg_dump -U postgres -d production_db | gzip > backup-before-sync.sql.gz
   ```

3. **The grading system is now functional.** After sync:
   - Graders will be redirected to `/grading` after sign-in
   - Each review needs 2 graders
   - Progress is tracked at `/grading/progress`

## Files Changed in This Update

- `src/lib/auth.ts` - Fixed session role handling for magic link auth
- `src/app/auth/signin/page.tsx` - Graders redirect to /grading
- `src/app/api/admin/bulk-invite/route.ts` - callbackUrl in invite links
- `src/app/api/admin/invite-grader/route.ts` - callbackUrl in invite links
- `src/app/api/admin/resend-invite/route.ts` - callbackUrl in invite links

## Contact

If you have questions about this sync, coordinate with Craig.
