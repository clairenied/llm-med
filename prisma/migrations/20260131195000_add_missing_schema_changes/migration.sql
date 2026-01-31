-- Add firstName and lastName columns to User table
ALTER TABLE "public"."User" ADD COLUMN "firstName" TEXT;
ALTER TABLE "public"."User" ADD COLUMN "lastName" TEXT;

-- Add reviewedVersionNumber to Review table
ALTER TABLE "public"."Review" ADD COLUMN "reviewedVersionNumber" INTEGER;

-- CreateEnum for EmailTemplateType
CREATE TYPE "public"."EmailTemplateType" AS ENUM ('INVITATION', 'COMMUNICATION');

-- CreateTable for EmailTemplate
CREATE TABLE "public"."EmailTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "public"."EmailTemplateType" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for EmailTemplate name uniqueness
CREATE UNIQUE INDEX "EmailTemplate_name_key" ON "public"."EmailTemplate"("name");
