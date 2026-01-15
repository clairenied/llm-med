import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all reviews with their grades
    const reviews = await prisma.review.findMany({
      include: {
        grades: {
          include: {
            grader: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        version: {
          include: {
            manuscript: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // Calculate overall stats
    const totalReviews = reviews.length;
    const reviewsWithNoGrades = reviews.filter((r) => r.grades.length === 0).length;
    const reviewsWithOneGrade = reviews.filter((r) => r.grades.length === 1).length;
    const reviewsComplete = reviews.filter((r) => r.grades.length >= 2).length;

    const totalGradesNeeded = totalReviews * 2;
    const totalGradesSubmitted = reviews.reduce((sum, r) => sum + r.grades.length, 0);
    const overallProgress = totalGradesNeeded > 0
      ? Math.round((totalGradesSubmitted / totalGradesNeeded) * 100)
      : 0;

    // Get per-grader stats
    const graderMap = new Map<string, { id: string; name: string; email: string; gradeCount: number }>();

    for (const review of reviews) {
      for (const grade of review.grades) {
        const existing = graderMap.get(grade.graderId);
        if (existing) {
          existing.gradeCount++;
        } else {
          graderMap.set(grade.graderId, {
            id: grade.graderId,
            name: grade.grader.name || "Unknown",
            email: grade.grader.email || "",
            gradeCount: 1,
          });
        }
      }
    }

    const graderStats = Array.from(graderMap.values()).sort((a, b) => b.gradeCount - a.gradeCount);

    // Get recent activity (last 20 grades)
    const recentGrades = await prisma.reviewGrade.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        grader: {
          select: {
            name: true,
          },
        },
        review: {
          include: {
            version: {
              include: {
                manuscript: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const recentActivity = recentGrades.map((grade) => ({
      id: grade.id,
      graderName: grade.grader.name || "Unknown",
      manuscriptTitle: grade.review.version.manuscript.title,
      createdAt: grade.createdAt.toISOString(),
    }));

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
