import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { inngest } from "@/inngest/client";
import { createEventMetadata } from "@/inngest/events";
import { getScraperConfig, type ScraperConfig } from "@/inngest/config";

/**
 * Manual trigger endpoint for the Inngest scraper (with admin authentication)
 *
 * POST /api/admin/scrape
 *
 * Body (optional):
 * {
 *   "url": "https://f1000research.com/browse/articles?term=COVID",
 *   "pages": 5,
 *   "delay": 2000,
 *   "batchSize": 5
 * }
 */
export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse request body for custom configuration
    let config: ScraperConfig;

    try {
      const body = await request.json();
      const { pages, delay, batchSize, url } = body;

      // Map old parameter names to new config structure
      config = getScraperConfig({
        baseUrl: url,
        maxPages: pages,
        delayMs: delay,
        batchSize,
      });
    } catch {
      // If no body or invalid JSON, use defaults
      config = getScraperConfig();
    }

    console.log("🚀 Starting manual scraping job via Inngest...");

    // Generate session ID
    const scrapingSessionId = `session-${Date.now()}`;

    // Create event metadata
    const metadata = createEventMetadata("admin-api-trigger", scrapingSessionId);

    // Send scraper.initiated event to Inngest
    const eventId = await inngest.send({
      name: "scraper.initiated",
      data: {
        config,
        metadata,
      },
    });

    console.log(`✅ Scraping job initiated with session ID: ${scrapingSessionId}`);

    return NextResponse.json({
      success: true,
      message: "Manual scraping job initiated via Inngest",
      scrapingSessionId,
      eventId,
      config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Manual scraping job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
