import { PageHead } from "@/components/PageHead";
import { CldImage } from "@/components/CldImage";
import { Steps } from "@/components/Steps";
import { TourRow } from "@/components/rows";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { CtaBand } from "@/components/sections";
import { CTA_BANDS, JEEP_FLEET, PAGE_HEADS } from "@/lib/copy";
import { getMedia, getSettings, getTours, pickupPoints, getPageHeader } from "@/lib/queries";
import { waLink } from "@/lib/wa";

export const revalidate = 3600;

export const metadata = {
  title: "Jeep Tours — Neelum Resort Taobat",
  description:
    "Guided 4x4 jeep tours across Neelum Valley — Taobat Valley, Arang Kel, Ratti Gali and Baboon Valley. Published fares for our regular routes, a same-day quote from anywhere else.",
};

export default async function ToursPage() {
  const [tours, settings, header, cta] = await Promise.all([
    getTours(),
    getSettings(),
    getPageHeader("tours"),
    getMedia("CTA"),
  ]);
  const pickups = pickupPoints(settings);

  // Every tour lists the same jeep inclusions, so the "Our jeeps" strip reads them
  // off the first tour rather than repeating the list in the page.
  const includes = tours[0]?.includes ?? [];

  // The "our jeeps" strip wants a photograph of a jeep. None was delivered under
  // that name, so it borrows a tour photo — which is a jeep — rather than
  // showing an empty frame.
  const fleetPhoto = tours.find((t) => t.photos[0])?.photos[0];

  return (
    <>
      <PageHead media={header} {...PAGE_HEADS.tours} />

      <section className="section">
        <div className="wrap">
          <Steps />
          {tours.map((tour) => (
            <TourRow
              key={tour.id}
              tour={tour}
              whatsapp={settings.whatsapp}
              pickups={pickups}
              ratesUpdated={settings.ratesUpdated}
            />
          ))}
        </div>
      </section>

      {includes.length > 0 ? (
        <section className="section bg-sand">
          <div className="wrap">
            <div className="split">
              {fleetPhoto ? (
                <div className="split__media reveal is-in">
                  <CldImage
                    media={fleetPhoto}
                    intrinsic
                    sizes="(max-width: 900px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              <div className="reveal is-in">
                <p className="eyebrow">{JEEP_FLEET.eyebrow}</p>
                <h2>{JEEP_FLEET.title}</h2>
                <p className="lede">{JEEP_FLEET.lede}</p>
                <ul className="amenity-list">
                  {includes.map((item) => (
                    <li key={item}>
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className="link-more"
                  href={waLink(settings.whatsapp, JEEP_FLEET.wa)}
                  target="_blank"
                  rel="noopener"
                >
                  {JEEP_FLEET.link} <ArrowIcon />
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : null}

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
