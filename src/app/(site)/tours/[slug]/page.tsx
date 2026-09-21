import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { TourRow } from "@/components/rows";
import { CtaBand } from "@/components/sections";
import { CTA_BANDS, PAGE_HEADS } from "@/lib/copy";
import { getMedia, getSettings, getTour, getTours, pickupPoints, getPageHeader } from "@/lib/queries";

export const revalidate = 3600;

/**
 * As with rooms, the reference keeps every tour on one page with id anchors.
 * This renders the same `.room-row` for a single tour so `/tours/[slug]` from
 * PROMPT.md § 5c exists without a layout the designer never drew.
 */
export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return {};
  return {
    title: `${tour.name} jeep tour — Neelum Resort Taobat`,
    description: tour.shortDesc,
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [tour, settings, header, cta] = await Promise.all([
    getTour(slug),
    getSettings(),
    getPageHeader("tours"),
    getMedia("CTA"),
  ]);

  if (!tour) notFound();

  return (
    <>
      <PageHead
        media={header}
        crumb={tour.name}
        title={tour.name}
        lede={tour.shortDesc}
      />

      <section className="section">
        <div className="wrap">
          <TourRow
            tour={tour}
            whatsapp={settings.whatsapp}
            pickups={pickupPoints(settings)}
            ratesUpdated={settings.ratesUpdated}
          />
        </div>
      </section>

      <CtaBand
        title={CTA_BANDS.tours.title}
        body={CTA_BANDS.tours.body}
        whatsapp={settings.whatsapp}
        message={CTA_BANDS.tours.wa}
        cta={CTA_BANDS.tours.cta}
        media={cta[0]}
        phone={settings.phone}
        phoneDisplay={settings.phoneDisplay}
      />
    </>
  );
}
