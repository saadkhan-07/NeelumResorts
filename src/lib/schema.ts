import { imageUrl } from "./cloudinary";
import type { MediaRow, Settings, TourWithFares } from "./queries";
import { GEO, SITE_NAME, SITE_URL, absoluteUrl } from "./site";

/**
 * schema.org structured data. Every value comes from the same Settings and rows the
 * page renders, so the schema can never say something the page does not.
 *
 * Deliberately absent:
 * - `aggregateRating` / `review` — the rating lives on Google; self-served review
 *   markup on a business's own site is not eligible for stars and can earn a
 *   manual action.
 * - Any duration, distance or "day trip" — unconfirmed, and Ratti Gali is not one.
 * - `priceRange` on the Hotel — rooms are "Rates on request".
 */

type Json = Record<string, unknown>;

const HOTEL_ID = `${SITE_URL}/#hotel`;

/**
 * Splits the Settings address into schema fields. The owner types it as
 * "Neelum Valley Road, Taobat 13231\nAzad Jammu & Kashmir" (or with a comma before
 * the postcode, as the Google profile writes it). If it ever stops matching that
 * shape, the whole first line goes in `streetAddress` rather than guessing.
 */
export function postalAddress(address: string): Json {
  const [line1 = "", ...rest] = address.split("\n").map((l) => l.trim());
  const region = rest.join(", ");
  const m = line1.match(/^(.*),\s*([^,]+?),?\s+(\d{4,6})$/);

  return {
    "@type": "PostalAddress",
    streetAddress: m ? m[1] : line1,
    ...(m ? { addressLocality: m[2], postalCode: m[3] } : {}),
    ...(region ? { addressRegion: region } : {}),
    addressCountry: "PK",
  };
}

function sameAs(settings: Settings) {
  const links = [settings.googleMapsUrl, settings.instagram, settings.facebook, settings.tiktok];
  return [...new Set(links.filter((u) => /^https?:\/\//.test(u)))];
}

/** The provider block, shared by the homepage Hotel and every TouristTrip. */
function hotelCore(settings: Settings): Json {
  return {
    "@type": "Hotel",
    "@id": HOTEL_ID,
    name: SITE_NAME,
    url: SITE_URL,
    telephone: settings.phoneDisplay,
    address: postalAddress(settings.address),
  };
}

export function hotelSchema(settings: Settings, photos: MediaRow[]): Json {
  const links = sameAs(settings);
  return {
    "@context": "https://schema.org",
    ...hotelCore(settings),
    description: settings.heroSub,
    geo: { "@type": "GeoCoordinates", ...GEO },
    ...(photos.length ? { image: photos.map((p) => imageUrl(p.publicId, 1200)) } : {}),
    ...(links.length ? { sameAs: links } : {}),
    ...(settings.googleMapsUrl ? { hasMap: settings.googleMapsUrl } : {}),
  };
}

/**
 * A jeep tour. One Offer per published fare, priced per jeep; a tour with no
 * published fare gets no `offers` at all — "Fare agreed on WhatsApp" is not a
 * price, and an Offer without one is invalid.
 */
export function touristTripSchema(
  tour: TourWithFares,
  settings: Settings,
  description: string,
): Json {
  const url = absoluteUrl(`/tours/${tour.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${tour.name} jeep tour`,
    description,
    url,
    ...(tour.photos.length ? { image: tour.photos.map((p) => imageUrl(p.publicId, 1200)) } : {}),
    itinerary: { "@type": "Place", name: tour.name },
    provider: hotelCore(settings),
    ...(tour.fares.length
      ? {
          offers: tour.fares.map((fare) => ({
            "@type": "Offer",
            name: `Jeep from ${fare.pickupName}`,
            url,
            priceCurrency: "PKR",
            ...(fare.priceMax == null ? { price: fare.priceMin } : {}),
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              priceCurrency: "PKR",
              unitText: "per jeep, up to 6 passengers",
              ...(fare.priceMax == null
                ? { price: fare.priceMin }
                : { minPrice: fare.priceMin, maxPrice: fare.priceMax }),
            },
            ...(fare.note ? { description: fare.note } : {}),
          })),
        }
      : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
