-- AlterTable
ALTER TABLE "public"."Manuscript" ADD COLUMN     "aiReview" JSONB,
ADD COLUMN     "aiReviewGeneratedAt" TIMESTAMP(3);
