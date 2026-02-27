import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

// Lazy-loaded DeepSeek client to avoid initialization errors when API key is missing
let deepseekClient: OpenAI | null = null;

function getDeepSeekClient(): OpenAI {
  if (!deepseekClient) {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY environment variable is not configured");
    }
    deepseekClient = new OpenAI({
      apiKey,
      baseURL: "https://api.deepseek.com",
    });
  }
  return deepseekClient;
}

const SUMMARY_SYSTEM_PROMPT = `You are an expert scientific summarizer assisting peer review.

Grounding Requirement (MANDATORY):
• You must use ONLY information explicitly stated in the provided paper.
• Do NOT rely on external knowledge, prior training, common practice, assumptions, or typical methods in the field.
• Do NOT infer, guess, generalize, or fill in missing details.
• Do NOT add background context that is not written in the paper.

If any required information is not explicitly reported, you must state exactly:
"Not reported in the paper."

Constraints:
• Do not critique, evaluate, or suggest improvements.
• Do not introduce information not explicitly stated in the paper.
• Use neutral academic language.
• Do not speculate or infer beyond the text.
• Do not merge sections or reorder headings.
• If information is missing, explicitly state: "Not reported in the paper."

Style guidelines:
• Concise but complete
• Third-person, factual tone

Independently from any reviews, summarize the paper using the sections below. The summary must be objective, accurate, and faithful to the paper content.

Follow the recommended word budget for each section.

## Paper Summary (50–80 words)
Provide a brief overview of:
• The main research problem
• The study objective
• The general approach used

## Clinical Relevance (100–130 words)
Report author-stated relevance only:
• Stated research objectives / Clinical or applied goals
• Practical applicability to clinical settings / Proposed use cases or settings
• Claimed contributions relative to existing work / How authors position their contribution
• Comparison to existing clinical practices / Any explicit comparisons made

## Methodology (200–250 words)
Describe only what the authors did, including:
• Study design and stated objectives (Overall study type, Explicit objectives or research questions)
• Data sources and sample characteristics (Data origin, Sample size, Key inclusion/exclusion details)
• Model or intervention description (Models, algorithms, or interventions used, Key components)
• Experimental or simulation setup (Training, validation, testing, or simulation procedures, Baselines or comparison conditions)
• Evaluation metrics (Metrics explicitly reported by the authors)

## Results (200–250 words)
Summarize reported findings without interpretation:
• Descriptive statistics or summary outcomes (Basic statistics or high-level outcomes)
• Alignment between reported results and stated hypotheses (Whether and how results address hypotheses or aims)

## Writing Clarity (50–70 words)
Describe writing quality factually:
• Clarity of stated research questions and aims (Whether aims are clearly articulated)
• Presence or absence of ambiguity or redundancy (Any explicitly observable issues)

## Ethical Considerations (50–70 words)
Report ethical elements as stated:
• Data privacy and confidentiality
• Informed consent (if applicable)
• Transparency and explainability
• Potential harms or misuse
• Compliance with ethical guidelines
If not addressed, state: "Not discussed in the paper."`;

export interface SummaryResult {
  success: boolean;
  summary?: string;
  error?: string;
}

/**
 * Generate an AI summary for a manuscript using DeepSeek
 */
