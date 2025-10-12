import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { inngest } from "@/inngest/client";
import { createEventMetadata } from "@/inngest/events";

/**
 * Manual trigger endpoint for the F1000 API scraper (with admin authentication)
 *
 * POST /api/admin/scrape
 *
 * Body:
 * {
 *   "subject": "Urology"
 * }
 */
export async function POST(request: Request) {
  try {
    // Verify admin authentication
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse request body for subject
    const body = await request.json();
    const subject = body.subject || "Urology"; // Default to Urology if not provided

    console.log(`🚀 Starting F1000 scraping job for subject: ${subject}`);

    // Generate session ID
    const sessionId = `session-${Date.now()}`;

    // Create event metadata
    const metadata = createEventMetadata("admin-api-trigger", sessionId);

    // Send f1000.list.requested event to Inngest
    const eventId = await inngest.send({
      name: "f1000.list.requested",
      data: {
        subject,
        metadata,
      },
    });

    console.log(`✅ F1000 scraping job initiated with session ID: ${sessionId}`);

    return NextResponse.json({
      success: true,
      message: "F1000 scraping job initiated via Inngest",
      sessionId,
      eventId,
      subject,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ F1000 scraping job failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
