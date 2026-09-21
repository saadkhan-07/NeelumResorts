import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { PageHead } from "@/components/PageHead";
import { CldImage } from "@/components/CldImage";
import { LazyMap } from "@/components/LazyMap";
import { ClockIcon, JeepIcon, PhoneIcon, PinIcon, StarIcon, WhatsAppIcon } from "@/components/icons";
import { CtaBand } from "@/components/sections";
import { CONTACT_FACTS, CTA_BANDS, PAGE_HEADS } from "@/lib/copy";
import { getMedia, getSettings, getPageHeader } from "@/lib/queries";
import { telLink, waGeneral, waLink } from "@/lib/wa";

export const revalidate = 3600;

export function generateMetadata() {
  return pageMetadata({
    title: "Contact & Directions to Taobat",
    description:
      "Call or WhatsApp Neelum Resort Taobat and find the way to the last village in Neelum Valley. We answer 8 am to 11 pm, usually within the hour.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const [settings, header, cta] = await Promise.all([
    getSettings(),
    getPageHeader("contact"),
    getMedia("CTA"),
  ]);
  const address = settings.address.split("\n");

  return (
    <>
      <PageHead media={header} {...PAGE_HEADS.contact} />

      <section className="section">
        <div className="wrap">
          <div className="split" style={{ alignItems: "start" }}>
            <div className="reveal is-in">
              <p className="eyebrow">{CONTACT_FACTS.formEyebrow}</p>
              <h2>{CONTACT_FACTS.formTitle}</h2>
              <p style={{ marginBottom: "30px" }}>{CONTACT_FACTS.formIntro}</p>
              <ContactForm whatsapp={settings.whatsapp} />
            </div>

            <div className="reveal is-in">
              <p className="eyebrow">{CONTACT_FACTS.listEyebrow}</p>
              <h2>{CONTACT_FACTS.listTitle}</h2>
              <ul className="info-list" style={{ marginTop: "26px" }}>
                <li>
                  <WhatsAppIcon />
                  <div>
                    <b>WhatsApp</b>
                    <span>
                      <a
                        href={waLink(settings.whatsapp, waGeneral)}
                        target="_blank"
                        rel="noopener"
                      >
                        {settings.phoneDisplay}
                      </a>
                    </span>
                  </div>
                </li>
                <li>
                  <PhoneIcon />
                  <div>
                    <b>Phone</b>
                    <span>
                      <a href={telLink(settings.phone)}>{settings.phoneDisplay}</a>
                    </span>
                  </div>
                </li>
                <li>
                  <StarIcon />
                  <div>
                    <b>Google reviews</b>
                    <span>
                      {/* Plain HTML, no rating schema — Phase 7. */}
                      <a href={settings.googleMapsUrl} target="_blank" rel="noopener">
                        {settings.ratingScore} on Google · {settings.ratingCount} reviews
                      </a>
                    </span>
                  </div>
                </li>
                <li>
                  <PinIcon />
                  <div>
                    <b>Address</b>
                    <span>
                      {address[0]}
                      <br />
                      {CONTACT_FACTS.plusCode}
                    </span>
                  </div>
                </li>
                <li>
                  <ClockIcon />
                  <div>
                    <b>Reception hours</b>
                    <span>{CONTACT_FACTS.hours}</span>
                  </div>
                </li>
                <li>
                  <JeepIcon />
                  <div>
                    <b>The drive</b>
                    <span>{CONTACT_FACTS.drive}</span>
                  </div>
                </li>
              </ul>

              <div
                className="map-card reveal is-in"
                style={{ marginTop: "34px", minHeight: "320px" }}
              >
                <div className="map-fallback">
                  {header ? (
                    <CldImage media={header} sizes="(max-width: 900px) 100vw, 50vw" />
                  ) : null}
                  <div className="pin">
                    <PinIcon />
                  </div>
                  <b>Neelum Resort Taobat</b>
                  <span>{CONTACT_FACTS.geo}</span>
                </div>
                <LazyMap
                  title="Neelum Resort Taobat on Google Maps"
                  minHeight="320px"
                  src={CONTACT_FACTS.mapEmbed}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title={CTA_BANDS.contact.title}
        body={CTA_BANDS.contact.body}
        whatsapp={settings.whatsapp}
        message={CTA_BANDS.contact.wa}
        cta={CTA_BANDS.contact.cta}
        media={cta[0]}
      />
    </>
  );
}
