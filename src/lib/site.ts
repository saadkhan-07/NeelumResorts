/**
 * Contact details and WhatsApp helpers.
 *
 * These are the two settings from the reference script's SETTINGS block. From
 * Phase 3 they come from the `Setting` table; until then they live here so
 * there is a single place to change them.
 */

// WhatsApp number in international format, no + and no spaces
export const WHATSAPP = "923556804073";

// Phone number for the tel: links
export const PHONE = "+923556804073";

export const PHONE_DISPLAY = "+92 355 6804073";

export const ADDRESS_LINES = [
  "Neelum Valley Road, Taobat 13231",
  "Azad Jammu & Kashmir",
];

export const MAPS_URL = "https://maps.google.com/?q=Neelum+Resort+Taobat";

/** Builds a wa.me deep link with a pre-filled message. */
export function waLink(message: string) {
  return "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message);
}

export const telLink = "tel:" + PHONE;

/** The default enquiry message used by the header, footer and floating button. */
export const WA_ENQUIRY =
  "Assalam o Alaikum! I'd like to enquire about a stay at Neelum Resort Taobat.";

export const WA_BOOKING =
  "Assalam o Alaikum! I'd like to enquire about booking a stay at Neelum Resort Taobat.";
