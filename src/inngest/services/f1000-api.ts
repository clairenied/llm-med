/**
 * F1000Research API Client
 *
 * API Documentation: https://f1000research.com/for-developers
 * Rate Limit: 100 requests per 60 seconds
 */

const F1000_BASE_URL = "https://f1000research.com/extapi";
const RATE_LIMIT_REQUESTS = 100;
const RATE_LIMIT_WINDOW_MS = 60000; // 60 seconds

/**
 * Simple in-memory rate limiter
 * Note: In production with multiple instances, consider using Redis
 */
class RateLimiter {
  private requests: number[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove timestamps older than the window
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
    );
    return this.requests.length < RATE_LIMIT_REQUESTS;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  async waitForSlot(): Promise<void> {
    while (!this.canMakeRequest()) {
      const oldestRequest = this.requests[0];
      const waitTime = RATE_LIMIT_WINDOW_MS - (Date.now() - oldestRequest) + 100;
      await new Promise((resolve) => setTimeout(resolve, Math.max(0, waitTime)));
    }
    this.recordRequest();
  }
}

const rateLimiter = new RateLimiter();

/**
 * Response from listing papers (XML format)
 */
export interface ListPapersResponse {
  dois: string[];
  totalNumberOfPages: number;
  numberOfResultsInPage: number;
}

/**
 * List papers matching a subject filter with pagination
 */
export async function listPapers(
  subject: string,
  page: number = 1,
  rowsPerPage: number = 100
): Promise<ListPapersResponse> {
  await rateLimiter.waitForSlot();

  const url = new URL(`${F1000_BASE_URL}/search`);
  url.searchParams.set("q", `R_SUB:"${subject}"`);
  url.searchParams.set("rows", rowsPerPage.toString());
  url.searchParams.set("page", page.toString());
  url.searchParams.set("wt", "xml"); // XML format for simpler parsing

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `F1000 API error: ${response.status} ${response.statusText}`
    );
  }

  const xmlText = await response.text();

  // Parse XML to extract DOIs and metadata
  const dois = extractDoisFromXml(xmlText);
  const totalPages = extractAttributeFromXml(xmlText, "totalNumberOfPages");
  const resultsInPage = extractAttributeFromXml(xmlText, "numberOfResultsInPage");

  return {
    dois,
    totalNumberOfPages: parseInt(totalPages || "1", 10),
    numberOfResultsInPage: parseInt(resultsInPage || "0", 10),
  };
}

/**
 * Fetch article XML for a specific DOI
 */
export async function fetchArticleXml(doi: string): Promise<string> {
  await rateLimiter.waitForSlot();

  const url = new URL(`${F1000_BASE_URL}/article/xml`);
  url.searchParams.set("doi", doi);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(
      `F1000 API error fetching article ${doi}: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}

/**
 * Extract DOIs from F1000 XML response
 * Expected format: <results><doi>10.12688/...</doi><doi>...</doi></results>
 */
function extractDoisFromXml(xml: string): string[] {
  const doiMatches = xml.matchAll(/<doi>(.*?)<\/doi>/g);
  return Array.from(doiMatches, (match) => match[1]);
}

/**
 * Extract attribute value from XML results tag
 * Expected format: <results totalNumberOfPages="5" ...>
 */
function extractAttributeFromXml(
  xml: string,
  attributeName: string
): string | null {
  const match = xml.match(
    new RegExp(`<results[^>]*${attributeName}="([^"]*)"`, "i")
  );
  return match ? match[1] : null;
}
