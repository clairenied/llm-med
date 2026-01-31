import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrGenerateSummary } from "@/lib/deepseek";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ manuscriptId: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user has grader or admin role (LLM calls are expensive)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || !["GRADER", "ADMIN"].includes(user.role)) {
      return NextResponse.json(
        { error: "Grader access required" },
        { status: 403 }
      );
    }

    const { manuscriptId } = await params;

    if (!manuscriptId) {
      return NextResponse.json(
        { error: "Manuscript ID required" },
        { status: 400 }
      );
    }

    // Get or generate the summary
    const result = await getOrGenerateSummary(manuscriptId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to generate summary" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      summary: result.summary,
    });
  } catch (error) {
    console.error("Summary API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
