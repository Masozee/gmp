/*
  Warnings:

  - Made the column `eventId` on table `presentations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "presentations" DROP CONSTRAINT "presentations_speakerId_fkey";

-- AlterTable
ALTER TABLE "presentations" ALTER COLUMN "eventId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "presentations_eventId_idx" ON "presentations"("eventId");

-- AddForeignKey
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_speakerId_fkey" FOREIGN KEY ("speakerId") REFERENCES "speakers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentations" ADD CONSTRAINT "presentations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
