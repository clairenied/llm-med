-- AlterEnum: Add AI_GENERATED to ReviewType
ALTER TYPE "ReviewType" ADD VALUE 'AI_GENERATED';

-- CreateTable: SystemSetting key-value store for admin toggles
CREATE TABLE "SystemSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
);

-- Seed default grading mode
INSERT INTO "SystemSetting" ("key", "value", "updatedAt") VALUES ('GRADING_MODE', 'HUMAN', NOW());
