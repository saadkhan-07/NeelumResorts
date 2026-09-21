import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, touristTripSchema } from "@/lib/schema";
import { pageMetadata, withReason } from "@/lib/seo";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/PageHead";
import { TourRow } from "@/components/rows";
import { CtaBand } from "@/components/sections";
import { CTA_BANDS, DETAIL_DESCRIPTIONS, DETAIL_LEDES } from "@/lib/copy";
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
  return pageMetadata({
    path: `/tours/${tour.slug}`,
    // The layout's title template appends the brand.
    title: `${tour.name} Jeep Tour`,
    description: withReason(
      DETAIL_DESCRIPTIONS[tour.slug] ?? tour.shortDesc,
      tour.fares.length > 0
        ? `See the fares from ${tour.fares.map((f) => f.pickupName).join(" and ")}, then book on WhatsApp.`
        : "Tell us where you are and we'll quote it on WhatsApp.",
    ),
  });
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
        title={`${tour.name} jeep tour`}
        lede={DETAIL_LEDES[tour.slug] ?? tour.shortDesc}
      />

      <JsonLd
        data={touristTripSchema(tour, settings, DETAIL_LEDES[tour.slug] ?? tour.shortDesc)}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Jeep Tours", path: "/tours" },
          { name: `${tour.name} jeep tour`, path: `/tours/${tour.slug}` },
        ])}
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
