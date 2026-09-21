/**
 * The site's public address, for canonical URLs, the sitemap and structured data.
 *
 * `www` on purpose: the bare domain 308-redirects to it, and a canonical URL must
 * be the address that actually serves the page — pointing Google at a redirect
 * tells it two things at once.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.neelumresortstaobat.com").replace(/\/$/, "");

export const SITE_NAME = "Neelum Resort Taobat";

/** From the Google Business Profile — the map pin. */
export const GEO = { latitude: 34.7247131, longitude: 74.7096112 } as const;

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** The homepage's title, and the fallback for any page that sets none. */
export const HOME_TITLE = "Resort in Taobat, Neelum Valley — Neelum Resort Taobat";
