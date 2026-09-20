import { TourForm } from "../TourForm";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewTourPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head">
        <h1>Add a tour</h1>
        <p>It will be hidden until you publish it.</p>
      </div>
      <TourForm
        fares={[]}
        photos={[]}
        tour={{
          slug: "",
          name: "",
          tagline: "",
          shortDesc: "",
          longDesc: "",
          season: "",
          difficulty: "",
          travelNote: "",
          highlights: [],
          includes: [],
          showPrice: false,
          published: false,
        }}
      />
    </>
  );
}
