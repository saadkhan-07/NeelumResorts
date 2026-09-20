/**
 * The resort's real content, as typed objects that match the Prisma models exactly.
 *
 * ONLY `prisma/seed.ts` imports this file. No page, server component, route handler
 * or admin screen may import it — every one of those reads the database through
 * `src/lib/queries.ts`. If this file ever appears in an import inside `src/`, the
 * page is being built against temporary data and Phase 2 has been undone.
 *
 * Copy is taken verbatim from `design-reference/` (index.html, rooms.html, tours.html)
 * except where a note says otherwise.
 */

import type { Prisma } from "../src/generated/prisma/client";

/* ------------------------------------------------------------------ rooms */

/**
 * Rooms seed with `showPrice: false` and no `price`, so every card reads
 * "Rates on request" until the owner turns a rate on from the admin panel.
 */
export const rooms: Prisma.RoomCreateInput[] = [
  {
    slug: "deluxe-riverside-room",
    name: "Deluxe Riverside Room",
    tagline: "Most booked",
    shortDesc:
      "A warm cedar-lined room a few steps from the water, with a private window seat looking straight onto the Neelum.",
    longDesc:
      "The Deluxe Riverside is our smallest and most loved room — cedar walls, thick quilts, and a window you can open at night to hear nothing but the river. Hot water runs round the clock and the room is heated through the cold months.",
    guests: "2 guests",
    beds: "1 queen bed",
    sizeSqft: "220 sq ft",
    view: "River-facing",
    amenities: [
      "Private attached bathroom with hot water",
      "Room heater & extra quilts",
      "River-facing window seat",
      "Tea & kahwa service in room",
      "Daily housekeeping",
      "Backup power through the night",
    ],
    showPrice: false,
    order: 0,
    published: true,
  },
  {
    slug: "executive-valley-suite",
    name: "Executive Valley Suite",
    tagline: "Best view",
    shortDesc:
      "Our corner suite on the upper floor, with a wooden balcony that catches the first light on the peaks.",
    longDesc:
      "Set on the top floor at the corner of the building, the Executive Suite has windows on two sides and a private balcony wide enough for two chairs and a table — the best seat in the resort at sunrise.",
    guests: "3 guests",
    beds: "1 king + 1 single",
    sizeSqft: "340 sq ft",
    view: "Valley & peaks",
    amenities: [
      "Private balcony with valley view",
      "Seating area & writing desk",
      "Attached bathroom with hot water",
      "Room heater & extra quilts",
      "Breakfast served on the balcony",
      "Backup power through the night",
    ],
    showPrice: false,
    order: 1,
    published: true,
  },
  {
    slug: "family-hut",
    name: "Family Hut",
    tagline: "For groups",
    shortDesc:
      "A standalone wooden hut with two bedrooms and its own sit-out — built for families travelling together.",
    longDesc:
      "The Family Hut sits slightly apart from the main building with its own porch and fire pit area. Two bedrooms share a lounge, so families and groups of friends get the run of the place without booking three separate rooms.",
    guests: "5 guests",
    beds: "2 bedrooms",
    sizeSqft: "520 sq ft",
    view: "Garden & river",
    amenities: [
      "Two separate bedrooms",
      "Private porch & sit-out",
      "Attached bathrooms with hot water",
      "Space for an extra mattress",
      "Bonfire arranged on request",
      "Backup power through the night",
    ],
    showPrice: false,
    order: 2,
    published: true,
  },
  {
    slug: "riverside-cottage",
    name: "Riverside Cottage",
    tagline: "Newest",
    // The homepage carries only three room cards, so the reference has no card line
    // for this room. Condensed from its own detail copy on rooms.html — replace it
    // with the owner's wording when they review the site.
    shortDesc:
      "A timber deck almost above the water on the lowest terrace — the quietest corner of the resort.",
    longDesc:
      "Built last season on the lowest terrace of the property, the Riverside Cottage has a timber deck almost above the water. It is the quietest corner of the resort and the first to book out in July and August.",
    guests: "4 guests",
    beds: "1 king + 1 double",
    sizeSqft: "430 sq ft",
    view: "Direct river",
    amenities: [
      "Timber deck over the riverbank",
      "Two double beds",
      "Attached bathroom with hot water",
      "Room heater & extra quilts",
      "Private dining on the deck",
      "Backup power through the night",
    ],
    showPrice: false,
    order: 3,
    published: true,
  },
];

/* ------------------------------------------------------------------ tours */

/**
 * What every jeep fare covers, from the "Our jeeps" strip on tours.html. The same
 * list is shown on each tour, so it seeds onto all four.
 */
const JEEP_INCLUDES = [
  "Up to 6 passengers per jeep",
  "Fuel and driver included in every fare",
  "Waiting time at the destination",
  "Pick-up anywhere on the valley road",
  "Packed lunch arranged on request",
  "Overnight trips planned around you",
];

/**
 * A tour never carries a single price — see PROMPT.md § 5c. Fares live on `TourFare`,
 * one row per pick-up point, and are nested here so a tour and its fares are written
 * in one statement.
 *
 * Taobat Valley is the only route with published fares: it is the trip the resort runs
 * every week, and those are the client's real numbers. The other three seed with none,
 * so both the priced path and the "Fare agreed on WhatsApp" path exist from day one.
 */
