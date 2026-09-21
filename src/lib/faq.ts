import { FAQ, type FaqItem } from "./copy";
import { formatFare } from "./fares";
import type { TourWithFares } from "./queries";

/** The route whose fares answer "How much is a jeep from Kel to Taobat?". */
const TAOBAT_TOUR = "taobat-valley";

/**
 * The FAQ as rendered, and as sent to Google in the FAQPage schema — one list, so
 * the two can never differ.
 *
 * The jeep-fare answer is built from the published `TourFare` rows rather than
 * written into copy: the owner changes fares from the admin panel, and an FAQ that
 * still quoted last season's fare would be the one wrong price on the site. With the
 * fares switched off it says the fare is quoted on WhatsApp, which is then true.
 */
export function buildFaq(tours: TourWithFares[]): FaqItem[] {
  const items = [...FAQ];
  const tour = tours.find((t) => t.slug === TAOBAT_TOUR);
  if (!tour) return items;

  const fares = tour.fares.map(
    (f) => `${formatFare(f.priceMin, f.priceMax)} from ${f.pickupName}`,
  );
  const notes = [...new Set(tour.fares.map((f) => f.note).filter(Boolean))];

  const a =
    fares.length > 0
      ? `Our published fare for the ${tour.name} jeep tour is ${listOf(fares)}, per jeep for up to 6 passengers${
          notes.length ? ` (${notes.join("; ").toLowerCase()})` : ""
        }. Starting somewhere else? Tell us on WhatsApp and we'll quote it.`
      : "We quote the jeep fare to Taobat on WhatsApp, because it moves with the season and the state of the road. Tell us where you are starting from and how many of you there are.";

  // After "best time to visit", before the Arang Kel question.
  const at = items.findIndex((i) => i.q.startsWith("What is Arang Kel"));
  items.splice(at < 0 ? items.length : at, 0, { q: "How much is a jeep from Kel to Taobat?", a });
  return items;
}

function listOf(parts: string[]) {
  if (parts.length < 2) return parts.join("");
  return `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
}
