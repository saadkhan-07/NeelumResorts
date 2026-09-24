"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { logoUrl } from "@/lib/cloudinary";
import { NAV_LINKS } from "@/lib/nav";
import type { Brand } from "@/lib/queries";
import { waBooking } from "@/lib/wa";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  whatsapp: string;
  brand?: Brand;
};

/**
 * The mobile menu, as a slide-in drawer.
 *
 * It replaces the reference's full-screen fade, which had three problems on a
 * real phone: the panel appeared instantly over everything with no sense of
 * where it came from, the "Book on WhatsApp" button was 433px wide inside a
 * 390px viewport so its text was clipped at both ends, and the page behind kept
 * scrolling underneath it.
 *
 * A drawer fixes all three and is the pattern the reference site itself uses.
 *
 * Behaviour that makes it feel finished rather than functional:
 *  - focus moves into the panel on open and returns to the burger on close, so
 *    a keyboard or screen-reader user is not left behind on the page;
 *  - Escape closes it, as every dialog should;
 *  - the page behind is locked, so closing the menu does not reveal that you
 *    have accidentally scrolled somewhere else;
 *  - `prefers-reduced-motion` drops the slide.
 */
export function MobileNav({ open, onClose, whatsapp, brand }: MobileNavProps) {
  const panel = useRef<HTMLDivElement>(null);
  // The drawer is pine, so the light mark, falling back as the header's does.
  const logo = brand?.["logo-light"] ?? brand?.["logo-dark"] ?? null;
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    returnFocus.current = document.activeElement as HTMLElement;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    // The first link, not the close button: it is what the visitor came for.
    //
    // On the next frame, not this one: the panel is still `visibility:hidden`
    // when this effect runs, and nothing inside a hidden subtree can take focus.
    // Calling focus() here silently does nothing and the drawer opens with the
    // keyboard still on the burger behind it.
    const focusFrame = requestAnimationFrame(() => {
      panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel.current) return;

      // Keep Tab inside the drawer while it is open.
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      body.style.overflow = previousOverflow;
      returnFocus.current?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={open ? "mobile-scrim is-open" : "mobile-scrim"}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panel}
        className={open ? "mobile-nav is-open" : "mobile-nav"}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        // The panel is translated off-screen and `visibility:hidden` when closed,
        // so it is already out of the tab order; this keeps it out of the
        // accessibility tree too.
        aria-hidden={!open}
      >
        <div className="mobile-nav__head">
          <span className="mobile-nav__brand">
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                className="mobile-nav__logo"
                src={logoUrl(logo.publicId, 160)}
                alt="Neelum Resort Taobat"
                // The upload's own proportions, so the box is right before it loads.
                width={Math.round((42 * logo.width) / logo.height)}
                height="42"
                // Same URL as the header's logo, so it is already in the cache.
                fetchPriority="low"
              />
            ) : null}
            <span>
              <b>Neelum Resort</b>
              <small>Taobat · Neelum Valley</small>
            </span>
          </span>
          <button className="close" aria-label="Close menu" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="mobile-nav__links">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose}>
              {link.label}
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          ))}
        </nav>

        <div className="mobile-nav__foot">
          <Button wa={waBooking} whatsapp={whatsapp} onClick={onClose} className="mobile-nav__cta">
            Book on WhatsApp
          </Button>
        </div>
      </div>
    </>
  );
}
