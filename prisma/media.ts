/**
 * Which photographs are good enough to seed, and where each one genuinely belongs.
 *
 * ONLY `prisma/seed.ts` imports this file.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS FILE IS A CURATED LIST AND NOT A LOOP OVER THE FOLDER
 *
 * The filenames in `design-reference/images/` describe subjects the files do not
 * contain. Every one of the 27 was opened and looked at before this list was
 * written. A loop over the folder would have put a bedroom in the "kahwa" slot, a
 * car showroom photograph on the Executive Valley Suite, and a picture of the
 * resort on the "bonfire" tile.
 *
 * The rule: a Media row exists only where the photograph genuinely matches the
 * placement. Everything else is left unseeded so the owner uploads the real photo
 * through the admin panel, and the section renders cleanly empty in the meantime.
 * An empty slot is honest; a wrong photograph is a lie the client has to find.
 * ---------------------------------------------------------------------------
 */

export type SeedMedia = {
  /** File in `design-reference/images/`. */
  file: string;
  alt: string;
  placement:
    | "HERO"
    | "ROOM"
    | "TOUR"
    | "GALLERY"
    | "STORY"
    | "DINING"
    | "CTA"
    | "PAGE_HEADER"
    | "BRAND";
  /** Cloudinary folder. */
  folder: string;
  order: number;
  /** Gallery grid only. */
  tile?: "tall" | "wide" | "";
  /** PAGE_HEADER only: which inner page this photo heads. */
  pageKey?: "stays" | "tours" | "gallery" | "contact";
  /** Attach to this room/tour slug. */
  roomSlug?: string;
  tourSlug?: string;
};

/**
 * Files deliberately NOT seeded, and why. Kept in code so the reason survives —
 * the next person to look at the folder will otherwise "fix" the omission.
 */
export const REJECTED: { file: string; reason: string }[] = [
  { file: "story.jpg", reason: "Not an image — the file holds the Gallery HTML page" },
  { file: "room-executive.jpg", reason: "A Land Cruiser parked on a city street beside a billboard — not the resort, not the valley" },
  { file: "g5.jpg", reason: "Near-black night frame, no discernible subject" },
  { file: "g6.jpg", reason: "Washed-out grey mist, almost no contrast" },
  { file: "g3.jpg", reason: "Duplicate of hero-2.jpg (resort exterior)" },
  { file: "g4.jpg", reason: "Duplicate of cta.jpg (resort and stairs above the river)" },
  { file: "g8.jpg", reason: "Duplicate of g1.jpg (bedroom)" },
  { file: "bonfire.jpg", reason: "Duplicate of room-riverside.jpg, and shows the Taobat road sign — no bonfire anywhere in the delivery" },
  { file: "dining.jpg", reason: "A bedroom, near-duplicate of jeep-fleet.jpg — no food or dining-area photograph exists" },
  { file: "kahwa.jpg", reason: "A bedroom — no kahwa being served. Seeded to the gallery instead, where a bedroom is honest" },
  { file: "page-header.jpg", reason: "A bedroom, near-duplicate of kahwa.jpg" },
  { file: "tours-header.jpg", reason: "A bedroom, near-duplicate of tour-taobat.jpg" },
  { file: "tour-arangkel.jpg", reason: "Duplicate of hero-2.jpg — no Arang Kel photograph exists" },
  { file: "hero-3.jpg", reason: "A bedroom, not a third hero landscape. Seeded to the gallery instead; the third hero slide is left empty" },
];

/**
 * Hero slides. Only two photographs in the delivery work as a full-bleed hero:
 * the jeep in the valley and the resort exterior. The third slide is left empty
 * and the slider runs with two.
 */
const HERO: SeedMedia[] = [
  {
    file: "hero-1.jpg",
    alt: "A resort jeep and driver on the valley road below the pines",
    placement: "HERO",
    folder: "neelum/hero",
    order: 0,
  },
  {
    file: "hero-2.jpg",
    alt: "Neelum Resort Taobat from the lawn, the valley rising behind it",
    placement: "HERO",
    folder: "neelum/hero",
    order: 1,
  },
];

/**
 * Tours. There is not one photograph of Ratti Gali, Arang Kel or Baboon Valley in
 * the delivery, so those three carry a jeep photograph — the vehicle that takes
 * you there — and the alt text says so rather than implying a destination shot.
 *
 * Taobat Valley is the exception: `room-riverside.jpg` is the "Welcome to Taobat"
 * road sign under snow, which genuinely is the destination.
 */
const TOURS: SeedMedia[] = [
  {
    file: "room-riverside.jpg",
    alt: "The Welcome to Taobat road sign under snow, a jeep pulled up beside it",
    placement: "TOUR",
    folder: "neelum/tours",
    order: 0,
    tourSlug: "taobat-valley",
  },
  {
    file: "lounge.jpg",
    alt: "One of the resort jeeps on the valley track",
    placement: "TOUR",
    folder: "neelum/tours",
    order: 0,
    tourSlug: "arang-kel",
  },
  {
    file: "g7.jpg",
    alt: "A jeep climbing a snow-lined mountain track",
    placement: "TOUR",
    folder: "neelum/tours",
    order: 0,
    tourSlug: "ratti-gali-lake",
  },
  {
    file: "hero-1.jpg",
    alt: "A resort jeep and driver on the valley road",
    placement: "TOUR",
    folder: "neelum/tours",
    order: 0,
    tourSlug: "baboon-valley",
  },
];

