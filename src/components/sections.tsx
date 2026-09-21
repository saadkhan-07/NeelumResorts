import { CldImage } from "./CldImage";
import { DeferredImage } from "./DeferredImage";
import { ICONS, WhatsAppIcon, type IconName } from "./icons";
import { RATING, STATS, type FaqItem } from "@/lib/copy";
import type { MediaRow, ReviewRow } from "@/lib/queries";
import { telLink, waLink } from "@/lib/wa";

/** The dark band that closes every page. */
export function CtaBand({
  eyebrow,
  title,
  body,
  whatsapp,
  message,
  cta = "Check availability",
  media,
  phone,
  phoneDisplay,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  whatsapp: string;
  message: string;
  cta?: string;
  phone?: string;
  phoneDisplay?: string;
  secondary?: React.ReactNode;
  /** Unseeded leaves the band on its solid `--ink`, which the stylesheet gives it. */
  media?: MediaRow;
}) {
  return (
    <section className="cta-band">
      {/* Always at the foot of the page, so never needed for the first paint. */}
      {media ? <DeferredImage media={media} sizes="100vw" /> : null}
      <div className="wrap">
        {eyebrow ? (
          <p
            className="eyebrow eyebrow--center"
            style={{ justifyContent: "center", color: "var(--brass-lt)" }}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2>{title}</h2>
        <p>{body}</p>
        <div className="btns">
          <a
            className="btn btn--primary"
            href={waLink(whatsapp, message)}
            target="_blank"
            rel="noopener"
          >
            <WhatsAppIcon />
            {cta}
          </a>
          {phone && phoneDisplay ? (
            <a className="btn btn--light" href={telLink(phone)}>
              Call {phoneDisplay}
            </a>
          ) : null}
          {secondary}
        </div>
      </div>
    </section>
  );
}

/** The `.features` grid — homepage experiences and the /stays "in every room" band. */
export function FeatureGrid({
  items,
}: {
  items: readonly { icon: string; title: string; body: string }[];
}) {
  return (
    <div className="features">
      {items.map((item) => {
        const Icon = ICONS[item.icon as IconName];
        return (
          <div className="feature reveal is-in" key={item.title}>
            {Icon ? <Icon /> : null}
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        );
      })}
    </div>
  );
}

/** Native `<details>`, as specified — no accordion library, no JavaScript. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="faq">
      {items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Stats() {
  return (
    <div className="stats reveal is-in">
      {STATS.map((stat) => (
        <div key={stat.label}>
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Guest reviews, from the database.
 *
 * These replaced three invented testimonials that arrived in the designer's
 * mock and went live as if real people had written them. Every card now carries
 * the reviewer's own name and says where the review came from.
 */
export function Quotes({ reviews }: { reviews: ReviewRow[] }) {
  if (reviews.length === 0) return null;

  return (
    <div className="quotes">
      {reviews.map((review) => (
        <figure className="quote reveal is-in" style={{ margin: 0 }} key={review.id}>
          <span className="stars">{"★".repeat(review.rating)}</span>
          <p>&ldquo;{review.body}&rdquo;</p>
          <cite>
            {review.author}
            {review.whenText ? ` · ${review.whenText}` : ""}
            {review.source ? ` · ${review.source}` : ""}
          </cite>
        </figure>
      ))}
    </div>
  );
}

export function RatingBox({
  mapsUrl,
  score,
  count,
}: {
  mapsUrl: string;
  score: string;
  count: string;
}) {
  return (
    <div className="rating-box reveal is-in">
      <b>{score}</b>
      <div>
        <span className="stars">★★★★★</span>
        <small>{count} reviews on Google · Resort hotel, Taobat</small>
      </div>
      <a
        className="btn btn--ghost btn--sm"
        style={{ marginLeft: "auto" }}
        href={mapsUrl}
        target="_blank"
        rel="noopener"
      >
        {RATING.readOn}
      </a>
    </div>
  );
}
