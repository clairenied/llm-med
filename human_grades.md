# Human Grading Feature Specification

## Overview

Build a feature for human graders to evaluate existing peer reviews from the training set (~232 reviews). This enables quality assessment of reviews to train an AI reviewer for urology literature peer review.

**Target:** Each review graded by at least 2 human graders (~400 total grading tasks, ~20 graders)

---

## User notes

### To run the server and have a log file for Claude Code use:

    npm run dev 2>&1 | tee dev.log

---

## Implementation Status

### Completed

- [x] **GRADER role** - Added to UserRole enum in Prisma schema
- [x] **ReviewGrade model** - Database model for storing grades with 5 domains
- [x] **GradeValue enum** - VERY_GOOD, GOOD, POOR, VERY_POOR, NA
- [x] **Magic link authentication** - Passwordless sign-in via email for graders
- [x] **Sign-in UI** - Email Link / Password toggle on sign-in page
- [x] **Database migration** - Schema changes applied
- [x] **Admin user setup** - Craig added as admin (local + production)

### Remaining

- [ ] **Article summary field** - Add `aiSummary` field to store generated summaries
- [ ] **Summary generation** - Generate summary via DeepSeek LLM using prompt
- [ ] **Summary persistence** - Generate once, show same summary to all graders
- [ ] **Grading form UI** - Form to submit grades for 5 domains
- [ ] **Grading queue** - Show graders which reviews need grading
- [ ] **2-grader enforcement** - Ensure each review gets exactly 2 grades
- [ ] **Progress report** - Dashboard showing grading completion status
- [ ] **Admin invitation flow** - UI for admins to invite graders by email

---

## Data Model

### ReviewGrade (implemented)

```prisma
model ReviewGrade {
  id                    String      @id @default(cuid())
  review                Review      @relation(fields: [reviewId], references: [id])
  reviewId              String
  grader                User        @relation(fields: [graderId], references: [id])
  graderId              String
  clinicalRelevance     GradeValue?
  methodology           GradeValue?
  results               GradeValue?
  writingClarity        GradeValue?
  ethicalConsiderations GradeValue?
  notes                 String?
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt

  @@unique([reviewId, graderId]) // One grade per grader per review
}

enum GradeValue {
  VERY_GOOD   // 4
  GOOD        // 3
  POOR        // 2
  VERY_POOR   // 1
  NA          // Not applicable
}
```

### Summary Storage (to be added)

Need to add `aiSummary` field to store the LLM-generated manuscript summary. Options:
1. Add to `Manuscript` model (summary of the paper)
2. Add to `ManuscriptVersion` model (version-specific)

The summary should be generated once when the first grader accesses the review, then persisted for all subsequent graders.

---

## User Interface Requirements

### Grading Interface

Present each human grader with:

1. **The Original Review** - Full text of the peer review being evaluated
2. **AI-Generated Summary** - Structured summary of the manuscript (generated via DeepSeek)
3. **Grading Form** - 5 domains to grade

### Grading Domains

| Domain | Description |
|--------|-------------|
| Clinical Relevance | How well does the review address the clinical significance and applicability of the research? |
| Methodology | How thoroughly does the review evaluate the study design, data sources, and methods? |
| Results | How well does the review assess the reported findings and their alignment with stated objectives? |
| Writing Clarity | How well does the review address the clarity of the manuscript's writing? |
| Ethical Considerations | How well does the review address ethical aspects (consent, privacy, compliance)? |

### Grade Scale

| Grade | Value |
|-------|-------|
| Very Good | 4 |
| Good | 3 |
| Poor | 2 |
| Very Poor | 1 |
| N/A | null |

---

## AI Summary Generation

### LLM Provider

**DeepSeek** - Used for generating manuscript summaries

### Summary Workflow

1. Grader opens a review to grade
2. System checks if manuscript has `aiSummary`
3. If no summary exists:
   - Fetch manuscript content
   - Send to DeepSeek with summary prompt
   - Store result in `aiSummary` field
4. Display summary to grader (same summary for all graders)

### Summary Prompt

See `PromptForSummary.pdf` for the full prompt. Key sections:

- Paper Summary (50-80 words)
- Clinical Relevance (100-130 words)
- Methodology (200-250 words)
- Results (200-250 words)
- Writing Clarity (50-70 words)
- Ethical Considerations (50-70 words)

---

## Workflow

1. Admin invites grader by email
2. Grader receives magic link, clicks to sign in
3. Grader sees dashboard with reviews needing grades
4. Grader selects a review (or system assigns next one)
5. Grader sees: review text + AI summary of manuscript
6. Grader assigns grades to all 5 domains + optional notes
7. Grader submits; system records grade with user ID and timestamp
8. System shows next review (until grader's quota is done)

---

## Progress Report Requirements

Dashboard showing:

| Metric | Description |
|--------|-------------|
| Total reviews | 232 |
| Reviews with 0 grades | Need 2 graders |
| Reviews with 1 grade | Need 1 more grader |
| Reviews with 2+ grades | Complete |
| Grades per grader | Individual progress |
| Remaining work | Reviews still needing grades |

---

## Technical Notes

### Database

- PostgreSQL via Docker (local)
- Prisma ORM
- Production: Vercel + managed PostgreSQL

### Authentication

- NextAuth.js v5
- Magic link via Resend (passwordless)
- Password auth also available

### Branch

`feature/human-grading`

### Related Files

- `prisma/schema.prisma` - Database schema
- `src/lib/auth.ts` - Authentication config
- `src/lib/email.ts` - Magic link email
- `src/app/auth/signin/page.tsx` - Sign-in UI
- `PromptForSummary.pdf` - LLM prompt for summaries
