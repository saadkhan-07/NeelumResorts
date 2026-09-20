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
/**
 * Today, plus n days, as yyyy-mm-dd in the visitor's OWN timezone.
 *
 * `toISOString()` would be wrong here: it converts to UTC first, so in Pakistan
 * (UTC+5) any time before 05:00 local reports yesterday's date — the bar would
 * open offering a check-in that has already passed.
 */
function isoDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nextDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function BookBar({ whatsapp, roomNames }: { whatsapp: string; roomNames: string[] }) {
  const form = useRef<HTMLFormElement>(null);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [today, setToday] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Tomorrow → the day after, matching the reference script. Computed after mount
  // so the server and client markup agree and the page stays statically cacheable.
  useEffect(() => {
    setToday(isoDay(0));
    setCheckin(isoDay(1));
    setCheckout(isoDay(2));
  }, []);

  /**
   * Moving check-in past check-out drags check-out with it, rather than leaving
   * the guest looking at a range that reads backwards. A night is the minimum:
   * a check-out on the arrival day is not a stay.
   */
  function onCheckinChange(value: string) {
    setCheckin(value);
    if (value && checkout && checkout <= value) setCheckout(nextDay(value));
    setError(null);
  }

  function onCheckoutChange(value: string) {
    setCheckout(value);
    setError(null);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    // Validate what is actually being submitted, not what React thinks the state
    // is. `min` on a date input is no guarantee — it is not enforced against a
    // typed value in every browser and is trivially removed in dev tools — and
    // if the DOM and the component state ever disagree, FormData is the one that
    // reaches WhatsApp. Checking the same object we send is the only version of
    // this check that cannot be walked around.
    const from = String(data.get("checkin") ?? "");
    const to = String(data.get("checkout") ?? "");
    if (from && to && to <= from) {
      setError("Check-out needs to be after check-in.");
      return;
    }
    setError(null);

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
              value={checkin}
              onChange={(e) => onCheckinChange(e.target.value)}
              min={today}
            />
          </div>
          <div className="bookbar__field">
            <label htmlFor="co">Check out</label>
            <input
              type="date"
              id="co"
              name="checkout"
              value={checkout}
              onChange={(e) => onCheckoutChange(e.target.value)}
              /* The floor follows the chosen check-in, not the value it happened
                 to hold when the page loaded — that was the bug. */
              min={checkin ? nextDay(checkin) : today}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "bookbar-error" : undefined}
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
          {error ? (
            <p className="bookbar__error" id="bookbar-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="btn btn--primary" type="submit">
            <WhatsAppIcon />
            Check on WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
