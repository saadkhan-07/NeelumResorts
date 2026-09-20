import "@/styles/global.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { getBrand, getSettings } from "@/lib/queries";

/**
 * The public shell. Every contact detail in the header, footer and floating button
 * comes from the `Setting` table, so the owner can change the WhatsApp number in
 * Phase 6 without a deploy. /admin sits outside this group from Phase 5.
 */
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, brand] = await Promise.all([getSettings(), getBrand()]);

  return (
    <>
      {/* Free text in Settings. Non-empty puts a strip across every public page —
          "Road closed for winter, reopening May" is the case it exists for. */}
      {settings.seasonBanner ? (
        <p className="season-banner" role="status">
          {settings.seasonBanner}
        </p>
      ) : null}
      <Header whatsapp={settings.whatsapp} brand={brand} />
      <main>{children}</main>
      <Footer settings={settings} brand={brand} />
      <WhatsAppFloat whatsapp={settings.whatsapp} />
    </>
  );
}
