-- One header photograph per inner page, keyed by page instead of by position.
-- Additive only: a nullable column and a unique index. No row is deleted.

-- AlterTable
ALTER TABLE "Media" ADD COLUMN "pageKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Media_pageKey_key" ON "Media"("pageKey");

-- Backfill: the site used to pick page headers by position, in route order
-- (stays, tours, gallery, contact). Give the existing rows those keys so every
-- page keeps the photograph it shows today.
UPDATE "Media" AS m
SET "pageKey" = k.key
FROM (
  SELECT id, row_number() OVER (ORDER BY "order", "createdAt", id) AS n
  FROM "Media"
  WHERE placement = 'PAGE_HEADER'
) AS ranked
JOIN (VALUES (1, 'stays'), (2, 'tours'), (3, 'gallery'), (4, 'contact')) AS k(n, key)
  ON k.n = ranked.n
WHERE m.id = ranked.id;
