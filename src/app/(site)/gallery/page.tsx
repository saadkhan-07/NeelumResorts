import { pageMetadata } from "@/lib/seo";
import { Gallery } from "@/components/Gallery";
import { PageHead } from "@/components/PageHead";
import { CtaBand } from "@/components/sections";
import { CTA_BANDS, PAGE_HEADS } from "@/lib/copy";
import { getMedia, getSettings, getPageHeader } from "@/lib/queries";
import { waAvailability } from "@/lib/wa";

export const revalidate = 3600;

export function generateMetadata() {
  return pageMetadata({
    title: "Photos of Taobat, Neelum Valley",
    description:
      "Photos of Neelum Resort Taobat and the valley around it: cedar rooms, the Neelum River, jeep tracks and snow. See the place before you book.",
    path: "/gallery",
  });
}

export default async function GalleryPage() {
  const [settings, images, header, cta] = await Promise.all([
    getSettings(),
    getMedia("GALLERY"),
    getPageHeader("gallery"),
    getMedia("CTA"),
  ]);

  return (
    <>
      <PageHead media={header} {...PAGE_HEADS.gallery} />

      {/* With no media the whole section goes, rather than an empty grid. */}
      {images.length > 0 ? (
        <section className="section">
          <div className="wrap">
            <Gallery images={images} />
          </div>
        </section>
      ) : null}

      <CtaBand
        title={CTA_BANDS.gallery.title}
        body={CTA_BANDS.gallery.body}
        whatsapp={settings.whatsapp}
        message={waAvailability}
        media={cta[0]}
      />
    </>
  );
}
