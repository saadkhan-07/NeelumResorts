import { notFound } from "next/navigation";
import { TourForm } from "../TourForm";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const tour = await prisma.tour.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" } },
      fares: { orderBy: { order: "asc" } },
    },
  });
  if (!tour) notFound();

  return (
    <>
      <div className="admin-head">
        <h1>{tour.name}</h1>
        <p>{tour.published ? "Live on the website." : "Hidden from the website."}</p>
      </div>
      <TourForm
        tour={{
          id: tour.id,
          slug: tour.slug,
          name: tour.name,
          tagline: tour.tagline,
          shortDesc: tour.shortDesc,
          longDesc: tour.longDesc,
          season: tour.season ?? "",
          difficulty: tour.difficulty ?? "",
          travelNote: tour.travelNote ?? "",
          highlights: tour.highlights,
          includes: tour.includes,
          showPrice: tour.showPrice,
          published: tour.published,
        }}
        fares={tour.fares.map((f) => ({
          key: f.id,
          id: f.id,
          pickupName: f.pickupName,
          priceMin: String(f.priceMin),
          priceMax: f.priceMax == null ? "" : String(f.priceMax),
          note: f.note ?? "",
          published: f.published,
        }))}
        photos={tour.photos.map((p) => ({
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
