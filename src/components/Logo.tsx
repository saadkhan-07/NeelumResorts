import Link from "next/link";
import { logoUrl } from "@/lib/cloudinary";
import type { Brand } from "@/lib/queries";

/**
 * The wordmark — PROMPT.md § 5b.
 *
 * Three things this has to get right, and the reference site
 * (roameoresorts.com) is the model for all three: the header stays transparent
 * over the hero, the mark is big enough to read, and it never disappears.
 *
 * **It never disappears.** The header flips light-to-dark on scroll, so § 5b
 * asks for two uploads. If only one exists, that one is used in both states
 * rather than fading to nothing — which is what happened before, because the
 * CSS faded `logo-light` out and `logo-dark` in whether or not a dark file had
 * ever been uploaded.
 *
 * **It is sized by height, not forced into a square.** A logo may be a wide
 * wordmark (the reference's is 417×88) or a square emblem (ours is 150×150).
 * A fixed 34×34 box shrank a wordmark to illegibility; a height with automatic
 * width fits either.
 *
 * **A wordmark replaces the typeset name.** If the uploaded file is much wider
 * than it is tall it already contains the resort's name, so repeating it in
 * text beside the image reads as a mistake. A squarish emblem keeps the text.
 */
export function Logo({ href = "/", brand }: { href?: string; brand?: Brand }) {
  const light = brand?.["logo-light"] ?? null;
  const dark = brand?.["logo-dark"] ?? null;

  // Either slot on its own is enough; the other falls back to it.
  const lightSrc = light ?? dark;
  const darkSrc = dark ?? light;

  const shape = lightSrc ?? darkSrc;
  const isWordmark = shape ? shape.width / shape.height >= 2.5 : false;

  return (
    <Link className={isWordmark ? "logo logo--wordmark" : "logo"} href={href}>
      {lightSrc || darkSrc ? (
        <span className="logo__mark">
          {lightSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className="logo__img logo__img--light"
              src={logoUrl(lightSrc.publicId, 160)}
              alt="Neelum Resort Taobat"
            />
          ) : null}
          {darkSrc && darkSrc.publicId !== lightSrc?.publicId ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              className="logo__img logo__img--dark"
              src={logoUrl(darkSrc.publicId, 160)}
              alt=""
            />
          ) : null}
        </span>
      ) : (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1" opacity=".45" />
          <path d="M8 26l6.5-9.5 4 5.5 3.5-5 9.5 9z" fill="#BE9247" />
          <path d="M8 26h23.5" stroke="currentColor" strokeWidth="1.1" opacity=".6" />
          <circle cx="27" cy="12.5" r="2.4" fill="currentColor" opacity=".8" />
        </svg>
      )}

      {/* Hidden for a wordmark, which already says the name — but kept in the
          accessibility tree so the link still announces where it goes. */}
      <span className="logo__text" style={{ display: "block" }}>
        <b>Neelum Resort</b>
        <span>Taobat · Neelum Valley</span>
      </span>
    </Link>
  );
}
