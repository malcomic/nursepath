-- AlterTable: add nullable slug, backfill, then enforce unique NOT NULL
ALTER TABLE "Guide" ADD COLUMN "slug" TEXT;

-- Approximate lib/slugify.ts in SQL
UPDATE "Guide"
SET "slug" = trim(both '-' FROM regexp_replace(lower(trim("title")), '[^a-z0-9]+', '-', 'g'));

UPDATE "Guide"
SET "slug" = 'guide-' || left("id", 8)
WHERE "slug" IS NULL OR "slug" = '';

-- Disambiguate duplicate slugs (keep first by createdAt)
WITH ranked AS (
  SELECT
    "id",
    "slug",
    ROW_NUMBER() OVER (PARTITION BY "slug" ORDER BY "createdAt" ASC, "id" ASC) AS rn
  FROM "Guide"
)
UPDATE "Guide" AS g
SET "slug" = g."slug" || '-' || ranked.rn::text
FROM ranked
WHERE g."id" = ranked."id" AND ranked.rn > 1;

ALTER TABLE "Guide" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");
CREATE INDEX "Guide_slug_idx" ON "Guide"("slug");
