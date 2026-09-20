"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./icons";
import { saveEnquiry } from "@/app/(site)/enquiry-actions";
import { waBookbar, waLink } from "@/lib/wa";

/**
 * The availability bar under the hero — PROMPT.md section 6.
 *
 * The one thing that matters here is the order of operations in `onSubmit`:
 *
 *     window.open(url, "_blank")   // synchronous, inside the click
 *     saveEnquiry(...)             // fire-and-forget, afterwards
 *
 * Safari and Chrome only allow `window.open` while the click is still being
 * handled. Open the window after an `await` and the popup blocker eats it — the
 * guest taps the button and nothing happens. Saving the enquiry row comes second
 * on purpose: if the write fails the guest still reaches WhatsApp, which is the
 * only outcome that matters. The write itself lands in Phase 6.
 */
export function BookBar({ whatsapp, roomNames }: { whatsapp: string; roomNames: string[] }) {
  const form = useRef<HTMLFormElement>(null);
  const [dates, setDates] = useState<{ checkin: string; checkout: string } | null>(null);

  // Tomorrow → the day after, matching the reference script. Computed after mount
  // so the server and client markup agree and the page stays statically cacheable.
  useEffect(() => {
    const iso = (d: Date) => d.toISOString().split("T")[0];
    setDates({
      checkin: iso(new Date(Date.now() + 864e5)),
      checkout: iso(new Date(Date.now() + 1728e5)),
    });
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const url = waLink(
      whatsapp,
      waBookbar({
        checkin: String(data.get("checkin") ?? ""),
        checkout: String(data.get("checkout") ?? ""),
        guests: String(data.get("guests") ?? ""),
        room: String(data.get("room") ?? ""),
      }),
    );
    window.open(url, "_blank", "noopener");

    void saveEnquiry({
      name: "Availability check",
      phone: "—",
      checkIn: String(data.get("checkin") ?? ""),
      checkOut: String(data.get("checkout") ?? ""),
      guests: String(data.get("guests") ?? ""),
      kind: "STAY",
      source: "bookbar",
      message: `Room asked for: ${String(data.get("room") ?? "Any")}`,
    });
  }

  return (
    <section className="bookbar">
      <div className="wrap">
        <form className="bookbar__inner" id="bookbar" ref={form} onSubmit={onSubmit}>
          <div className="bookbar__field">
            <label htmlFor="ci">Check in</label>
            <input
              type="date"
              id="ci"
              name="checkin"
              defaultValue={dates?.checkin}
              key={`ci-${dates?.checkin ?? ""}`}
              min={dates?.checkin}
            />
          </div>
          <div className="bookbar__field">
            <label htmlFor="co">Check out</label>
            <input
              type="date"
              id="co"
              name="checkout"
              defaultValue={dates?.checkout}
              key={`co-${dates?.checkout ?? ""}`}
              min={dates?.checkin}
            />
          </div>
          <div className="bookbar__field">
            <label htmlFor="gs">Guests</label>
            <select id="gs" name="guests" defaultValue="2 guests">
              <option>1 guest</option>
              <option>2 guests</option>
              <option>3 guests</option>
              <option>4 guests</option>
              <option>5 guests</option>
              <option>6+ guests</option>
            </select>
          </div>
          <div className="bookbar__field">
            <label htmlFor="rm">Stay</label>
            <select id="rm" name="room">
              <option>Any available room</option>
              {roomNames.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
          <button className="btn btn--primary" type="submit">
            <WhatsAppIcon />
            Check on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
