import { MediaManager } from "@/components/admin/MediaManager";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  await requireAdmin();

  const photos = await prisma.media.findMany({
    where: { placement: "GALLERY" },
    orderBy: { order: "asc" },
  });

  return (
    <>
      <div className="admin-head">
        <h1>Gallery</h1>
        <p>
          {photos.length === 0
            ? "Nothing here yet."
            : `${photos.length} photograph${photos.length === 1 ? "" : "s"}. Drag to reorder.`}
        </p>
      </div>

      <MediaManager
        placement="GALLERY"
        folder="neelum/gallery"
        showTile
        photos={photos.map((p) => ({
          id: p.id,
          publicId: p.publicId,
          alt: p.alt,
          tile: p.tile,
        }))}
        reorderLabel="Drag to reorder gallery photos"
        emptyText="No photographs yet. While the gallery is empty the section does not appear on the website at all."
      />
    </>
  );
}