export async function generateManuscriptSummary(
  manuscriptId: string
): Promise<SummaryResult> {
  try {
    // Fetch manuscript with its content
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: {
        sources: true,
      },
    });

    if (!manuscript) {
      return { success: false, error: "Manuscript not found" };
    }

    // Check if summary already exists
    if (manuscript.aiSummary) {
      return { success: true, summary: manuscript.aiSummary };
    }

    // Build the content to summarize
    let contentToSummarize = "";

    // Add title and abstract
    contentToSummarize += `Title: ${manuscript.title}\n\n`;
    if (manuscript.abstract) {
      contentToSummarize += `Abstract: ${manuscript.abstract}\n\n`;
    }

    // Try to get full content from f1000Document if available
    if (manuscript.sources.length > 0 && manuscript.sources[0].doi) {
      const doi = manuscript.sources[0].doi;
      const f1000Doc = await prisma.f1000Document.findUnique({
        where: { doi },
      });

      if (f1000Doc) {
        // Parse XML to extract text content
        const textContent = extractTextFromXml(f1000Doc.xmlData);
        if (textContent) {
          contentToSummarize += `Full Text:\n${textContent}\n`;
        }
      }
    }

    if (!contentToSummarize.trim()) {
      return { success: false, error: "No content available to summarize" };
    }

    // Call DeepSeek API
    console.log(`🤖 Generating summary for manuscript: ${manuscript.title.substring(0, 50)}...`);

    const deepseek = getDeepSeekClient();
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: `Please summarize the following paper:\n\n${contentToSummarize}` },
      ],
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more factual output
    });

    const summary = completion.choices[0]?.message?.content;

    if (!summary) {
      return { success: false, error: "No summary generated" };
    }

    // Save the summary to the database
    await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: {
        aiSummary: summary,
        aiSummaryGeneratedAt: new Date(),
      },
    });

    console.log(`✅ Summary generated and saved for manuscript: ${manuscriptId}`);

    return { success: true, summary };
  } catch (error) {
    console.error("Error generating summary:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Extract readable text from F1000 XML document
 */
function extractTextFromXml(xmlData: string): string {
  // Simple extraction - remove XML tags and get text content
  // For more sophisticated parsing, could use a proper XML parser

  // Remove XML declaration and processing instructions
  const text = xmlData.replace(/<\?[^>]+\?>/g, "");

  // Extract content from common text elements
  const sections: string[] = [];

  // Extract abstract
  const abstractMatch = text.match(/<abstract[^>]*>([\s\S]*?)<\/abstract>/i);
  if (abstractMatch) {
    sections.push("Abstract: " + stripTags(abstractMatch[1]));
  }

  // Extract body/main content
  const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    sections.push("Content: " + stripTags(bodyMatch[1]));
  }

  // Extract sections with titles
  const sectionMatches = text.matchAll(/<sec[^>]*>[\s\S]*?<title[^>]*>([\s\S]*?)<\/title>([\s\S]*?)<\/sec>/gi);
  for (const match of sectionMatches) {
    const title = stripTags(match[1]);
    const content = stripTags(match[2]);
    if (title && content) {
      sections.push(`${title}: ${content}`);
    }
  }

  // If no structured content found, just strip all tags
  if (sections.length === 0) {
    return stripTags(text).substring(0, 10000); // Limit to ~10k chars
  }

  return sections.join("\n\n").substring(0, 15000); // Limit total length
}

/**
 * Remove HTML/XML tags from text
 */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Review prompt based on llm-prompts/PromptForReviews2.docx
const REVIEW_SYSTEM_PROMPT = `You are a senior academic peer reviewer with expertise in urology, clinical research methodology, and AI-assisted medical studies. You have reviewed for high-impact venues (e.g., clinical journals, medical AI conferences). Your reviews are precise, critical, evidence-grounded, and written in a professional academic tone.

You must:
- Base all judgments strictly on the paper text provided
- Write reviews that could realistically appear in top-tier peer review venues
- Do not soften criticism
- Do not invent content

Reviewer guidelines: Thoroughly read the paper. Look up any related work and citations that will help you evaluate it in depth.

Evaluate the paper STRICTLY using the rubric below.

**Paper Summary** [Provide a concise overview of the paper, summarizing its motivation, its objectives, research design and methodology, key findings, and main conclusions.] [100-150 words]

**Strengths and weaknesses of the paper** [Critically evaluate the strengths and weaknesses of the paper. Present them in two sections (-Strengths, -weaknesses) in bullet points and support each point with specific evidence or examples from the article whenever possible.] Consider aspects such as if applicable:
- The importance and relevance of the research questions
- Clarity of the manuscript
- Technical soundness and methodological correctness
- Experimental rigor and robustness of evaluation
- Novelty and contribution to the field

**Paper decision** [Make a recommendation: Accept, Minor Revision, Major Revision, or Reject. Include the decision and reason.]

**Decision Calibration Rules:**
1. Recommend Reject if: Major methodological flaw; absence of required statistical justification; no ethical approval with human subjects; claims unsupported by results; insufficient novelty.
2. Recommend Major Revision if: Core idea valid but rigor insufficient; missing critical analyses; moderate novelty not clearly articulated; methodology has weaknesses needing correction.
3. Recommend Minor Revision if: Conclusions supported but clarity/reporting improvements needed; weaknesses limited to presentation issues.
4. Recommend Accept only if: Important well-motivated question; sound methodology; justified statistics; claims supported; ethical standards documented; clearly novel contribution.

**Suggestions for improvement** [Constructive feedback to strengthen the manuscript, not factors in overall evaluation.]

IMPORTANT: You MUST respond with valid JSON only (no markdown fencing, no extra text). Use this exact structure:
{
  "paper_summary": "...",
  "strengths": ["bullet point 1", "bullet point 2", ...],
  "weaknesses": ["bullet point 1", "bullet point 2", ...],
  "decision": "Accept" | "Minor Revision" | "Major Revision" | "Reject",
  "decision_reason": "...",
  "suggestions": ["suggestion 1", "suggestion 2", ...]
}`;

export interface ReviewResult {
  success: boolean;
  review?: Record<string, unknown>;
  error?: string;
}

/**
 * Generate an AI peer review for a manuscript using DeepSeek
 */
export async function generateManuscriptReview(
  manuscriptId: string
): Promise<ReviewResult> {
  try {
    const manuscript = await prisma.manuscript.findUnique({
      where: { id: manuscriptId },
      include: { sources: true },
    });

    if (!manuscript) {
      return { success: false, error: "Manuscript not found" };
    }

    // Build the paper content
    let paperContent = "";
    paperContent += `Title: ${manuscript.title}\n\n`;
    if (manuscript.abstract) {
      paperContent += `Abstract: ${manuscript.abstract}\n\n`;
    }

    // Get full content from f1000Document if available
    if (manuscript.sources.length > 0 && manuscript.sources[0].doi) {
      const doi = manuscript.sources[0].doi;
      const f1000Doc = await prisma.f1000Document.findUnique({
        where: { doi },
      });

      if (f1000Doc) {
        const textContent = extractTextFromXml(f1000Doc.xmlData);
        if (textContent) {
          paperContent += `Full Text:\n${textContent}\n`;
        }
      }
    }

    if (!paperContent.trim()) {
      return { success: false, error: "No content available to review" };
    }

    console.log(`🤖 Generating AI review for: ${manuscript.title.substring(0, 50)}...`);

    const deepseek = getDeepSeekClient();
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: REVIEW_SYSTEM_PROMPT },
        { role: "user", content: `Review the following paper:\n\n${paperContent}` },
      ],
      max_tokens: 4000,
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return { success: false, error: "No review generated" };
    }

    // Parse JSON response (strip markdown fencing if present)
    let review: Record<string, unknown>;
    try {
      const cleaned = responseText.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
      review = JSON.parse(cleaned);
    } catch {
      return { success: false, error: `Failed to parse review JSON: ${responseText.substring(0, 200)}` };
    }

    // Save to database
    await prisma.manuscript.update({
      where: { id: manuscriptId },
      data: {
        aiReview: review,
        aiReviewGeneratedAt: new Date(),
      },
    });

    console.log(`✅ Review generated and saved for manuscript: ${manuscriptId}`);
    return { success: true, review };
  } catch (error) {
    console.error("Error generating review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get or generate summary for a manuscript
 * Returns existing summary if available, otherwise generates a new one
 */
export async function getOrGenerateSummary(
  manuscriptId: string
): Promise<SummaryResult> {
  // First check if summary already exists
  const manuscript = await prisma.manuscript.findUnique({
    where: { id: manuscriptId },
    select: { aiSummary: true },
  });

  if (manuscript?.aiSummary) {
    return { success: true, summary: manuscript.aiSummary };
  }

  // Generate new summary
  return generateManuscriptSummary(manuscriptId);
}
