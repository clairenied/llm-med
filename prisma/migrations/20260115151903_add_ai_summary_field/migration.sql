-- AlterTable
ALTER TABLE "public"."Manuscript" ADD COLUMN     "aiSummary" TEXT,
ADD COLUMN     "aiSummaryGeneratedAt" TIMESTAMP(3);
