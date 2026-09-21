import { Gallery } from "@/components/Gallery";
import { PageHead } from "@/components/PageHead";
import { CtaBand } from "@/components/sections";
import { CTA_BANDS, PAGE_HEADS } from "@/lib/copy";
import { getMedia, getSettings, getPageHeader } from "@/lib/queries";
import { waAvailability } from "@/lib/wa";

export const revalidate = 3600;

export const metadata = {
  title: "Gallery — Neelum Resort Taobat",
  description: "Photographs of Neelum Resort Taobat and the valley around it.",
};

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
