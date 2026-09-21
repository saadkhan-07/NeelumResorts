import Link from "next/link";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "./icons";
import type { Brand, Settings } from "@/lib/queries";
import { telLink, waGeneral, waLink } from "@/lib/wa";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/stays", label: "Our stays" },
  { href: "/tours", label: "Jeep Tours" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#location", label: "How to reach" },
];

const GOOD_TO_KNOW = [
  { href: "/#faq", label: "FAQs" },
  { href: "/contact", label: "Contact & Directions" },
  { href: "#", label: "Cancellation policy" },
];

/**
 * Every contact detail comes from the `Setting` table. A social link with no row
 * yet renders nothing rather than a dead `#` — the reference's placeholders were
 * never real URLs.
 */
export function Footer({ settings, brand }: { settings: Settings; brand?: Brand }) {
  const socials = [
    { href: settings.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: settings.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: settings.tiktok, label: "TikTok", Icon: TikTokIcon },
  ].filter((s) => s.href);

  const addressLines = settings.address.split("\n");

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo brand={brand} />
            <p>
              A riverside resort at the far end of Neelum Valley, where the road
              stops and the mountains take over. Rated {settings.ratingScore} by{" "}
              {settings.ratingCount} guests on Google.
            </p>
            <div className="socials">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener">
                  <Icon />
                </a>
              ))}
              <a
                href={waLink(settings.whatsapp, "Assalam o Alaikum!")}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div>
            <h3>Explore</h3>
            <ul className="footer-links">
              {EXPLORE.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Good to know</h3>
            <ul className="footer-links">
              {GOOD_TO_KNOW.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Reach us</h3>
            <ul className="footer-links">
              <li>
                <a href={telLink(settings.phone)}>{settings.phoneDisplay}</a>
              </li>
              <li>
                <a
                  href={waLink(settings.whatsapp, waGeneral)}
                  target="_blank"
                  rel="noopener"
                >
                  WhatsApp us
                </a>
              </li>
              <li>
                {addressLines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < addressLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </li>
              <li>
                <a href={settings.googleMapsUrl} target="_blank" rel="noopener">
                  Open in Google Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} Neelum Resort Taobat. All rights
            reserved.
          </span>
          <span>Privacy Policy · Terms &amp; Conditions</span>
        </div>
      </div>
    </footer>
  );
}
