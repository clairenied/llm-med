-- CreateEnum
CREATE TYPE "public"."GradeValue" AS ENUM ('VERY_GOOD', 'GOOD', 'POOR', 'VERY_POOR', 'NA');

-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'GRADER';

-- CreateTable
CREATE TABLE "public"."ReviewGrade" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "graderId" TEXT NOT NULL,
    "clinicalRelevance" "public"."GradeValue",
    "methodology" "public"."GradeValue",
    "results" "public"."GradeValue",
    "writingClarity" "public"."GradeValue",
    "ethicalConsiderations" "public"."GradeValue",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewGrade_reviewId_graderId_key" ON "public"."ReviewGrade"("reviewId", "graderId");

-- AddForeignKey
ALTER TABLE "public"."ReviewGrade" ADD CONSTRAINT "ReviewGrade_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ReviewGrade" ADD CONSTRAINT "ReviewGrade_graderId_fkey" FOREIGN KEY ("graderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
