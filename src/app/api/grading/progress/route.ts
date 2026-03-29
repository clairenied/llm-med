import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getGradingMode } from "@/lib/settings";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Verify user has grader or admin role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || !["GRADER", "ADMIN"].includes(user.role)) {
      return NextResponse.json(
        { error: "Grader access required" },
        { status: 403 }
      );
    }

    // Filter by grading mode
    const gradingMode = await getGradingMode();
    const reviewTypeFilter =
      gradingMode === "AI"
        ? { reviewType: "AI_GENERATED" as const }
        : { reviewType: { not: "AI_GENERATED" as const } };
    const sqlReviewTypeCondition =
      gradingMode === "AI"
        ? `WHERE r."reviewType" = 'AI_GENERATED'`
        : `WHERE r."reviewType" != 'AI_GENERATED'`;

    // Use parallel queries with aggregations instead of loading all data
    const [
      totalReviews,
      totalGradesSubmitted,
      reviewGradeCounts,
      graderGradeCounts,
      recentGrades,
    ] = await Promise.all([
      // Total reviews count (filtered by mode)
      prisma.review.count({ where: reviewTypeFilter }),

      // Total grades submitted (filtered by mode via review join)
      prisma.reviewGrade.count({
        where: { review: reviewTypeFilter },
      }),

      // Get grade counts per review using raw query for efficiency
      prisma.$queryRawUnsafe<{ grade_count: bigint; review_count: bigint }[]>(`
        SELECT
          CASE
            WHEN grade_count >= 2 THEN 2
            ELSE grade_count
          END as grade_count,
          COUNT(*) as review_count
        FROM (
          SELECT r.id, COUNT(rg.id) as grade_count
          FROM "Review" r
          LEFT JOIN "ReviewGrade" rg ON r.id = rg."reviewId"
          ${sqlReviewTypeCondition}
          GROUP BY r.id
        ) subq
        GROUP BY CASE WHEN grade_count >= 2 THEN 2 ELSE grade_count END
      `),

      // Get per-grader stats using groupBy (filtered by mode)
      prisma.reviewGrade.groupBy({
        by: ["graderId"],
        where: { review: reviewTypeFilter },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),

      // Recent activity (filtered by mode)
      prisma.reviewGrade.findMany({
        where: { review: reviewTypeFilter },
        take: 20,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          grader: {
            select: { name: true },
          },
          review: {
            select: {
              version: {
                select: {
                  manuscript: {
                    select: { title: true },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    // Process grade counts into stats
    let reviewsWithNoGrades = 0;
    let reviewsWithOneGrade = 0;
    let reviewsComplete = 0;

    for (const row of reviewGradeCounts) {
      const count = Number(row.grade_count);
      const reviewCount = Number(row.review_count);
      if (count === 0) reviewsWithNoGrades = reviewCount;
      else if (count === 1) reviewsWithOneGrade = reviewCount;
      else reviewsComplete = reviewCount;
    }

    // Fetch grader details for those with grades
    const graderIds = graderGradeCounts.map((g) => g.graderId);
    const graders = await prisma.user.findMany({
      where: { id: { in: graderIds } },
      select: { id: true, name: true, email: true },
    });

    const graderMap = new Map<string, { id: string; name: string | null; email: string }>(
      graders.map((g) => [g.id, g])
    );

    const graderStats = graderGradeCounts.map((g) => {
      const grader = graderMap.get(g.graderId);
      return {
        id: g.graderId,
        name: grader?.name || "Unknown",
        email: grader?.email || "",
        gradeCount: g._count.id,
      };
    });

    // Format recent activity
    const recentActivity = recentGrades.map((grade) => ({
      id: grade.id,
      graderName: grade.grader.name || "Unknown",
      manuscriptTitle: grade.review.version.manuscript.title,
      createdAt: grade.createdAt.toISOString(),
    }));

    const totalGradesNeeded = totalReviews * 2;
    const overallProgress = totalGradesNeeded > 0
      ? Math.round((totalGradesSubmitted / totalGradesNeeded) * 100)
      : 0;

    return NextResponse.json({
      overall: {
        totalReviews,
        reviewsWithNoGrades,
        reviewsWithOneGrade,
        reviewsComplete,
        totalGradesNeeded,
        totalGradesSubmitted,
        progressPercent: overallProgress,
      },
      graderStats,
      recentActivity,
    });
  } catch (error) {
    console.error("Progress report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
