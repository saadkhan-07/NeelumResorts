import { cache } from "react";
import type { Placement, Prisma } from "@/generated/prisma/client";
import { contactFromEnv } from "./contact-env";
import { prisma } from "./db";

/**
 * Every read the public site performs. Pages call these; nothing in `src/` ever
 * touches `prisma/data.ts`, which exists only for the seed.
 *
 * Two rules hold for all of them:
 *
 * 1. **An empty table is not an error.** A fresh database, or content the owner has
 *    unpublished, returns `[]` or `null` — never a throw. The site must render on a
 *    database with nothing in it, which is also how it behaves the first time it is
 *    deployed and before the seed has run.
 * 2. **A failed query is not an error either.** If Postgres is unreachable mid-render
 *    the page still has to come back; `safe()` logs and falls through to the empty
 *    result so a dropped connection costs a section, not the whole site.
 *
 * Wrapped in React `cache()` so two components asking for the same rows in one render
 * share a single query.
 */

async function safe<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[queries] ${label} failed:`, error);
    return fallback;
  }
}

/* ------------------------------------------------------------------ rooms */

const roomWithPhotos = {
  photos: { where: { published: true }, orderBy: { order: "asc" } },
} satisfies Prisma.RoomInclude;

export type RoomWithPhotos = Prisma.RoomGetPayload<{ include: typeof roomWithPhotos }>;

/** Published rooms in the owner's order. `[]` when there are none. */
export const getRooms = cache(async (): Promise<RoomWithPhotos[]> =>
  safe(
    "getRooms",
    () =>
      prisma.room.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        include: roomWithPhotos,
      }),
    [],
  ),
);

/** One published room, or `null` — an unknown slug is a 404, not a crash. */
export const getRoom = cache(async (slug: string): Promise<RoomWithPhotos | null> =>
  safe(
    `getRoom(${slug})`,
    () =>
      prisma.room.findFirst({
        where: { slug, published: true },
        include: roomWithPhotos,
      }),
    null,
  ),
);

/* ------------------------------------------------------------------ tours */

/**
 * A tour's fares are filtered here, not in the page: `showPrice` is the master
 * switch from PROMPT.md § 5c, so a tour with it off comes back with an empty
 * `fares` array and renders "Fare agreed on WhatsApp" without the page having to
 * know the rule. Unpublished individual fares drop out the same way.
 */
const tourWithFares = {
  fares: { where: { published: true }, orderBy: { order: "asc" } },
  photos: { where: { published: true }, orderBy: { order: "asc" } },
} satisfies Prisma.TourInclude;

export type TourWithFares = Prisma.TourGetPayload<{ include: typeof tourWithFares }>;

function hideFaresWhenSwitchedOff(tour: TourWithFares): TourWithFares {
  return tour.showPrice ? tour : { ...tour, fares: [] };
}

/** Published tours in the owner's order. `[]` when there are none. */
export const getTours = cache(async (): Promise<TourWithFares[]> => {
  const rows = await safe<TourWithFares[]>(
    "getTours",
    () =>
      prisma.tour.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        include: tourWithFares,
      }),
    [],
  );
  return rows.map(hideFaresWhenSwitchedOff);
});

/** One published tour, or `null`. */
export const getTour = cache(async (slug: string): Promise<TourWithFares | null> => {
  const row = await safe<TourWithFares | null>(
    `getTour(${slug})`,
    () =>
      prisma.tour.findFirst({
        where: { slug, published: true },
        include: tourWithFares,
      }),
    null,
  );
  return row ? hideFaresWhenSwitchedOff(row) : null;
});

/* --------------------------------------------------------------- settings */

/**
 * Defaults for every key the site reads. A missing row must never render as
 * "undefined" or blank out the WhatsApp number, so `getSettings()` always returns
 * a complete object — on an empty database it returns exactly this.
 *
 * These mirror `prisma/data.ts`, deliberately duplicated rather than imported: that
 * file belongs to the seed alone. The contact numbers are the exception — they are
 * never written in code and come from RESORT_WHATSAPP / RESORT_PHONE /
 * RESORT_PHONE_DISPLAY (see `contact-env.ts`).
 */
const CONTACT = contactFromEnv();

export const SETTING_DEFAULTS = {
  whatsapp: CONTACT.whatsapp,
  phone: CONTACT.phone,
  phoneDisplay: CONTACT.phoneDisplay,
  address: "Neelum Valley Road, Taobat 13231\nAzad Jammu & Kashmir",
  googleMapsUrl: "https://maps.google.com/?q=Neelum+Resort+Taobat",
  heroHeadline: "Where the valley *ends*, and the quiet begins.",
  heroSub:
    "A riverside resort in Taobat — the last village in Neelum Valley. Cedar rooms, fresh trout, and a river you can hear from your bed.",
  seasonBanner: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  pickupPoints: "Muzaffarabad\nSharda\nKel\nTaobat",
  ratesUpdated: "",
  // The Google rating drifts; it was hardcoded as 4.9 / 705 in three places and
  // the real listing already reads 704. Editable in Settings now.
  ratingScore: "4.9",
  ratingCount: "704",
} as const;

export type SettingKey = keyof typeof SETTING_DEFAULTS;
export type Settings = Record<SettingKey, string>;

/** Every setting, with defaults filled in for rows that do not exist yet. */
export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await safe(
    "getSettings",
    () => prisma.setting.findMany(),
    [] as { key: string; value: string }[],
  );

  const stored = new Map(rows.map((row) => [row.key, row.value]));
  const settings = { ...SETTING_DEFAULTS } as Settings;

  for (const key of Object.keys(SETTING_DEFAULTS) as SettingKey[]) {
    const value = stored.get(key);
    if (value !== undefined) settings[key] = value;
  }

  // Every enquiry button on the site points at this number. Rule 1 above says a
  // bare database must still render, so this is a loud log rather than a throw.
  if (!settings.whatsapp) {
    console.error(
      "[settings] No WhatsApp number: the Setting row is missing and RESORT_WHATSAPP is not set.",
    );
  }

  return settings;
});

/** `pickupPoints` as a list. The selector appends "Somewhere else" itself. */
export function pickupPoints(settings: Settings): string[] {
  return settings.pickupPoints
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ media */

export type MediaRow = Prisma.MediaGetPayload<object>;

/** Published media for one placement, in order. `[]` when there is none. */
export const getMedia = cache(async (placement: Placement): Promise<MediaRow[]> =>
  safe(
    `getMedia(${placement})`,
    () =>
      prisma.media.findMany({
        where: { placement, published: true },
        orderBy: { order: "asc" },
      }),
    [],
  ),
);

/* ------------------------------------------------------------------ brand */

export type BrandKey = "logo-light" | "logo-dark" | "favicon" | "og-image";
export type Brand = Record<BrandKey, MediaRow | null>;

const EMPTY_BRAND: Brand = {
  "logo-light": null,
  "logo-dark": null,
  favicon: null,
  "og-image": null,
};

/**
 * The four BRAND rows, keyed by `brandKey`. Every slot is `null` until the owner
 * uploads it, and each caller falls back to the inline SVG mark — a fresh database
 * must not produce a broken image in the header. See PROMPT.md § 5b.
 */
export const getBrand = cache(async (): Promise<Brand> => {
  const rows = await safe(
    "getBrand",
    () =>
      prisma.media.findMany({
        where: { placement: "BRAND", published: true, brandKey: { not: null } },
      }),
    [] as MediaRow[],
  );

  const brand: Brand = { ...EMPTY_BRAND };
  for (const row of rows) {
    if (row.brandKey && row.brandKey in brand) {
      brand[row.brandKey as BrandKey] = row;
    }
  }
  return brand;
});

/* ---------------------------------------------------------------- reviews */

export type ReviewRow = Prisma.ReviewGetPayload<object>;

/**
 * Published guest reviews, in the owner's order.
 *
 * Empty is a normal state: the homepage drops the quote cards and keeps the
 * rating box, which links to the Google listing anyway. Better nothing than
 * three invented testimonials, which is what this replaced.
 */
export const getReviews = cache(async (): Promise<ReviewRow[]> =>
  safe(
    "getReviews",
    () =>
      prisma.review.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
    [],
  ),
);
