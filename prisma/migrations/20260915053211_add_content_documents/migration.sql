-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('STUDY_DOC', 'QA_DOC');

-- CreateTable
CREATE TABLE "ContentDocument" (
    "id" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "previewPdfUrl" TEXT,
    "thumbnailUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentDocument_slug_key" ON "ContentDocument"("slug");

-- CreateIndex
CREATE INDEX "ContentDocument_categoryId_idx" ON "ContentDocument"("categoryId");

-- CreateIndex
CREATE INDEX "ContentDocument_type_idx" ON "ContentDocument"("type");

-- CreateIndex
CREATE INDEX "ContentDocument_title_idx" ON "ContentDocument"("title");

-- CreateIndex
CREATE INDEX "ContentDocument_slug_idx" ON "ContentDocument"("slug");

-- AddForeignKey
ALTER TABLE "ContentDocument" ADD CONSTRAINT "ContentDocument_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