export const tours: Prisma.TourCreateInput[] = [
  {
    slug: "taobat-valley",
    name: "Taobat Valley",
    tagline: "Published fare",
    shortDesc:
      "The last valley on the Neelum road — river, meadows and the old wooden village, with the border ridge above it.",
    longDesc:
      "Taobat is where the valley runs out of road. The track follows the river the whole way, past Kel and through pine, and ends at the village that gives the valley its name. This is the trip we run most often, so the fare is fixed.",
    season: "Open May – late October",
    difficulty: "Jeep track the whole way",
    travelNote: "Roughly 3 hrs from Kel",
    highlights: [
      "The old wooden village at Taobat",
      "River crossings and pine track",
      "The border ridge and meadows",
      "Tea stop at Kel on the way",
    ],
    includes: JEEP_INCLUDES,
    showPrice: true,
    order: 0,
    published: true,
    fares: {
      create: [
        {
          pickupName: "Kel",
          priceMin: 14000,
          priceMax: 16000,
          note: "Varies with season and road condition",
          order: 0,
          published: true,
        },
        {
          pickupName: "Sharda",
          priceMin: 20000,
          priceMax: 22000,
          note: "Varies with season and road condition",
          order: 1,
          published: true,
        },
      ],
    },
  },
  {
    slug: "arang-kel",
    name: "Arang Kel",
    tagline: "Most popular",
    shortDesc:
      "The meadow village on the ridge above Kel — green roofs, grazing horses and the whole valley below you.",
    longDesc:
      "Jeep to Kel, then the chairlift across the river and a steep walk up through the pine to the meadow. Arang Kel sits on a shelf above the valley with nothing above it but the ridge. Most guests go up in the morning and come down before dark.",
    season: "Open June – September",
    difficulty: "Jeep to Kel, then chairlift and a climb",
    travelNote: "A long day from Kel",
    highlights: [
      "The meadow and wooden village",
      "Chairlift across the Neelum",
      "Views down the whole valley",
      "Best light early morning",
    ],
    includes: JEEP_INCLUDES,
    showPrice: false,
    order: 1,
    published: true,
  },
  {
    slug: "ratti-gali-lake",
    name: "Ratti Gali Lake",
    tagline: "Two days",
    shortDesc:
      "An alpine lake ringed by snow well into summer, reached by a jeep track off the valley road.",
    longDesc:
      "Ratti Gali is reached from Dowarian, a long way down-valley from Taobat, so this is not a day trip from the resort. We arrange the jeep, the driver and the overnight stop. Tell us where you are starting from and we'll plan it around that.",
    season: "Open late June – September",
    difficulty: "Rough jeep track, then a walk to the lake",
    travelNote: "A full day or more, depending on where you start",
    highlights: [
      "Snow at the lake edge into July",
      "Wildflower meadows on the climb",
      "Camping by the water",
      "Sunrise over the ridge",
    ],
    includes: JEEP_INCLUDES,
    showPrice: false,
    order: 2,
    published: true,
  },
  {
    slug: "baboon-valley",
    name: "Baboon Valley",
    tagline: "Half day",
    // The homepage carries only three tour cards, so the reference has no card line
    // for this tour. Condensed from its own detail copy on tours.html.
    shortDesc:
      "A short run off the main valley road into forest and open grazing land — green and quiet, without a long drive.",
    longDesc:
      "A short run off the main valley road into forest and open grazing land. Good for a half day when you want somewhere green and quiet without committing to a long drive.",
    season: "Open May – October",
    difficulty: "Jeep track and an easy walk",
    travelNote: "A few hours from Kel or Taobat",
    highlights: [
      "Forest track and stream crossings",
      "Open grazing meadows",
      "Quiet even in August",
      "Easy enough for families",
    ],
    includes: JEEP_INCLUDES,
    showPrice: false,
    order: 3,
    published: true,
  },
];

/* --------------------------------------------------------------- settings */

/**
 * Every key the site reads. `Setting` is a flat key/value table, so a missing row
 * must never crash a page — `getSettings()` fills the gaps with these defaults.
 *
 * `heroHeadline` marks its emphasised word with *asterisks*: the reference renders
 * "Where the valley <em>ends</em>, and the quiet begins." with the em in brass
 * italic. Storing the marker rather than raw HTML keeps a non-technical owner from
 * having to type tags, and keeps us from injecting their input as markup.
 *
 * `pickupPoints` is one place name per line — it populates the "Where should we pick
 * you up?" selector on every tour. The selector appends "Somewhere else" itself.
 */
export const settings: Record<string, string> = {
  whatsapp: "923556804073",
  phone: "+923556804073",
  phoneDisplay: "+92 355 6804073",
  address: "Neelum Valley Road, Taobat 13231\nAzad Jammu & Kashmir",
  googleMapsUrl: "https://maps.google.com/?q=Neelum+Resort+Taobat",

  heroHeadline: "Where the valley *ends*, and the quiet begins.",
  heroSub:
    "A riverside resort in Taobat — the last village in Neelum Valley. Cedar rooms, fresh trout, and a river you can hear from your bed.",

  // Empty renders nothing. Non-empty puts a strip across the top of every public
  // page — "Road closed for winter — reopening May".
  seasonBanner: "",

  // The reference links these as "#": the client has not supplied them yet.
  instagram: "",
  facebook: "",
  tiktok: "",

  pickupPoints: ["Muzaffarabad", "Sharda", "Kel", "Taobat"].join("\n"),
  ratesUpdated: "September 2026",

  // From the live Google listing, checked 20 Sep 2026. Editable in Settings —
  // the count moves every week.
  ratingScore: "4.9",
  ratingCount: "704",
};
