/**
 * WhatsApp message builders — PROMPT.md section 6.
 *
 * Every guest interaction on this site ends at wa.me. There is no email anywhere,
 * so these strings are the entire contact surface: get them wrong and an enquiry
 * arrives without the dates.
 *
 * The number is never hardcoded here — it comes from `Setting["whatsapp"]` and is
 * passed in, so the owner can change it from the admin panel in Phase 6.
 */

export function waLink(whatsapp: string, message: string) {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string) {
  return `tel:${phone}`;
}

const HELLO = "Assalam o Alaikum!";

/** Header, footer, floating button. */
export const waGeneral = `${HELLO} I'd like to enquire about a stay at Neelum Resort Taobat.`;

export const waBooking = `${HELLO} I'd like to enquire about booking a stay at Neelum Resort Taobat.`;

export const waAvailability = `${HELLO} I'd like to check availability at Neelum Resort Taobat.`;

/** A room card or room detail row. */
export function waRoom(roomName: string) {
  return `${HELLO} I'd like to check availability for the ${roomName} at Neelum Resort Taobat.`;
}

/** A tour card, before the guest has touched the pick-up selector. */
export function waTour(tourName: string) {
  return `${HELLO} I'd like to ask about the ${tourName} jeep tour.`;
}

/**
 * The availability bar under the hero. Dates come out of `<input type="date">`
 * as yyyy-mm-dd; the owner reads these on a phone, so they are formatted the way
 * the reference script formats them.
 */
export function waBookbar(fields: {
  checkin?: string;
  checkout?: string;
  guests?: string;
  room?: string;
}) {
  return [
    `${HELLO} I'd like to check availability at Neelum Resort Taobat.`,
    "",
    `Check-in: ${formatDate(fields.checkin)}`,
    `Check-out: ${formatDate(fields.checkout)}`,
    `Guests: ${fields.guests || "—"}`,
    `Stay: ${fields.room || "—"}`,
    "",
    "Could you share the rates and availability? Thank you.",
  ].join("\n");
}

/** The contact form. */
export function waContact(fields: {
  name?: string;
  phone?: string;
  dates?: string;
  guests?: string;
  message?: string;
}) {
  return [
    `${HELLO} Enquiry from the Neelum Resort website.`,
    "",
    `Name: ${fields.name || "—"}`,
    `Phone: ${fields.phone || "—"}`,
    `Dates: ${fields.dates || "—"}`,
    `Guests: ${fields.guests || "—"}`,
    "",
    fields.message || "",
  ].join("\n");
}

/**
 * A tour enquiry once the guest has chosen a pick-up point — PROMPT.md § 5c.
 * The pick-up is the whole point of the message: the fare depends on it.
 */
export function waTourWithPickup(fields: {
  tourName: string;
  pickup: string;
  date?: string;
  people?: string;
}) {
  return [
    `${HELLO} I'd like to ask about the ${fields.tourName} jeep tour.`,
    "",
    `Pick-up from: ${fields.pickup}`,
    ...(fields.date ? [`Preferred date: ${fields.date}`] : []),
    ...(fields.people ? [`People: ${fields.people}`] : []),
    "",
    "Could you let me know availability and the fare from there? Thank you.",
  ].join("\n");
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
