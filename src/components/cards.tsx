import Link from "next/link";
import { CldImage, MediaPlaceholder } from "./CldImage";
import { FareListCard } from "./FareList";
import { PriceTag } from "./PriceTag";
import { BedIcon, ClockIcon, GuestsIcon, LeafIcon, MountainIcon } from "./icons";
import type { RoomWithPhotos, TourWithFares } from "@/lib/queries";
import { EnquiryLink } from "./EnquiryLink";
import { waRoom, waTour } from "@/lib/wa";

const CARD_SIZES = "(max-width: 900px) 100vw, 33vw";

/**
 * `.room__media` has `aspect-ratio: 4/3` in the stylesheet, so the box keeps its
 * height whether or not a photograph exists — an unseeded room shows the neutral
 * sand block rather than collapsing the card or breaking an image.
 */
function CardMedia({
  photo,
  alt,
  tag,
}: {
  photo?: RoomWithPhotos["photos"][number];
  alt: string;
  tag: string;
}) {
  return (
    <div className="room__media">
      {photo ? (
        <CldImage media={photo} sizes={CARD_SIZES} />
      ) : (
        <MediaPlaceholder label={`${alt} — photograph to come`} />
      )}
      <span className="room__tag">{tag}</span>
    </div>
  );
}

export function RoomCard({ room, whatsapp }: { room: RoomWithPhotos; whatsapp: string }) {
  return (
    <article className="room reveal is-in">
      <CardMedia photo={room.photos[0]} alt={room.name} tag={room.tagline} />
      <div className="room__body">
        <h3>
          <Link href={`/stays/${room.slug}`}>{room.name}</Link>
        </h3>
        <div className="room__meta">
          <span>
            <GuestsIcon />
            {room.guests}
          </span>
          <span>
            <BedIcon />
            {room.beds}
          </span>
          <span>
            <MountainIcon />
            {room.view}
          </span>
        </div>
        <p className="room__desc">{room.shortDesc}</p>
        <div className="room__foot">
          <PriceTag room={room} />
          <EnquiryLink
            className="btn btn--dark btn--sm"
            whatsapp={whatsapp}
            message={waRoom(room.name)}
            enquiry={{ kind: "STAY", source: "room-card", roomSlug: room.slug }}
          >
            Enquire
          </EnquiryLink>
        </div>
      </div>
    </article>
  );
}

export function TourCard({ tour, whatsapp }: { tour: TourWithFares; whatsapp: string }) {
  return (
    <article className="room reveal is-in">
      <CardMedia photo={tour.photos[0]} alt={tour.name} tag={tour.tagline} />
      <div className="room__body">
        <h3>
          <Link href={`/tours/${tour.slug}`}>{tour.name}</Link>
        </h3>
        <div className="room__meta">
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
        </div>
        <p className="room__desc">{tour.shortDesc}</p>
        <div className="room__foot room__foot--stack">
          <FareListCard tour={tour} />
          <EnquiryLink
            className="btn btn--dark btn--sm"
            whatsapp={whatsapp}
            message={waTour(tour.name)}
            enquiry={{ kind: "TOUR", source: "tour-card", tourSlug: tour.slug }}
          >
            Enquire on WhatsApp
          </EnquiryLink>
        </div>
      </div>
    </article>
  );
}
