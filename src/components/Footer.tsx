import Link from "next/link";
import { Logo } from "./Logo";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from "./icons";
import {
  ADDRESS_LINES,
  MAPS_URL,
  PHONE_DISPLAY,
  WA_ENQUIRY,
  telLink,
  waLink,
} from "@/lib/site";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/stays", label: "Our stays" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#experiences", label: "Experiences" },
  { href: "/#location", label: "How to reach" },
];

const GOOD_TO_KNOW = [
  { href: "/#faq", label: "FAQs" },
  { href: "/contact", label: "Contact & Directions" },
  { href: "#", label: "Cancellation policy" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo />
            <p>
              A riverside resort at the far end of Neelum Valley, where the road
              stops and the mountains take over. Rated 4.9 by 705 guests on
              Google.
            </p>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a
                href={waLink("Assalam o Alaikum!")}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <ul className="footer-links">
              {EXPLORE.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Good to know</h4>
            <ul className="footer-links">
              {GOOD_TO_KNOW.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Reach us</h4>
            <ul className="footer-links">
              <li>
                <a href={telLink}>{PHONE_DISPLAY}</a>
              </li>
              <li>
                <a href={waLink(WA_ENQUIRY)} target="_blank" rel="noopener">
                  WhatsApp us
                </a>
              </li>
              <li>
                {ADDRESS_LINES[0]}
                <br />
                {ADDRESS_LINES[1]}
              </li>
              <li>
                <a href={MAPS_URL} target="_blank" rel="noopener">
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
