import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { faviconUrl, ogImageUrl } from "@/lib/cloudinary";
import { getBrand, getMedia, getSettings } from "@/lib/queries";
import { HOME_TITLE, SITE_URL } from "@/lib/site";

// The marketing stylesheet is imported by `(site)/layout.tsx`, not here: /admin
// has its own and must not inherit 128px section padding or the display face.

// The reference loads these two families from Google Fonts; next/font inlines
// them instead. Weight 300 matters: `.mobile-nav a` and `.faq summary` set no
// font-weight, so they inherit 300 from `body` — which is why the reference
// asks Google Fonts for `0,300`.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-body",
});

/**
 * The inline SVG fallback favicon — PROMPT.md § 5b's rule that every brand slot
 * has a code fallback. No file in /public, no app/favicon.ico.
 */
const FALLBACK_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%231D352D'/%3E%3Cpath d='M8 27l7-10 4 5.5 3.5-5L32 27z' fill='%23BE9247'/%3E%3C/svg%3E";

/**
 * Icons and social image come from the BRAND rows.
 *
 * The `?v=` on every favicon URL is not decoration. Browsers cache favicons
 * harder than anything else on the page: without it the owner uploads a new icon,
 * sees the old one for days, and reports the admin panel as broken. The version
 * is the row's `createdAt` — re-uploading a brand asset replaces the row, so the
 * stamp moves and the cache breaks.
 *
 * (PROMPT.md § 5b says `updatedAt`; the `Media` model in § 4 only has
 * `createdAt`, and since a replacement writes a new row it serves the same
 * purpose.)
 */
export async function generateMetadata(): Promise<Metadata> {
  const [brand, settings, hero] = await Promise.all([
    getBrand(),
    getSettings(),
    getMedia("HERO"),
  ]);

  const favicon = brand.favicon;
  const version = favicon ? favicon.createdAt.getTime() : undefined;

  const icons: Metadata["icons"] = favicon
    ? {
        icon: [
          { url: faviconUrl(favicon.publicId, 32, version), sizes: "32x32", type: "image/png" },
          { url: faviconUrl(favicon.publicId, 192, version), sizes: "192x192", type: "image/png" },
        ],
        apple: [{ url: faviconUrl(favicon.publicId, 180, version), sizes: "180x180" }],
      }
    : { icon: FALLBACK_FAVICON };

  // Open Graph falls back to the first hero photograph when no og-image is set,
  // so a WhatsApp link preview is never blank.
  const og = brand["og-image"]?.publicId ?? hero[0]?.publicId;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: HOME_TITLE,
      // Every page title ends with the brand — Phase 7 keyword rule.
      template: "%s — Neelum Resort Taobat",
    },
    description: settings.heroSub,
    icons,
    openGraph: og
      ? {
          title: "Neelum Resort Taobat",
          description: settings.heroSub,
          images: [{ url: ogImageUrl(og), width: 1200, height: 630 }],
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
