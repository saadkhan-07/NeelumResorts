import type { Metadata } from "next";
import { ogImageUrl } from "./cloudinary";
import { getBrand, getMedia } from "./queries";
import { SITE_NAME } from "./site";

/** Meta descriptions over this are cut off in Google's results. */
export const DESCRIPTION_MAX = 155;

/**
 * A meta description that ends with a reason to click, kept under the limit.
 * If the two do not fit together the body is cut at a word boundary, never the
 * reason — the reason is the part that earns the click.
 */
export function withReason(body: string, reason: string) {
  const full = `${body} ${reason}`;
  if (full.length <= DESCRIPTION_MAX) return full;
  const room = DESCRIPTION_MAX - reason.length - 2; // "…" + space
  const cut = body.slice(0, room).replace(/[\s,;:—–-]+\S*$/, "");
  return `${cut}… ${reason}`;
}


/**
 * Title, description, canonical and Open Graph for one page, built one way.
 *
 * `title` is the keyword part only; the layout's template appends the brand.
 * Pass `absoluteTitle` for the homepage, whose title already ends with it.
 *
 * Next.js replaces a parent's `openGraph` wholesale rather than merging it, so
 * the share image has to be set here on every page, not once in the layout: the
 * og-image brand row, else the first hero photograph.
 */
export async function pageMetadata({
  title,
  absoluteTitle,
  description,
  path,
}: {
  title?: string;
  absoluteTitle?: string;
  description: string;
  path: string;
}): Promise<Metadata> {
  const [brand, hero] = await Promise.all([getBrand(), getMedia("HERO")]);
  const og = brand["og-image"]?.publicId ?? hero[0]?.publicId;
  const fullTitle = absoluteTitle ?? `${title} — ${SITE_NAME}`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_PK",
      url: path,
      title: fullTitle,
      description,
      images: og ? [{ url: ogImageUrl(og), width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
