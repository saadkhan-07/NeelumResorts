"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NAV_LINKS } from "@/lib/nav";
import { waBooking } from "@/lib/wa";
import type { Brand } from "@/lib/queries";

type HeaderProps = {
  /** From `Setting["whatsapp"]` — never hardcoded. */
  whatsapp: string;
  /** BRAND rows; every slot may be empty, and the mark falls back to inline SVG. */
  brand?: Brand;
  /**
   * `"always"` keeps the header solid from the top, for pages with no hero
   * behind it. Otherwise it is transparent until the hero has scrolled past.
   */
  solid?: "always";
};

export function Header({ solid, whatsapp, brand }: HeaderProps) {
  const [isSolid, setIsSolid] = useState(solid === "always");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const trigger = solid === "always" ? -1 : window.innerHeight * 0.55;
      setIsSolid(window.scrollY > trigger);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [solid]);

  // A route change closes the panel even when the navigation did not come
  // from one of its own links.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className={isSolid ? "site-header is-solid" : "site-header"}>
        <div className="wrap">
          <Logo brand={brand} />
          <nav className="nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "is-active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button variant="primary" small className="header-cta" wa={waBooking} whatsapp={whatsapp}>
            Book on WhatsApp
          </Button>
          <button
            className="burger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} whatsapp={whatsapp} />
    </>
  );
}
