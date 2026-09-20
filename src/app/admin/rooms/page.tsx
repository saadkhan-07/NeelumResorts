import Link from "next/link";
import { RoomList } from "./RoomList";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  await requireAdmin();

  const rooms = await prisma.room.findMany({
    orderBy: { order: "asc" },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });

  return (
    <>
      <div className="admin-head">
        <h1>Rooms</h1>
        <p>Drag to change the order they appear in on the website.</p>
      </div>

      <Link href="/admin/rooms/new" className="admin-btn admin-btn--block">
        Add a room
      </Link>

      <div style={{ marginTop: 14 }}>
        {rooms.length === 0 ? (
          <div className="admin-card">
            <p className="admin-empty">No rooms yet.</p>
          </div>
        ) : (
          <RoomList
            rooms={rooms.map((r) => ({
              id: r.id,
              name: r.name,
              slug: r.slug,
              published: r.published,
              showPrice: r.showPrice,
              price: r.price,
              cover: r.photos[0]?.publicId ?? null,
            }))}
          />
        )}
      </div>
    </>
  );
}
