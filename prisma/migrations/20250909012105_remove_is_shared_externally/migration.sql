/*
  Warnings:

  - You are about to drop the column `isSharedExternally` on the `Review` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "isSharedExternally";
