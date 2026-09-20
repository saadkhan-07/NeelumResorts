import Link from "next/link";
import { TourList } from "./TourList";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ToursPage() {
  await requireAdmin();

  const tours = await prisma.tour.findMany({
    orderBy: { order: "asc" },
    include: {
      photos: { orderBy: { order: "asc" }, take: 1 },
      fares: { where: { published: true }, select: { id: true } },
    },
  });

  return (
    <>
      <div className="admin-head">
        <h1>Jeep tours</h1>
        <p>Drag to reorder. A tour with no published fare quotes on WhatsApp instead.</p>
      </div>

      <Link href="/admin/tours/new" className="admin-btn admin-btn--block">
        Add a tour
      </Link>

      <div style={{ marginTop: 14 }}>
        {tours.length === 0 ? (
          <div className="admin-card">
            <p className="admin-empty">No tours yet.</p>
          </div>
        ) : (
          <TourList
            tours={tours.map((t) => ({
              id: t.id,
              name: t.name,
              published: t.published,
              showPrice: t.showPrice,
              fareCount: t.fares.length,
              cover: t.photos[0]?.publicId ?? null,
            }))}
          />
        )}
      </div>
    </>
  );
}
