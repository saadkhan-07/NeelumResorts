"use client";

import Link from "next/link";
import { Button } from "./Button";
import { NAV_LINKS } from "@/lib/nav";
import { WA_BOOKING } from "@/lib/site";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <div
      className={open ? "mobile-nav is-open" : "mobile-nav"}
      id="mobile-nav"
      // The panel is `visibility:hidden` when closed, so it is already out of
      // the tab order; aria-hidden keeps it out of the accessibility tree too.
      aria-hidden={!open}
    >
      <button className="close" aria-label="Close menu" onClick={onClose}>
        &times;
      </button>
      {NAV_LINKS.map((link) => (
        <Link key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </Link>
      ))}
      <Button wa={WA_BOOKING} onClick={onClose}>
        Book on WhatsApp
      </Button>
    </div>
  );
}
