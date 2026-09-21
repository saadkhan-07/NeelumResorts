import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { RoomRow } from "@/components/rows";
import { CtaBand } from "@/components/sections";
import { CTA_BANDS, PAGE_HEADS } from "@/lib/copy";
import { getMedia, getRoom, getRooms, getSettings, getPageHeader } from "@/lib/queries";
import { waRoom } from "@/lib/wa";

export const revalidate = 3600;

/**
 * The reference has no per-room page — `rooms.html` stacks every room as a
 * `.room-row` with an id anchor. PROMPT.md § 8 asks for `/stays/[slug]`, so this
 * renders that same row on its own page rather than inventing a second layout.
 */
export async function generateStaticParams() {
  const rooms = await getRooms();
  return rooms.map((room) => ({ slug: room.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = await getRoom(slug);
  if (!room) return {};
  return {
    title: `${room.name} — Neelum Resort Taobat`,
    description: room.shortDesc,
  };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [room, settings, header, cta] = await Promise.all([
    getRoom(slug),
    getSettings(),
    getPageHeader("stays"),
    getMedia("CTA"),
  ]);

  if (!room) notFound();

  return (
    <>
      <PageHead
        media={header}
        crumb={room.name}
        title={room.name}
        lede={room.shortDesc}
      />

      <section className="section">
        <div className="wrap">
          <RoomRow room={room} whatsapp={settings.whatsapp} />
        </div>
      </section>

      <CtaBand
        title={CTA_BANDS.stays.title}
        body={CTA_BANDS.stays.body}
        whatsapp={settings.whatsapp}
        message={waRoom(room.name)}
        media={cta[0]}
      />
    </>
  );
}
