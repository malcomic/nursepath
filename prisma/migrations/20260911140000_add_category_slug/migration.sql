-- AlterTable: add nullable slug, backfill, then enforce unique NOT NULL
ALTER TABLE "Category" ADD COLUMN "slug" TEXT;

UPDATE "Category"
SET "slug" = trim(both '-' FROM regexp_replace(lower(trim("name")), '[^a-z0-9]+', '-', 'g'));

UPDATE "Category"
SET "slug" = 'category-' || left("id", 8)
WHERE "slug" IS NULL OR "slug" = '';

WITH ranked AS (
  SELECT
    "id",
    "slug",
    ROW_NUMBER() OVER (PARTITION BY "slug" ORDER BY "createdAt" ASC, "id" ASC) AS rn
  FROM "Category"
)
UPDATE "Category" AS c
SET "slug" = c."slug" || '-' || ranked.rn::text
FROM ranked
WHERE c."id" = ranked."id" AND ranked.rn > 1;

ALTER TABLE "Category" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE INDEX "Category_slug_idx" ON "Category"("slug");
