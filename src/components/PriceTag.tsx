import type { RoomWithPhotos } from "@/lib/queries";

/**
 * Rooms only — PROMPT.md rule 3.
 *
 * "Rates on request" unless the owner has both set a price and turned
 * `showPrice` on for that room. Tours never use this: their fares live on
 * `TourFare` and render through `<FareList>`.
 *
 * Two shapes, because the two places are different sizes: `card` is the line in
 * the card footer beside "Enquire", `row` is the panel beside "Check
 * availability" on /stays, where there is room to label it.
 */
export function PriceTag({
  room,
  variant = "card",
}: {
  room: Pick<RoomWithPhotos, "price" | "showPrice">;
  variant?: "card" | "row";
}) {
  if (!room.showPrice || room.price == null) {
    return <span className="room__note">Rates on request</span>;
  }

  const amount = `PKR ${room.price.toLocaleString("en-PK")}`;

  if (variant === "row") {
    return (
      <p className="rate-box">
        <span className="rate-box__label">Rate</span>
        <b>{amount}</b>
        <small>per night</small>
      </p>
    );
  }

  return (
    <span className="room__price">
      <b>{amount}</b>
      <small>per night</small>
    </span>
  );
}
