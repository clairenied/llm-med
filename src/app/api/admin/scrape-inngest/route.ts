import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { createEventMetadata } from "@/inngest/events";

/**
 * Manual trigger endpoint for the F1000 API scraper
 *
 * POST /api/admin/scrape-inngest
 *
 * Body:
 * {
 *   "subject": "Urology"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body for subject
    const body = await req.json();
    const subject = body.subject || "Urology"; // Default to Urology if not provided

    // Generate session ID
    const sessionId = `session-${Date.now()}`;

    // Create event metadata
    const metadata = createEventMetadata("api-trigger", sessionId);

    // Send f1000.list.requested event to Inngest
    const eventId = await inngest.send({
      name: "f1000.list.requested",
      data: {
        subject,
        metadata,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "F1000 scraping job initiated successfully",
        sessionId,
        eventId,
        subject,
      },
      { status: 200 }
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
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check status (optional)
 */
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/admin/scrape-inngest",
    method: "POST",
    description: "Manually trigger the F1000 API scraper workflow",
    usage: {
      curl: `curl -X POST http://localhost:3010/api/admin/scrape-inngest -H "Content-Type: application/json" -d '{"subject": "Urology"}'`,
    },
    exampleSubjects: [
      "Urology",
      "Cardiology",
      "Neurology",
      "Oncology",
      "Immunology",
    ],
  });
}
