import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GradeValue } from "@prisma/client";

// GET: Fetch review details for grading
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await params;
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

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        version: {
          include: {
            manuscript: {
              select: {
                id: true,
                title: true,
                abstract: true,
                aiSummary: true,
                sources: {
                  select: {
                    url: true,
                    doi: true,
                  },
                  take: 1,
                },
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
          where: {
            graderId: userId,
          },
          select: {
            clinicalRelevance: true,
            methodology: true,
            results: true,
            writingClarity: true,
            ethicalConsiderations: true,
            notes: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Use DOI resolver to link to the paper (it redirects to F1000Research)
    const source = review.version.manuscript.sources[0];
    const externalUrl = source?.doi ? `https://doi.org/${source.doi}` : null;

    return NextResponse.json({
      review: {
        id: review.id,
        content: review.content,
        reviewerName: review.reviewer.name,
        reviewType: review.reviewType,
        versionNumber: review.reviewedVersionNumber ?? review.version.versionNumber,
        manuscript: {
          id: review.version.manuscript.id,
          title: review.version.manuscript.title,
          abstract: review.version.manuscript.abstract,
          aiSummary: review.version.manuscript.aiSummary,
          externalUrl,
        },
        existingGrade: review.grades[0] || null,
      },
    });
  } catch (error) {
    console.error("Get review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Submit grade for a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await params;
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

    const body = await request.json();
    const { grades, notes } = body;

    // Validate grade values before transaction
    const validGrades = ["VERY_GOOD", "GOOD", "POOR", "VERY_POOR", "NA"];
    for (const [key, value] of Object.entries(grades)) {
      if (!validGrades.includes(value as string)) {
        return NextResponse.json(
          { error: `Invalid grade value for ${key}` },
          { status: 400 }
        );
      }
    }

    // Use transaction to prevent race condition where two graders
    // could submit simultaneously and both pass the 2-grade limit check
    const grade = await prisma.$transaction(async (tx) => {
      // Validate the review exists
      const review = await tx.review.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new Error("REVIEW_NOT_FOUND");
      }

      // Check if user already has a grade for this review
      const existingUserGrade = await tx.reviewGrade.findUnique({
        where: {
          reviewId_graderId: {
            reviewId,
            graderId: userId,
          },
        },
      });

      // If user is updating their own grade, allow it
      if (existingUserGrade) {
        return tx.reviewGrade.update({
          where: { id: existingUserGrade.id },
          data: {
            clinicalRelevance: grades.clinicalRelevance as GradeValue,
            methodology: grades.methodology as GradeValue,
            results: grades.results as GradeValue,
            writingClarity: grades.writingClarity as GradeValue,
            ethicalConsiderations: grades.ethicalConsiderations as GradeValue,
            notes: notes || null,
          },
        });
      }

      // Count grades from other users (atomic within transaction)
      const otherGradeCount = await tx.reviewGrade.count({
        where: {
          reviewId,
          graderId: { not: userId },
        },
      });

      if (otherGradeCount >= 2) {
        throw new Error("REVIEW_FULL");
      }

      // Create new grade
      return tx.reviewGrade.create({
        data: {
          reviewId,
          graderId: userId,
          clinicalRelevance: grades.clinicalRelevance as GradeValue,
          methodology: grades.methodology as GradeValue,
          results: grades.results as GradeValue,
          writingClarity: grades.writingClarity as GradeValue,
          ethicalConsiderations: grades.ethicalConsiderations as GradeValue,
          notes: notes || null,
        },
      });
    });

    return NextResponse.json({
      success: true,
      grade: {
        id: grade.id,
      },
    });
  } catch (error) {
    // Handle specific transaction errors
    if (error instanceof Error) {
      if (error.message === "REVIEW_NOT_FOUND") {
        return NextResponse.json({ error: "Review not found" }, { status: 404 });
      }
      if (error.message === "REVIEW_FULL") {
        return NextResponse.json(
          { error: "This review already has 2 grades" },
          { status: 400 }
        );
      }
    }

    console.error("Submit grade error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
