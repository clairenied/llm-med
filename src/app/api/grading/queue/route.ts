import { NextRequest, NextResponse } from "next/server";
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
  externalUrl: string | null;
  versions: VersionData[];
  totalReviews: number;
  ungradedByUser: number;
  actionableByUser: number;
  hasAiSummary: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Parse pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

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

    // Get all manuscripts with their versions and reviews, grouped properly
    const manuscripts = await prisma.manuscript.findMany({
      include: {
        sources: {
          select: {
            doi: true,
          },
          take: 1,
        },
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
      let actionableByUser = 0;

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
              if (gradeCount < 2) {
                actionableByUser++;
              }
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
        // Build external URL from DOI
        const doi = manuscript.sources[0]?.doi;
        const externalUrl = doi ? `https://doi.org/${doi}` : null;

        manuscriptGroups.push({
          manuscriptId: manuscript.id,
          manuscriptTitle: manuscript.title,
          externalUrl,
          versions,
          totalReviews,
          ungradedByUser,
          actionableByUser,
          hasAiSummary: !!manuscript.aiSummary,
        });
      }
    }

    // Sort: manuscripts with actionable reviews (need grading, < 2/2) first
    manuscriptGroups.sort((a, b) => {
      // Primary: papers with reviews needing grades (not yet 2/2, not yet graded by user)
      const aNoAction = a.actionableByUser === 0 ? 1 : 0;
      const bNoAction = b.actionableByUser === 0 ? 1 : 0;
      if (aNoAction !== bNoAction) return aNoAction - bNoAction;
      // Secondary: more total reviews first
      if (b.totalReviews !== a.totalReviews) return b.totalReviews - a.totalReviews;
      // Tertiary: title for consistency
      return a.manuscriptTitle.localeCompare(b.manuscriptTitle);
    });

    // Apply pagination
    const totalManuscripts = manuscriptGroups.length;
    const totalPages = Math.ceil(totalManuscripts / limit);
    const startIndex = (page - 1) * limit;
    const paginatedManuscripts = manuscriptGroups.slice(startIndex, startIndex + limit);

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
      manuscriptsToGrade: totalManuscripts,
    };

    return NextResponse.json({
      manuscripts: paginatedManuscripts,
      stats,
      pagination: {
        page,
        limit,
        totalManuscripts,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Grading queue error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
