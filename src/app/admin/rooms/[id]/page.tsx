import { notFound } from "next/navigation";
import { RoomForm } from "../RoomForm";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });
  if (!room) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>{room.name}</h1>
        <p>{room.published ? "Live on the website." : "Hidden from the website."}</p>
      </div>
      <RoomForm
        room={{
          id: room.id,
          slug: room.slug,
          name: room.name,
          tagline: room.tagline,
          shortDesc: room.shortDesc,
          longDesc: room.longDesc,
          guests: room.guests,
          beds: room.beds,
          sizeSqft: room.sizeSqft ?? "",
          view: room.view,
          amenities: room.amenities,
          price: room.price,
          showPrice: room.showPrice,
          published: room.published,
        }}
        photos={room.photos.map((p) => ({
          id: p.id,
          publicId: p.publicId,
          alt: p.alt,
          width: p.width,
          height: p.height,
        }))}
      />
    </>
  );
}
