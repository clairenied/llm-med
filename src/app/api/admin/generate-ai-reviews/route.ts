import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/inngest/client";

// GET: Status of AI review generation
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const [totalManuscripts, manuscriptsWithAiReview] = await Promise.all([
      prisma.manuscript.count(),
      prisma.review.count({ where: { reviewType: "AI_GENERATED" } }),
    ]);

    return NextResponse.json({
      totalManuscripts,
      manuscriptsWithAiReview,
      remaining: totalManuscripts - manuscriptsWithAiReview,
    });
  } catch (error) {
    console.error("AI review status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Trigger batch AI review generation
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await inngest.send({
      name: "manuscript.reviews.ai.batch.requested",
      data: {},
    });

    return NextResponse.json({
      message: "Batch AI review generation queued",
    });
  } catch (error) {
    console.error("Trigger AI reviews error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
