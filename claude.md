Read and follow the instructions in /Users/craign/code/locker/CLAUDE.md before proceeding.

# Manuscript Review Tracker - Project Context

## IMPORTANT: Database Queries Default to Production

**When the user asks to query the database (counts, lookups, data questions), ALWAYS use the production Vercel/Neon database — NOT the local Docker container.** The local database is only for development and does not have real data. See "Production Database Access" section below for connection instructions.

## Project Overview
Academic manuscript review tracking system built with Next.js 15, providing transparent peer review process management, version control, and comprehensive admin tools for manuscript publication workflows.

## Tech Stack & Dependencies

### Core Framework
- **Node.js 20** - Required runtime (pinned in `.nvmrc`). Node 22+ breaks the dev server with `localStorage.getItem is not a function` errors. Always run `nvm use` before `npm run dev`.
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety

### Database & ORM
- **PostgreSQL** - Primary database (Docker containerized)
- **Prisma 6.14.0** - ORM and database migrations
- **@auth/prisma-adapter** - NextAuth database adapter

### Authentication
- **NextAuth.js v5 (beta)** - Session management
- **bcryptjs** - Password hashing
- **JWT strategy** - Session tokens

### Background Jobs
- **Inngest 3.44.2** - Event-driven background job processing
  - F1000Research article scraping
  - Async data import tasks
  - Dev dashboard: http://localhost:8288

### UI & Styling
- **Tailwind CSS v4** - Utility-first CSS
- **PostCSS** - CSS processing

### Other Key Libraries
- **Resend** - Email service for password resets
- **Cheerio** - HTML parsing for web scraping
- **Zod** - Schema validation

## Database Schema

See [schema.prisma](prisma/schema.prisma)

## Database Access & Querying

### Running SQL Queries

