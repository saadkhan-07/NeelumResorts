import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "@/styles/global.css";

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

// Inline SVG fallback favicon — no file in /public, no app/favicon.ico.
// Phase 4 replaces this with the Cloudinary brand asset.
const FALLBACK_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%231D352D'/%3E%3Cpath d='M8 27l7-10 4 5.5 3.5-5L32 27z' fill='%23BE9247'/%3E%3C/svg%3E";

export const metadata: Metadata = {
  title:
    "Neelum Resort Taobat — Riverside Resort in Neelum Valley, Kashmir",
  description:
    "A 4.9-rated riverside resort in Taobat, the last village of Neelum Valley. Cedar rooms, river trout, bonfire nights and trips to Kel and Arang Kel. Book on WhatsApp.",
  icons: { icon: FALLBACK_FAVICON },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
