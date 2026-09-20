import { RoomForm } from "../RoomForm";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewRoomPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head">
        <h1>Add a room</h1>
        <p>It will be hidden until you publish it.</p>
      </div>
      <RoomForm
        photos={[]}
        room={{
          slug: "",
          name: "",
          tagline: "",
          shortDesc: "",
          longDesc: "",
          guests: "",
          beds: "",
          sizeSqft: "",
          view: "",
          amenities: [],
          price: null,
          showPrice: false,
          published: false,
        }}
      />
    </>
  );
}