**IMPORTANT:** The PostgreSQL database runs in Docker:
- Container: `llm-med-postgres-1`
- Database: `postgres`
- Port: `5433` (mapped from container's 5432)

#### Method 1: Docker PostgreSQL Container (RECOMMENDED)
```bash
# Run SQL queries via docker exec with heredoc
docker exec -i llm-med-postgres-1 psql -U postgres -d postgres <<'EOF'
SELECT * FROM "Manuscript" LIMIT 10;
SELECT COUNT(*) FROM "User";
EOF
```

For interactive psql session:
```bash
docker exec -it llm-med-postgres-1 psql -U postgres -d postgres

# Now you can run SQL queries directly:
SELECT * FROM "Manuscript" LIMIT 10;
\dt  # List all tables
\d "Manuscript"  # Describe table structure
\q   # Exit
```

#### Method 2: Prisma Studio (GUI)
```bash
npm run db:studio
# Opens browser at http://localhost:5555
# Visual interface for browsing and editing data
```

## Environment Configuration

### Required Variables
```env
DATABASE_URL="postgresql://user:password@localhost:5432/manuscript_tracker"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3010"
```

### Optional Services
```env
# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
FROM_EMAIL="noreply@yourdomain.com"

# Inngest
INNGEST_APP_ID="manuscript-review-tracker"
INNGEST_EVENT_KEY="your-event-key"
INNGEST_SIGNING_KEY="your-signing-key"
```

## Development Workflow

### Quick Start
```bash
./test_start.sh   # Switches to Node 20, starts Postgres, runs dev server
```

### Database Commands
- `npm run db:push` - Push schema changes
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed sample data
- `npm run db:studio` - Prisma Studio GUI
- `npm run db:reset` - Full database reset

### Docker Operations
- `npm run docker:up` - Start PostgreSQL container
- `npm run docker:down` - Stop containers
- `npm run docker:logs` - View database logs

### Inngest Background Jobs

**Triggering Events:**
```bash
# Trigger batch transform of all F1000 documents
curl -X POST "http://localhost:8288/e/llm-med" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "f1000.batch.transform.requested",
    "data": {
      "metadata": {
        "sessionId": "test-'$(date +%s)'",
        "correlationId": "test-'$(date +%s)'",
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'",
        "source": "manual-test"
      }
    }
  }'
```

**Debugging:**
- Open http://localhost:8288 to view runs
- Check Next.js logs for errors: Look at dev server output
- Check Inngest container logs: `docker logs llm-med-inngest-1`
- Common issues:
  - `output_too_large`: Step returning too much data (>512KB). Solution: Fetch data inside steps, don't pass large objects between steps.
  - Function cancelled: Check browser console or Next.js logs for actual error

### Data Management Scripts
- `cleanup-fake-data.ts` - Remove test data
- `cleanup-duplicates.ts` - Deduplicate records
- `fix-missing-authors.ts` - Repair author associations
- `migrate-to-sources.ts` - Source model migration

### Deployment Scripts
- `deploy-test.sh` - Test environment deployment
- `deploy-production.sh` - Production deployment

### Vercel CLI Access

This project is linked to Claire's Vercel project (`claire-niederbergers-projects/llm-med`).

**Important:** Always use `--token` flag to use Claire's token (stored in `.env.local`):
```bash
# List environment variables
vercel env ls --token="$VERCEL_TOKEN"

# Pull environment variables
vercel env pull --token="$VERCEL_TOKEN"

# Check deployments
vercel ls --token="$VERCEL_TOKEN"

# View project info
vercel inspect <deployment-url> --token="$VERCEL_TOKEN"
```

Without `--token`, the CLI uses your personal Vercel credentials instead of Claire's project access.

### Production Database Access

**Pull production credentials:**
```bash
VERCEL_TOKEN=$(grep VERCEL_TOKEN .env.local | cut -d'"' -f2) && \
vercel env pull .env.production --environment=production --token="$VERCEL_TOKEN"
```

**Query production database:**
```bash
DATABASE_URL=$(grep "^DATABASE_URL=" .env.production | cut -d'=' -f2- | tr -d '"') && \
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: '$DATABASE_URL' });
client.connect()
  .then(() => client.query('SELECT id, email, name, role FROM \"User\" LIMIT 10'))
  .then(res => { console.table(res.rows); client.end(); })
  .catch(err => { console.error(err.message); client.end(); });
"
```

**Add a user to production:**
```bash
DATABASE_URL=$(grep "^DATABASE_URL=" .env.production | cut -d'=' -f2- | tr -d '"') && \
node -e "
const { Client } = require('pg');
const client = new Client({ connectionString: '$DATABASE_URL' });
const id = require('crypto').randomUUID();
client.connect()
  .then(() => client.query(
    'INSERT INTO \"User\" (id, email, name, role, \"createdAt\", \"updatedAt\") VALUES (\$1, \$2, \$3, \$4, NOW(), NOW()) RETURNING *',
    [id, 'user@example.com', 'User Name', 'GRADER']
  ))
  .then(res => { console.log('Created:', res.rows[0]); client.end(); })
  .catch(err => { console.error(err.message); client.end(); });
"
```

### Airtable API Access

The project has access to the "LLM Reviewer Project" Airtable (credentials in `.env`).

```bash
# Fetch records from Airtable
source .env && curl -s "https://api.airtable.com/v0/$AIRTABLE_BASE_ID/$AIRTABLE_TABLE_ID?maxRecords=10" \
  -H "Authorization: Bearer $AIRTABLE_API_KEY" | python3 -m json.tool
```

### Gmail SMTP

For personal emails (vs Resend for system emails), Gmail SMTP credentials are in `.env`.

## LLM-Generated Reviews

The `llm-prompts/` directory contains prompts for generating AI peer reviews of urology research papers.

- **`llm-prompts/promptForReviews.docx`** - Original rubric-based prompt (1-5 scored categories) — superseded
- **`llm-prompts/PromptForReviews2.docx`** - Current prompt for traditional peer review format (verbatim in `src/lib/deepseek.ts`)
  - Output: Markdown with sections: Paper Summary, Strengths, Weaknesses, Paper decision, Suggestions
  - Decision values: Accept / Minor Revision / Major Revision / Reject

### DeepSeek Integration
- **`src/lib/deepseek.ts`** - `generateManuscriptReview()` sends manuscript content to DeepSeek API using PromptForReviews2 prompt (verbatim)
- **Schema fields**: `Manuscript.aiReview` (Json?) and `Manuscript.aiReviewGeneratedAt` (DateTime?)
- **Batch script**: `dev-tools/batch-ai-reviews.ts` — generates AI reviews for all manuscripts, creates `Review` records with `AI_GENERATED` type
- **Single test script**: `dev-tools/test-ai-review-single.ts` — generates one AI review for a given manuscript ID

### AI Review Grading System (Stage 2)

The system supports two grading modes controlled by an admin toggle:

- **HUMAN mode** (Stage 1): Graders evaluate original human peer reviews. Expandable card UI with papers → versions → reviews.
- **AI mode** (Stage 2): Graders evaluate AI-generated reviews. Simplified flat list UI (one review per paper, no expand/collapse).

**Key components:**
- **`SystemSetting` model** — Key-value store for admin settings. `GRADING_MODE` = `HUMAN` or `AI`.
- **`src/lib/settings.ts`** — `getGradingMode()` / `setGradingMode()` helpers
- **`src/app/api/admin/settings/route.ts`** — GET/PUT for system settings (admin only)
- **Admin toggle** — On admin dashboard (`src/app/admin/page.tsx`), "Grading Mode" section
- **Queue filtering** — `src/app/api/grading/queue/route.ts` and `src/app/api/grading/progress/route.ts` filter reviews by `reviewType` based on current mode
- **AI reviews** — Stored as `Review` records with `reviewType: AI_GENERATED`, linked to a "DeepSeek AI" `Reviewer` record (ID: `d78dac432c684fca87846d4c5`). Reuses the entire grading infrastructure (ReviewGrade, 2-grader requirement, progress tracking).
- **Grading UI** — `src/app/grading/page.tsx` renders `AiReviewCard` (flat) in AI mode vs `ManuscriptCard` (expandable) in HUMAN mode. Detail page (`src/app/grading/[reviewId]/page.tsx`) renders AI review content as markdown.
- **Stage 2 banner** — Desktop-only (`hidden md:block`) explainer banner on grading queue page in AI mode

## Project Structure

```
llm-med/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── api/                # API route handlers
│   │   ├── auth/               # Authentication pages
│   │   ├── manuscripts/        # Manuscript management UI
│   │   └── profile/            # User profile pages
│   ├── components/             # React components
│   │   ├── AuthorForm.tsx
│   │   ├── ManuscriptForm.tsx
│   │   ├── ReviewForm.tsx
│   │   └── ...
│   ├── inngest/               # Background job system
│   │   ├── client.ts          # Inngest client setup
│   │   ├── functions/         # Job implementations
│   │   └── services/          # Service integrations
│   ├── lib/                   # Shared utilities
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── deepseek.ts       # DeepSeek AI review/summary generation
│   │   ├── email.ts          # Email service
│   │   ├── prisma.ts         # Database client
│   │   └── settings.ts       # System settings (grading mode)
│   └── types/                # TypeScript definitions
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── migrations/           # Migration history
│   └── seed.ts              # Seed data script
├── database-ops/            # Database utilities
├── dev-tools/              # Development helpers
├── llm-prompts/            # AI review generation prompts
└── docs/                   # Documentation

```
