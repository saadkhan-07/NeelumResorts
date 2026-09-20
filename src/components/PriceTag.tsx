import type { RoomWithPhotos } from "@/lib/queries";

/**
 * Rooms only — PROMPT.md rule 3.
 *
 * "Rates on request" unless the owner has both set a price and turned
 * `showPrice` on for that room. Tours never use this: their fares live on
 * `TourFare` and render through `<FareList>`.
 */
export function PriceTag({ room }: { room: Pick<RoomWithPhotos, "price" | "showPrice"> }) {
  if (!room.showPrice || room.price == null) {
    return <span className="room__note">Rates on request</span>;
  }

  return (
    <span className="room__note">
      PKR {room.price.toLocaleString("en-PK")} <span aria-hidden="true">·</span> night
    </span>
  );
}
