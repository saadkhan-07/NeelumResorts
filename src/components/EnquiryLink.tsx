"use client";

import { saveEnquiry, type EnquiryInput } from "@/app/(site)/enquiry-actions";
import { waLink } from "@/lib/wa";

/**
 * A WhatsApp button on a card that also leaves a row behind.
 *
 * The order is the entire point, and it is the same rule as the two forms:
 *
 *     window.open(...)   // synchronous, inside the click — survives the blocker
 *     saveEnquiry(...)   // afterwards, and nobody waits for it
 *
 * Open the window after an `await` and Safari kills it. The guest taps
 * "Enquire", nothing happens, and they go somewhere else.
 *
 * A card click has no name or phone to record, so the row is deliberately
 * minimal: it marks that someone opened a conversation about this room or tour.
 * The real details arrive in WhatsApp.
 */
export function EnquiryLink({
  whatsapp,
  message,
  enquiry,
  className,
  children,
}: {
  whatsapp: string;
  message: string;
  enquiry: Omit<EnquiryInput, "name" | "phone"> & { name?: string; phone?: string };
  className?: string;
  children: React.ReactNode;
}) {
  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.open(waLink(whatsapp, message), "_blank", "noopener");
    void saveEnquiry({
      name: enquiry.name ?? "Website visitor",
      phone: enquiry.phone ?? "—",
      ...enquiry,
    } as EnquiryInput);
  }

  return (
    <a
      className={className}
      href={waLink(whatsapp, message)}
      target="_blank"
      rel="noopener"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
