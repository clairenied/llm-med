# Human Grading Feature Specification

## Overview

Build a feature for human graders to evaluate existing peer reviews from the training set (~200 reviews). This enables quality assessment of reviews to train an AI reviewer for urology literature peer review.

## User Interface Requirements

### Grading Interface

Present each human grader with:

1. **The Original Review** - Full text of the peer review being evaluated
2. **AI-Generated Summary** - Structured summary of the manuscript (generated using the prompt below)
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

For each domain, the grader selects one of:

| Grade | Value |
|-------|-------|
| Very Good | 4 |
| Good | 3 |
| Poor | 2 |
| Very Poor | 1 |
| N/A | null |

## Data Model Requirements

### Human Grader Tracking

- Track which user submitted each grade
- Record timestamp of grading
- Support multiple graders per review (for inter-rater reliability)

### Grade Storage

Store for each grading session:
- Review ID
- Grader (User) ID
- Grades for all 5 domains
- Optional notes/comments
- Timestamp

## AI Summary Generation

### Prompt for Manuscript Summary

The AI-generated summary uses the following structured prompt to summarize the manuscript (not the review). This gives graders context about what the review should address.

---

**System Instructions:**

You are an expert scientific summarizer assisting peer review.

**Grounding Requirement (MANDATORY):**
- Use ONLY information explicitly stated in the provided paper
- Do NOT rely on external knowledge, prior training, common practice, assumptions, or typical methods
- Do NOT infer, guess, generalize, or fill in missing details
- Do NOT add background context not written in the paper
- If information is not explicitly reported, state: "Not reported in the paper."

**Constraints:**
- Do not critique, evaluate, or suggest improvements
- Do not introduce information not explicitly stated
- Use neutral academic language
- Do not speculate or infer beyond the text
- Do not merge sections or reorder headings

**Style Guidelines:**
- Concise but complete
- Third-person, factual tone

---

### Summary Sections (with word budgets)

#### Paper Summary (50-80 words)
- Main research problem
- Study objective
- General approach used

#### Clinical Relevance (100-130 words)
- Stated research objectives / clinical goals
- Practical applicability to clinical settings / proposed use cases
- Claimed contributions relative to existing work
- Comparison to existing clinical practices

#### Methodology (200-250 words)
- Study design and stated objectives (type, research questions)
- Data sources and sample characteristics (origin, size, inclusion/exclusion)
- Model or intervention description (algorithms, key components)
- Experimental or simulation setup (training/validation/testing, baselines)
- Evaluation metrics

#### Results (200-250 words)
- Descriptive statistics or summary outcomes
- Alignment between reported results and stated hypotheses

#### Writing Clarity (50-70 words)
- Clarity of stated research questions and aims
- Presence or absence of ambiguity or redundancy

#### Ethical Considerations (50-70 words)
- Data privacy and confidentiality
- Informed consent (if applicable)
- Transparency and explainability
- Potential harms or misuse
- Compliance with ethical guidelines
- If not addressed, state: "Not discussed in the paper."

---

## Workflow

1. Grader logs in (existing auth system)
2. System presents next ungraded review (or allows selection)
3. Grader sees review text + AI summary of the manuscript
4. Grader assigns grades to all 5 domains
5. Grader submits; system records grades with user ID and timestamp
6. Repeat until all reviews graded

## Progress Tracking

- Dashboard showing: total reviews, graded reviews, remaining reviews
- Per-grader statistics
- Inter-rater agreement metrics (if multiple graders per review)
