-- CreateEnum
CREATE TYPE "public"."UserInvitationStatus" AS ENUM ('NOT_INVITED', 'INVITED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "invitationStatus" "public"."UserInvitationStatus" NOT NULL DEFAULT 'NOT_INVITED';
