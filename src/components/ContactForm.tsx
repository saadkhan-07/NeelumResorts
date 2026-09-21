"use client";

import { useState } from "react";
import { WhatsAppIcon } from "./icons";
import { saveEnquiry } from "@/app/(site)/enquiry-actions";
import { waContact, waLink } from "@/lib/wa";

/**
 * The enquiry form — PROMPT.md section 6. There is no email path and no server
 * round-trip here: submitting opens WhatsApp with the guest's details already
 * typed out.
 *
 * `window.open` runs synchronously inside the submit handler, before anything
 * async, or Safari's popup blocker swallows it. The enquiry row is written in
 * Phase 6, and it goes *after* this call for the same reason.
 */
export function ContactForm({ whatsapp }: { whatsapp: string }) {
  // Announced to screen readers: the visible result happens in another tab, so
  // without this a blind guest presses the button and hears nothing at all.
  const [status, setStatus] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const url = waLink(
      whatsapp,
      waContact({
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        dates: String(data.get("dates") ?? ""),
        guests: String(data.get("guests") ?? ""),
        message: String(data.get("message") ?? ""),
      }),
    );
    window.open(url, "_blank", "noopener");
    setStatus("WhatsApp has opened in a new tab with your details. Press send there to reach us.");

    // Fire-and-forget, strictly after the window is open.
    void saveEnquiry({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      guests: String(data.get("guests") ?? ""),
      message: String(data.get("message") ?? ""),
      kind: "STAY",
      source: "contact-form",
    });
  }

  return (
    <form className="form" id="contact-form" onSubmit={onSubmit}>
      <div>
        <label htmlFor="n">Your name</label>
        <input id="n" name="name" required placeholder="Full name" />
      </div>
      <div>
        <label htmlFor="p">Phone / WhatsApp</label>
        <input id="p" name="phone" required placeholder="03xx xxxxxxx" />
      </div>
      <div>
        <label htmlFor="d">Dates</label>
        <input id="d" name="dates" placeholder="e.g. 12–15 July" />
      </div>
      <div>
        <label htmlFor="g">Guests</label>
        <input id="g" name="guests" placeholder="e.g. 2 adults, 1 child" />
      </div>
      <div className="full">
        <label htmlFor="m">Message</label>
        <textarea
          id="m"
          name="message"
          placeholder="Which room are you interested in? Any questions about the drive, food or trips?"
        />
      </div>
      <div className="full">
        <button className="btn btn--wa" type="submit" style={{ width: "100%" }}>
          <WhatsAppIcon />
          Send on WhatsApp
        </button>
        <p className="visually-hidden" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </form>
  );
}