/**
 * Rooms: nothing is seeded.
 *
 * Six bedroom photographs exist and all six are plausible, but nothing in the
 * delivery says which bedroom is the Deluxe Riverside and which is the Family
 * Hut. Guessing would put the wrong room on a booking page, which is worse than
 * an empty frame — so all four rooms show the neutral placeholder until the owner
 * uploads them from the admin panel.
 */
const ROOMS: SeedMedia[] = [];

/**
 * Gallery. Every genuine, non-duplicate photograph in the delivery, whatever its
 * filename claimed. A gallery needs no attribution, so bedrooms and exteriors are
 * all honest here.
 *
 * `tile` follows the reference's masonry rhythm — tall, wide, normal, normal.
 */
const GALLERY: SeedMedia[] = [
  { file: "cta.jpg", alt: "The resort above the river in evening light", tile: "tall" },
  { file: "tour-rattigali.jpg", alt: "The resort beside the Neelum, mist on the pines", tile: "wide" },
  { file: "g2.jpg", alt: "The timber veranda and sitting area", tile: "" },
  { file: "g1.jpg", alt: "A cedar-lined room looking onto the trees", tile: "" },
  { file: "tour-baboon.jpg", alt: "The resort and the river on a clear morning", tile: "" },
  { file: "room-family.jpg", alt: "The building above the water, pines across the valley", tile: "tall" },
  { file: "hero-2.jpg", alt: "The resort from the lawn", tile: "wide" },
  { file: "g7.jpg", alt: "A jeep on a snow-lined mountain track", tile: "" },
  { file: "jeep-fleet.jpg", alt: "A double room in cedar, warm light along the ceiling", tile: "tall" },
  { file: "room-deluxe.jpg", alt: "The length of the building from the riverbank", tile: "wide" },
  { file: "kahwa.jpg", alt: "A twin room with windows on two sides", tile: "" },
  { file: "tour-taobat.jpg", alt: "A twin room in cedar, morning sun across the floor", tile: "" },
  { file: "hero-3.jpg", alt: "A twin room looking into the pines", tile: "" },
  { file: "lounge.jpg", alt: "A resort jeep on the track through the village", tile: "" },
  { file: "room-riverside.jpg", alt: "The Welcome to Taobat sign under snow", tile: "" },
  { file: "hero-1.jpg", alt: "The driver and jeep on the valley road", tile: "" },
].map((item, index) => ({
  ...item,
  placement: "GALLERY" as const,
  folder: "neelum/gallery",
  order: index,
  tile: item.tile as "tall" | "wide" | "",
}));

/**
 * Page headers, one per inner route, in route order: stays, tours, gallery,
 * contact. All four are genuine resort or valley photographs.
 */
const PAGE_HEADERS: SeedMedia[] = (
  [
    { file: "hero-2.jpg", alt: "", order: 0, pageKey: "stays" },
    { file: "lounge.jpg", alt: "", order: 1, pageKey: "tours" },
    { file: "cta.jpg", alt: "", order: 2, pageKey: "gallery" },
    { file: "tour-rattigali.jpg", alt: "", order: 3, pageKey: "contact" },
  ] as const
).map((item) => ({
  ...item,
  placement: "PAGE_HEADER" as const,
  folder: "neelum/misc",
}));

/**
 * The closing band. `cta.jpg` is the strongest photograph in the delivery and it
 * is already the mood the band wants.
 */
const CTA: SeedMedia[] = [
  {
    file: "cta.jpg",
    alt: "",
    placement: "CTA",
    folder: "neelum/misc",
    order: 0,
  },
];

/**
 * STORY and DINING are empty on purpose.
 *
 * STORY: the only candidate was `story.jpg`, which is not an image at all.
 * DINING: there is no photograph of food, the kitchen or a dining area anywhere
 * in the delivery — the file named `dining.jpg` is a bedroom.
 *
 * BRAND: no logo, favicon or social image was delivered in any form, so all four
 * brand slots stay empty and the inline SVG fallback renders. That fallback is
 * exactly what it is for.
 */
const STORY: SeedMedia[] = [];
const DINING: SeedMedia[] = [];
const BRAND: SeedMedia[] = [];

export const mediaToSeed: SeedMedia[] = [
  ...HERO,
  ...ROOMS,
  ...TOURS,
  ...GALLERY,
  ...PAGE_HEADERS,
  ...CTA,
  ...STORY,
  ...DINING,
  ...BRAND,
];

/** Every placement the site reads, so the report can show the empty ones too. */
export const ALL_PLACEMENTS = [
  "HERO",
  "ROOM",
  "TOUR",
  "GALLERY",
  "STORY",
  "DINING",
  "CTA",
  "PAGE_HEADER",
  "BRAND",
] as const;
