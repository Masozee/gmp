/*
  Warnings:

  - The `status` column on the `publications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `publication_files` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `description` on table `publications` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `publications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "publication_files" DROP CONSTRAINT "publication_files_publicationId_fkey";

-- AlterTable
ALTER TABLE "publications" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'DRAFT';

-- DropTable
DROP TABLE "publication_files";

-- CreateTable
CREATE TABLE "PublicationFile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publicationId" TEXT NOT NULL,

    CONSTRAINT "PublicationFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnPublications" (
    "publicationId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoriesOnPublications_pkey" PRIMARY KEY ("publicationId","categoryId")
);

-- CreateIndex
CREATE INDEX "PublicationFile_publicationId_idx" ON "PublicationFile"("publicationId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "CategoriesOnPublications_categoryId_idx" ON "CategoriesOnPublications"("categoryId");

-- CreateIndex
CREATE INDEX "CategoriesOnPublications_publicationId_idx" ON "CategoriesOnPublications"("publicationId");

-- AddForeignKey
ALTER TABLE "PublicationFile" ADD CONSTRAINT "PublicationFile_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPublications" ADD CONSTRAINT "CategoriesOnPublications_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnPublications" ADD CONSTRAINT "CategoriesOnPublications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
