import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all reviews with their grade counts and manuscript info
    const reviews = await prisma.review.findMany({
      include: {
        version: {
          include: {
            manuscript: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            name: true,
          },
        },
        grades: {
          select: {
            graderId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform for the frontend
    const reviewsForGrading = reviews.map((review) => ({
      id: review.id,
      manuscriptTitle: review.version.manuscript.title,
      manuscriptId: review.version.manuscript.id,
      reviewerName: review.reviewer.name,
      gradeCount: review.grades.length,
      hasUserGraded: review.grades.some((g) => g.graderId === userId),
      createdAt: review.createdAt.toISOString(),
    }));

    // Filter to show reviews that need grading (less than 2 grades)
    // or that the user hasn't graded yet
    const reviewsNeedingGrades = reviewsForGrading.filter(
      (r) => r.gradeCount < 2 || !r.hasUserGraded
    );

    // Sort: prioritize reviews with fewer grades, then by user not having graded
    reviewsNeedingGrades.sort((a, b) => {
      // First, show reviews user hasn't graded
      if (a.hasUserGraded !== b.hasUserGraded) {
        return a.hasUserGraded ? 1 : -1;
      }
      // Then sort by grade count (fewer first)
      return a.gradeCount - b.gradeCount;
    });

    // Calculate stats
    const stats = {
      totalReviews: reviews.length,
      reviewsWithNoGrades: reviews.filter((r) => r.grades.length === 0).length,
      reviewsWithOneGrade: reviews.filter((r) => r.grades.length === 1).length,
      reviewsComplete: reviews.filter((r) => r.grades.length >= 2).length,
      userGradedCount: reviews.filter((r) =>
        r.grades.some((g) => g.graderId === userId)
      ).length,
    };

    return NextResponse.json({
      reviews: reviewsNeedingGrades,
      stats,
    });
  } catch (error) {
    console.error("Grading queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
