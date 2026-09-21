import { pageMetadata } from "@/lib/seo";
import { PageHead } from "@/components/PageHead";
import { RoomRow } from "@/components/rows";
import { CtaBand, FeatureGrid } from "@/components/sections";
import { CTA_BANDS, PAGE_HEADS, ROOM_INCLUDES } from "@/lib/copy";
import { getMedia, getRooms, getSettings, getPageHeader } from "@/lib/queries";
import { waAvailability } from "@/lib/wa";
import Link from "next/link";

export const revalidate = 3600;

export function generateMetadata() {
  return pageMetadata({
    title: "Hotel Rooms in Taobat, Neelum Valley",
    description:
      "Four heated cedar rooms on the Neelum riverbank in Taobat, each with an attached bathroom and hot water. See every room and check your dates.",
    path: "/stays",
  });
}

export default async function StaysPage() {
  const [rooms, settings, header, cta] = await Promise.all([
    getRooms(),
    getSettings(),
    getPageHeader("stays"),
    getMedia("CTA"),
  ]);

  return (
    <>
      <PageHead media={header} {...PAGE_HEADS.stays} />

      <section className="section">
        <div className="wrap">
          {rooms.map((room, i) => (
            <RoomRow key={room.id} room={room} whatsapp={settings.whatsapp} deferMedia={i > 0} />
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
