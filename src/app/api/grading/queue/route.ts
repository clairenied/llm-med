import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface ReviewData {
  id: string;
  reviewerName: string;
  reviewType: string;
  gradeCount: number;
  hasUserGraded: boolean;
  createdAt: string;
}

interface VersionData {
  versionNumber: number;
  reviews: ReviewData[];
}

interface ManuscriptGroup {
  manuscriptId: string;
  manuscriptTitle: string;
  versions: VersionData[];
  totalReviews: number;
  ungradedByUser: number;
  hasAiSummary: boolean;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all manuscripts with their versions and reviews, grouped properly
    const manuscripts = await prisma.manuscript.findMany({
      include: {
        versions: {
          include: {
            reviews: {
              include: {
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
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            versionNumber: "asc",
          },
        },
      },
    });

    // Transform into grouped structure
    const manuscriptGroups: ManuscriptGroup[] = [];

    for (const manuscript of manuscripts) {
      // Group reviews by their reviewedVersionNumber (which version they reviewed)
      const versionMap = new Map<number, ReviewData[]>();
      let totalReviews = 0;
      let ungradedByUser = 0;

      for (const version of manuscript.versions) {
        for (const review of version.reviews) {
          const gradeCount = review.grades.length;
          const hasUserGraded = review.grades.some((g) => g.graderId === userId);

          // Only include reviews that need grading (less than 2 grades) or user hasn't graded
          if (gradeCount < 2 || !hasUserGraded) {
            // Use reviewedVersionNumber if available, otherwise fall back to version.versionNumber
            const reviewVersion = review.reviewedVersionNumber ?? version.versionNumber;

            if (!versionMap.has(reviewVersion)) {
              versionMap.set(reviewVersion, []);
            }

            versionMap.get(reviewVersion)!.push({
              id: review.id,
              reviewerName: review.reviewer.name,
              reviewType: review.reviewType,
              gradeCount,
              hasUserGraded,
              createdAt: review.createdAt.toISOString(),
            });

            totalReviews++;
            if (!hasUserGraded) {
              ungradedByUser++;
            }
          }
        }
      }

      // Convert map to sorted array of versions
      const versions: VersionData[] = Array.from(versionMap.entries())
        .sort((a, b) => a[0] - b[0]) // Sort by version number ascending
        .map(([versionNumber, reviews]) => ({
          versionNumber,
          reviews,
        }));

      // Only include manuscripts with reviews needing grades
      if (versions.length > 0) {
        manuscriptGroups.push({
          manuscriptId: manuscript.id,
          manuscriptTitle: manuscript.title,
          versions,
          totalReviews,
          ungradedByUser,
          hasAiSummary: !!manuscript.aiSummary,
        });
      }
    }

    // Sort: prioritize manuscripts with more ungraded reviews by user
    manuscriptGroups.sort((a, b) => b.ungradedByUser - a.ungradedByUser);

    // Calculate overall stats
    const allReviews = await prisma.review.findMany({
      include: {
        grades: {
          select: {
            graderId: true,
          },
        },
      },
    });

    const stats = {
      totalReviews: allReviews.length,
      reviewsWithNoGrades: allReviews.filter((r) => r.grades.length === 0).length,
      reviewsWithOneGrade: allReviews.filter((r) => r.grades.length === 1).length,
      reviewsComplete: allReviews.filter((r) => r.grades.length >= 2).length,
      userGradedCount: allReviews.filter((r) =>
        r.grades.some((g) => g.graderId === userId)
      ).length,
      manuscriptsToGrade: manuscriptGroups.length,
    };

    return NextResponse.json({
      manuscripts: manuscriptGroups,
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
