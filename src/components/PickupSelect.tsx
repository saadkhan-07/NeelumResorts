"use client";

import { useId, useState } from "react";
import { WhatsAppIcon } from "./icons";
import { saveEnquiry } from "@/app/(site)/enquiry-actions";
import { waLink, waTourWithPickup } from "@/lib/wa";

/**
 * "Where should we pick you up?" — PROMPT.md § 5c.
 *
 * This component does exactly one thing: it composes the WhatsApp message. It
 * does not change a price, fetch anything, or show a loading state. The fare
 * genuinely depends on the pick-up point, but the quote comes from a person on
 * WhatsApp, not from this page — so the selector's only job is to put the guest's
 * starting point into the message before they send it.
 *
 * The points come from `Setting["pickupPoints"]`; "Somewhere else" is appended
 * here, because the whole business model is that you can start anywhere.
 */
export function PickupSelect({
  tourSlug,
  tourName,
  points,
  whatsapp,
  label = "Ask about this tour",
}: {
  tourSlug: string;
  tourName: string;
  points: string[];
  whatsapp: string;
  label?: string;
}) {
  const id = useId();
  const options = [...points, "Somewhere else"];
  const [pickup, setPickup] = useState(options[0] ?? "Somewhere else");

  return (
    <>
      <div className="pickup">
        <label htmlFor={id}>Where should we pick you up?</label>
        <select id={id} value={pickup} onChange={(e) => setPickup(e.target.value)}>
          {options.map((point) => (
            <option key={point}>{point}</option>
          ))}
        </select>
      </div>
      <a
        className="btn btn--primary"
        href={waLink(whatsapp, waTourWithPickup({ tourName, pickup }))}
        target="_blank"
        rel="noopener"
        onClick={(event) => {
          // Open first, record second — see EnquiryLink for why the order is
          // not negotiable.
          event.preventDefault();
          window.open(waLink(whatsapp, waTourWithPickup({ tourName, pickup })), "_blank", "noopener");
          void saveEnquiry({
            name: "Website visitor",
            phone: "—",
            kind: "TOUR",
            source: "tour-card",
            tourSlug,
            pickupPoint: pickup,
          });
        }}
      >
        <WhatsAppIcon />
        {label}
      </a>
    </>
  );
}
