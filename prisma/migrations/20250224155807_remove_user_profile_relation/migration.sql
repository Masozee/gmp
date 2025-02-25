/*
  Warnings:

  - You are about to drop the column `userId` on the `profiles` table. All the data in the column will be lost.

*/
-- First, update any NULL email values with a generated email based on first and last name
UPDATE "profiles"
SET email = CONCAT(LOWER(REPLACE(CONCAT(SUBSTRING("firstName", 1, 1), "lastName"), ' ', '')), '@example.com')
WHERE email IS NULL;

-- Drop the user relation
ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "profiles_userId_fkey";
DROP INDEX IF EXISTS "profiles_userId_key";
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "userId";

-- Make email required and unique
ALTER TABLE "profiles" ALTER COLUMN "email" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_email_key" ON "profiles"("email");
