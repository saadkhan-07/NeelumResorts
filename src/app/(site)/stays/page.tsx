import { PageHead } from "@/components/PageHead";
import { RoomRow } from "@/components/rows";
import { CtaBand, FeatureGrid } from "@/components/sections";
import { CTA_BANDS, PAGE_HEADS, ROOM_INCLUDES } from "@/lib/copy";
import { getMedia, getRooms, getSettings } from "@/lib/queries";
import { waAvailability } from "@/lib/wa";
import Link from "next/link";

export const revalidate = 3600;

export const metadata = {
  title: "Our Stays — Neelum Resort Taobat",
  description:
    "Four timber rooms on the riverbank in Taobat, Neelum Valley — deluxe rooms, a valley suite, a family hut and a riverside cottage.",
};

export default async function StaysPage() {
  const [rooms, settings, headers, cta] = await Promise.all([
    getRooms(),
    getSettings(),
    getMedia("PAGE_HEADER"),
    getMedia("CTA"),
  ]);

  return (
    <>
      <PageHead media={headers[0]} {...PAGE_HEADS.stays} />

      <section className="section">
        <div className="wrap">
          {rooms.map((room) => (
            <RoomRow key={room.id} room={room} whatsapp={settings.whatsapp} />
          ))}
        </div>
      </section>

      <section className="section bg-sand">
        <div className="wrap">
          <div className="head head--center">
            <p className="eyebrow eyebrow--center">{ROOM_INCLUDES.eyebrow}</p>
            <h2>{ROOM_INCLUDES.title}</h2>
          </div>
          <FeatureGrid items={ROOM_INCLUDES.items} />
        </div>
      </section>

      <CtaBand
        title={CTA_BANDS.stays.title}
        body={CTA_BANDS.stays.body}
        whatsapp={settings.whatsapp}
        message={waAvailability}
        media={cta[0]}
        secondary={
          <Link className="btn btn--light" href="/contact">
            Contact &amp; directions
          </Link>
        }
      />
    </>
  );
}
