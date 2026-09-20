import { MediaManager } from "@/components/admin/MediaManager";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  await requireAdmin();

  const photos = await prisma.media.findMany({
    where: { placement: "HERO" },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <div className="admin-head">
        <h1>Front page photos</h1>
        <p>
          The big photographs at the top of the home page. They fade from one to the
          next every few seconds — the first one in this list is what a visitor sees
          when the page opens, so put your strongest photograph there.
        </p>
      </div>

      <MediaManager
        placement="HERO"
        folder="neelum/hero"
        photos={photos.map((p) => ({
          id: p.id,
          publicId: p.publicId,
          alt: p.alt,
          tile: p.tile,
        }))}
        uploadLabel="Upload front page photos"
        reorderLabel="Drag to reorder the front page photos"
        emptyText="No photographs yet. With none, the top of the home page falls back to a plain dark green panel and the headline still reads — nothing breaks, but it is worth adding one."
      />

      <p className="admin-sub">A note on these</p>
      <p style={{ color: "var(--a-muted)", fontSize: ".85rem", maxWidth: 620 }}>
        Landscape photographs work best — they are shown full width and cropped to the
        height of the screen, so anything tall loses its top and bottom. Two or three is
        plenty; every extra one is another photograph a guest on valley mobile data has
        to download.
      </p>
    </>
  );
}
