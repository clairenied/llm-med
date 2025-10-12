import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { createEventMetadata } from "@/inngest/events";
import { getScraperConfig, type ScraperConfig } from "@/inngest/config";

/**
 * Manual trigger endpoint for the Inngest scraper
 *
 * POST /api/admin/scrape-inngest
 *
 * Body (optional):
 * {
 *   "baseUrl": "https://f1000research.com/browse/articles?term=COVID",
 *   "maxPages": 5,
 *   "delayMs": 2000,
 *   "maxRetries": 3,
 *   "batchSize": 5
 * }
 *
 * If no body is provided, default configuration is used.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body for custom configuration (optional)
    let config: ScraperConfig;

    try {
      const body = await req.json();
      // Use getScraperConfig with overrides from request body
      config = getScraperConfig(body);
    } catch {
      // If no body or invalid JSON, use defaults
      config = getScraperConfig();
    }

    // Generate session ID
    const scrapingSessionId = `session-${Date.now()}`;

    // Create event metadata
    const metadata = createEventMetadata("api-trigger", scrapingSessionId);

    // Send scraper.initiated event to Inngest
    const eventId = await inngest.send({
      name: "scraper.initiated",
      data: {
        config,
        metadata,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Scraping job initiated successfully",
        scrapingSessionId,
        eventId,
        config,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error initiating scraping job:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate scraping job",
      },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint to check status (optional)
 */
export async function GET() {
  const defaultConfig = getScraperConfig();

  return NextResponse.json({
    endpoint: "/api/admin/scrape-inngest",
    method: "POST",
    description: "Manually trigger the Inngest scraper workflow",
    defaultConfig,
    usage: {
      curl: `curl -X POST http://localhost:3010/api/admin/scrape-inngest -H "Content-Type: application/json" -d '{"maxPages": 3, "delayMs": 1500}'`,
    },
  });
}
