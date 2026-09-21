import { FareListDetail } from "./FareList";
import { PickupSelect } from "./PickupSelect";
import { PhotoStrip } from "./PhotoStrip";
import {
  BedIcon,
  CheckIcon,
  ClockIcon,
  GuestsIcon,
  JeepIcon,
  LeafIcon,
  MountainIcon,
  SizeIcon,
  WhatsAppIcon,
} from "./icons";
import type { MediaRow, RoomWithPhotos, TourWithFares } from "@/lib/queries";
import { waLink, waRoom } from "@/lib/wa";

const ROW_SIZES = "(max-width: 900px) 100vw, 50vw";

/**
 * The media column of a detail row. `PhotoStrip` shows every photograph the room
 * or tour has, falling back to a single image or the neutral block.
 */
function RowMedia({ photos, alt, defer }: { photos: MediaRow[]; alt: string; defer?: boolean }) {
  return <PhotoStrip photos={photos} alt={alt} sizes={ROW_SIZES} defer={defer} />;
}

/**
 * A room detail row — /stays, and /stays/[slug] for a single room.
 *
 * The reference has no separate per-room page: `rooms.html` stacks these rows with
 * `id` anchors. `/stays/[slug]` in PROMPT.md § 8 therefore renders this same row on
 * a page of its own rather than inventing a second layout.
 *
 * Note there is no price anywhere on this row — the reference shows rates only on
 * the cards, and rule 3 keeps them off by default there too.
 */
export function RoomRow({
  room,
  whatsapp,
  deferMedia,
}: {
  room: RoomWithPhotos;
  whatsapp: string;
  /** Rows after the first on a list page — see PhotoStrip `defer`. */
  deferMedia?: boolean;
}) {
  return (
    <div className="room-row reveal is-in" id={room.slug}>
      <RowMedia photos={room.photos} alt={room.name} defer={deferMedia} />
      <div>
        <p className="eyebrow">{room.tagline}</p>
        <h2>{room.name}</h2>
        <div className="room__meta" style={{ margin: "18px 0 22px" }}>
          <span>
            <GuestsIcon />
            {room.guests}
          </span>
          <span>
            <BedIcon />
            {room.beds}
          </span>
          {room.sizeSqft ? (
            <span>
              <SizeIcon />
              {room.sizeSqft}
            </span>
          ) : null}
          <span>
            <MountainIcon />
            {room.view}
          </span>
        </div>
        <p>{room.longDesc}</p>
        <ul className="amenity-list">
          {room.amenities.map((amenity) => (
            <li key={amenity}>
              <CheckIcon />
              <span>{amenity}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <a
            className="btn btn--primary"
            href={waLink(whatsapp, waRoom(room.name))}
            target="_blank"
            rel="noopener"
          >
            <WhatsAppIcon />
            Check availability
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * A tour detail row — /tours, and /tours/[slug] for a single tour.
 *
 * Same shape as a room row, with the fare table and the pick-up selector in place
 * of the amenity CTA. `<PickupSelect>` is the only client component on the page.
 */
export function TourRow({
  tour,
  whatsapp,
  pickups,
  ratesUpdated,
  deferMedia,
}: {
  tour: TourWithFares;
  whatsapp: string;
  pickups: string[];
  ratesUpdated: string;
  /** Rows after the first on a list page — see PhotoStrip `defer`. */
  deferMedia?: boolean;
}) {
  return (
    <div className="room-row reveal is-in" id={tour.slug}>
      <RowMedia photos={tour.photos} alt={tour.name} defer={deferMedia} />
      <div>
        <p className="eyebrow">{tour.tagline}</p>
        <h2>{tour.name}</h2>
        <div className="room__meta" style={{ margin: "18px 0 22px" }}>
          {tour.travelNote ? (
            <span>
              <ClockIcon />
              {tour.travelNote}
            </span>
          ) : null}
          {tour.season ? (
            <span>
              <LeafIcon />
              {tour.season}
            </span>
          ) : null}
          {tour.difficulty ? (
            <span>
              <JeepIcon />
              {tour.difficulty}
            </span>
          ) : null}
        </div>
        <p>{tour.longDesc}</p>
        <ul className="amenity-list">
          {tour.highlights.map((highlight) => (
            <li key={highlight}>
              <CheckIcon />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
        <FareListDetail tour={tour} ratesUpdated={ratesUpdated} />
        <PickupSelect
          tourSlug={tour.slug}
          tourName={tour.name}
          points={pickups}
          whatsapp={whatsapp}
        />
      </div>
    </div>
  );
}
