-- CreateEnum
CREATE TYPE "UserCategory" AS ENUM ('AUTHOR', 'BOARD', 'STAFF', 'RESEARCHER');

-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "category" "UserCategory" NOT NULL DEFAULT 'STAFF';
