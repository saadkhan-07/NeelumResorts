import Link from "next/link";
import { BookBar } from "@/components/BookBar";
import { Gallery } from "@/components/Gallery";
import { HeroSlider } from "@/components/HeroSlider";
import { CldImage } from "@/components/CldImage";
import { Steps } from "@/components/Steps";
import { RoomCard, TourCard } from "@/components/cards";
import {
  ArrowIcon,
  ClockIcon,
  DirectionsIcon,
  JeepIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "@/components/icons";
import {
  CtaBand,
  Faq,
  FeatureGrid,
  Quotes,
  RatingBox,
  Stats,
} from "@/components/sections";
import {
  CTA_BANDS,
  EXPERIENCES,
  LOCATION_FACTS,
  RATING,
  SECTIONS,
} from "@/lib/copy";
import { getMedia, getPageHeader, getReviews, getRooms, getSettings, getTours } from "@/lib/queries";
import { telLink, waAvailability, waLink } from "@/lib/wa";

export const revalidate = 3600;

export default async function Home() {
  const [rooms, tours, settings, reviews, hero, gallery, story, dining, cta, mapImage] =
    await Promise.all([
      getRooms(),
      getTours(),
      getSettings(),
      getReviews(),
      getMedia("HERO"),
      getMedia("GALLERY"),
      getMedia("STORY"),
      getMedia("DINING"),
      getMedia("CTA"),
      getPageHeader("contact"),
    ]);

  const { whatsapp, phone, phoneDisplay, googleMapsUrl } = settings;
  const headline = settings.heroHeadline.split(/\*(.+?)\*/);

  return (
    <>
      {/* ============ HERO ============ */}
      {/* With no slide seeded the hero keeps its height and sits on solid --pine,
          so the headline still reads. */}
      <section
        className="hero"
        style={hero.length === 0 ? { background: "var(--pine)" } : undefined}
      >
        <HeroSlider slides={hero} />
        <div className="hero__inner">
          <div className="wrap">
            <span className="hero__rating">
              <span className="stars">★★★★★</span>
              <b>{settings.ratingScore}</b> · {settings.ratingCount} Google reviews
            </span>
            <h1>
              {/* `heroHeadline` marks its emphasised word with *asterisks* so the
                  owner never has to type markup and we never render theirs as HTML. */}
              {headline.map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part))}
            </h1>
            <p className="hero__sub">{settings.heroSub}</p>
            <div className="hero__btns">
              <a
                className="btn btn--primary"
                href={waLink(whatsapp, waAvailability)}
                target="_blank"
                rel="noopener"
              >
                <WhatsAppIcon />
                Check availability
              </a>
              <Link className="btn btn--light" href="/stays">
                View our stays
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BOOKING BAR ============ */}
      <BookBar whatsapp={whatsapp} roomNames={rooms.map((room) => room.name)} />

      {/* ============ STORY ============ */}
      <section className="section">
        <div className="wrap">
          <div className="split" style={story.length === 0 ? { gridTemplateColumns: "1fr" } : undefined}>
            {/* No story photograph was delivered. Rather than an empty frame the
                media column is dropped and the copy runs full width. The 4.9
                badge goes with it — the stats band immediately below already
                carries the rating, so nothing is lost. */}
            {story[0] ? (
              <div className="split__media reveal is-in">
                <CldImage
                  media={story[0]}
                  intrinsic
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
                <div className="split__badge">
                  <b>{settings.ratingScore}</b>
                  <span>{settings.ratingCount} reviews</span>
                </div>
              </div>
            ) : null}
            <div className="reveal is-in">
              <p className="eyebrow">{SECTIONS.story.eyebrow}</p>
              <h2>{SECTIONS.story.title}</h2>
              <p className="lede">{SECTIONS.story.lede}</p>
              {SECTIONS.story.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
              <Link className="link-more" href="/stays">
                {SECTIONS.story.link} <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="section--tight bg-pine">
        <div className="wrap">
          <Stats />
        </div>
      </section>

      {/* ============ ROOMS ============ */}
      <section className="section" id="stays">
        <div className="wrap">
          <div className="head head--center">
            <p className="eyebrow eyebrow--center">{SECTIONS.stays.eyebrow}</p>
            <h2>{SECTIONS.stays.title}</h2>
            <p className="lede">{SECTIONS.stays.lede}</p>
          </div>
          <div className="rooms">
            {rooms.slice(0, 3).map((room) => (
              <RoomCard key={room.id} room={room} whatsapp={whatsapp} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link className="btn btn--ghost" href="/stays">
              {SECTIONS.stays.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCES ============ */}
      <section className="section bg-sand" id="experiences">
        <div className="wrap">
          <div className="head">
            <p className="eyebrow">{SECTIONS.experiences.eyebrow}</p>
            <h2>{SECTIONS.experiences.title}</h2>
          </div>
          <FeatureGrid items={EXPERIENCES} />
        </div>
      </section>

      {/* ============ JEEP TOURS ============ */}
      <section className="section" id="tours">
        <div className="wrap">
          <div className="head head--center">
            <p className="eyebrow eyebrow--center">{SECTIONS.tours.eyebrow}</p>
            <h2>{SECTIONS.tours.title}</h2>
            <p className="lede">{SECTIONS.tours.lede}</p>
          </div>
          <Steps />
          <div className="rooms">
            {tours.slice(0, 3).map((tour) => (
              <TourCard key={tour.id} tour={tour} whatsapp={whatsapp} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <Link className="btn btn--ghost" href="/tours">
              {SECTIONS.tours.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ DINING ============ */}
      <section className="section">
        <div className="wrap">
          <div className="split" style={dining.length === 0 ? { gridTemplateColumns: "1fr" } : undefined}>
            <div className="reveal is-in">
              <p className="eyebrow">{SECTIONS.dining.eyebrow}</p>
              <h2>{SECTIONS.dining.title}</h2>
              <p className="lede">{SECTIONS.dining.lede}</p>
              {SECTIONS.dining.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
              <a
                className="link-more"
                href={waLink(whatsapp, SECTIONS.dining.wa)}
                target="_blank"
                rel="noopener"
              >
                {SECTIONS.dining.link} <ArrowIcon />
              </a>
            </div>
            {dining[0] ? (
              <div className="split__media reveal is-in">
                <CldImage
                  media={dining[0]}
                  intrinsic
                  sizes="(max-width: 900px) 100vw, 50vw"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      {/* No media, no section — an empty grid is worse than no grid. */}
      {gallery.length > 0 ? (
      <section className="section" id="gallery">
        <div className="wrap">
          <div className="head head--center">
            <p className="eyebrow eyebrow--center">{SECTIONS.gallery.eyebrow}</p>
            <h2>{SECTIONS.gallery.title}</h2>
          </div>
          <Gallery images={gallery.slice(0, 8)} />
          <div style={{ textAlign: "center", marginTop: "44px" }}>
            <Link className="btn btn--ghost" href="/gallery">
              {SECTIONS.gallery.cta}
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {/* ============ REVIEWS ============ */}
      <section className="section bg-sand">
        <div className="wrap">
          <div className="head head--center">
            <p className="eyebrow eyebrow--center">{SECTIONS.reviews.eyebrow}</p>
            <h2>
              {SECTIONS.reviews.title
                .replace("{score}", settings.ratingScore)
                .replace("{count}", settings.ratingCount)}
            </h2>
          </div>
          <Quotes reviews={reviews} />
          <div style={{ maxWidth: "560px", margin: "44px auto 0" }}>
            <RatingBox
              mapsUrl={googleMapsUrl}
              score={settings.ratingScore}
              count={settings.ratingCount}
            />
          </div>
        </div>
      </section>

      {/* ============ LOCATION ============ */}
      <section className="section" id="location">
        <div className="wrap">
          <div className="split">
            <div className="reveal is-in">
              <p className="eyebrow">{SECTIONS.location.eyebrow}</p>
              <h2>{SECTIONS.location.title}</h2>
              <p className="lede">{SECTIONS.location.lede}</p>
              <ul className="info-list">
                <li>
                  <PinIcon />
                  <div>
                    <b>{LOCATION_FACTS[0].label}</b>
                    <span>
                      {settings.address.split("\n").map((line, i) => (
                        <span key={line}>
                          {line}
                          {i === 0 ? <br /> : null}
                        </span>
                      ))}
                      {" · "}
                      {LOCATION_FACTS[0].plusCode}
                    </span>
                  </div>
                </li>
                <li>
                  <JeepIcon />
                  <div>
                    <b>{LOCATION_FACTS[1].label}</b>
                    <span>{LOCATION_FACTS[1].body}</span>
                  </div>
                </li>
                <li>
                  <ClockIcon />
                  <div>
                    <b>{LOCATION_FACTS[2].label}</b>
                    <span>{LOCATION_FACTS[2].body}</span>
                  </div>
                </li>
                <li>
                  <PhoneIcon />
                  <div>
                    <b>Call or message</b>
                    <span>
                      <a href={telLink(phone)}>{phoneDisplay}</a>
                    </span>
                  </div>
                </li>
              </ul>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "28px" }}>
                <a className="btn btn--dark" href={googleMapsUrl} target="_blank" rel="noopener">
                  <DirectionsIcon />
                  Get directions
                </a>
                <a
                  className="btn btn--wa"
                  href={waLink(
                    whatsapp,
                    "Assalam o Alaikum! Could you share directions to Neelum Resort Taobat?",
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  <WhatsAppIcon />
                  Ask for directions
                </a>
              </div>
            </div>
            <div className="map-card reveal is-in">
              <div className="map-fallback">
                {mapImage ? (
                  <CldImage media={mapImage} sizes="(max-width: 900px) 100vw, 50vw" />
                ) : null}
                <div className="pin">
                  <PinIcon />
                </div>
                <b>Neelum Resort Taobat</b>
                <span>34.7247°N, 74.7096°E · PPF5+VR</span>
              </div>
              <iframe
                title="Neelum Resort Taobat on Google Maps"
                loading="lazy"
                allowFullScreen
                src="https://maps.google.com/maps?q=34.7247131,74.7096112&z=13&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section bg-sand" id="faq">
        <div className="wrap">
          <div className="head head--center">
            <p className="eyebrow eyebrow--center">{SECTIONS.faq.eyebrow}</p>
            <h2>{SECTIONS.faq.title}</h2>
          </div>
          <Faq />
        </div>
      </section>

      {/* ============ CTA ============ */}
      <CtaBand
        eyebrow={CTA_BANDS.home.eyebrow}
        title={CTA_BANDS.home.title}
        body={CTA_BANDS.home.body}
        whatsapp={whatsapp}
        message="Assalam o Alaikum! I'd like to check availability at Neelum Resort Taobat for the following dates:"
        phone={phone}
        phoneDisplay={phoneDisplay}
        media={cta[0]}
      />
    </>
  );
}
