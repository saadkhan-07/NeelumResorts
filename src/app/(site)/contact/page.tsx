import { ContactForm } from "@/components/ContactForm";
import { PageHead } from "@/components/PageHead";
import { CldImage } from "@/components/CldImage";
import { ClockIcon, JeepIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";
import { CtaBand } from "@/components/sections";
import { CONTACT_FACTS, CTA_BANDS, PAGE_HEADS } from "@/lib/copy";
import { getMedia, getSettings } from "@/lib/queries";
import { telLink, waGeneral, waLink } from "@/lib/wa";

export const revalidate = 3600;

export const metadata = {
  title: "Contact & Directions — Neelum Resort Taobat",
  description:
    "Call or WhatsApp to book Neelum Resort Taobat. Directions, season dates and how to reach the last village in Neelum Valley.",
};

export default async function ContactPage() {
  const [settings, headers, cta] = await Promise.all([
    getSettings(),
    getMedia("PAGE_HEADER"),
    getMedia("CTA"),
  ]);
  const address = settings.address.split("\n");

  return (
    <>
      <PageHead media={headers[3]} {...PAGE_HEADS.contact} />

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
                  {headers[3] ? (
                    <CldImage media={headers[3]} sizes="(max-width: 900px) 100vw, 50vw" />
                  ) : null}
                  <div className="pin">
                    <PinIcon />
                  </div>
                  <b>Neelum Resort Taobat</b>
                  <span>{CONTACT_FACTS.geo}</span>
                </div>
                <iframe
                  title="Neelum Resort Taobat on Google Maps"
                  loading="lazy"
                  allowFullScreen
                  style={{ minHeight: "320px" }}
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
