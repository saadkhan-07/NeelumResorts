# Neelum Resort Taobat — build brief for Claude Code

You are building the production website for **Neelum Resort Taobat**, a small riverside
resort at the end of Neelum Valley, Azad Kashmir, which also runs guided 4x4 jeep tours
to the lakes and valleys around it. A completed static HTML design already
exists in `design-reference/` — your job is to rebuild it as a Next.js application with a
database and an admin panel, without changing how it looks.

Work **one phase at a time**. At the end of each phase, stop, summarise what you did, and
wait. Do not start the next phase until told.

---

## 1. Non-negotiable rules

Break any of these and the work is wrong, however good the code is.

1. **No email. Anywhere.** No Resend, no Nodemailer, no SMTP, no "contact us" mailto.
   Every guest interaction goes to WhatsApp (`https://wa.me/<number>?text=<message>`).
   The only record of an enquiry is the row in the database.
2. **The design does not change.** `design-reference/` is the spec. Same colours, fonts,
   spacing, section order, wording. If a section looks different from the reference in the
   browser, it is a bug.
3. **Rooms show no prices; tours show fares only where one is published.** Room cards read
   "Rates on request" (`Room.showPrice` defaults to `false`). A tour never has a single
   price — fares live on `TourFare`, one per pick-up point, and a tour with none reads
   "Fare agreed on WhatsApp". Do not add a price field to `Tour`. See section 5c.
4. **No "Discounted Offers" section.** The reference site (roameoresorts.com) has one;
   ours deliberately does not. Do not add it back.
5. **Mobile first.** The owner runs the admin panel from a phone in a valley with weak
   signal. Guests browse on phones on mobile data. Every screen, admin included, must work
   at 360px wide.
6. **All media comes from Cloudinary, never from `/public`.** Images, videos, **the logo
   and the favicon** are uploaded through the admin panel, stored in Cloudinary, and only
   the Cloudinary public ID is saved in the database. Nothing visual is committed to the
   repo. There is no `/public/logo.svg` and no `/app/favicon.ico`.
7. **Never commit secrets.** `.env.local` stays out of git. Keep `.env.example` updated.

---

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript | Server Components by default |
| Styling | Plain CSS — port `design-reference/css/style.css` | **No Tailwind.** The CSS is already written and correct |
| Database | PostgreSQL on Neon | Free tier is sufficient |
| ORM | Prisma | |
| Media | Cloudinary | Images *and* video, signed direct upload from browser |
| Auth | Auth.js v5 (NextAuth), Credentials provider | 1–3 admin accounts, no OAuth |
| Validation | Zod | Every server action validates its input |
| Hosting | **Render** (Starter, Singapore region) | Vercel's free tier bars commercial use; Render Starter allows it and does not spin down |
| Node | 20+ | Use `pnpm` |

Do not add a UI component library, a state manager, an animation library, or an image
library. The reference site is 14 KB of CSS and 140 lines of vanilla JS. Keep it that light.

---

## 3. Design source

```
design-reference/
├── index.html      home
├── rooms.html      stays
├── tours.html      jeep tours — "how it works" strip, tour rows, fare table
├── gallery.html    gallery + lightbox
├── contact.html    enquiry form + map
├── css/style.css   the entire design system — port this
├── js/main.js      slider, lightbox, WhatsApp links, scroll reveal
└── images/         the resort's real photographs, already cropped to each slot
```

The reference already contains **every** page and section, jeep tours included, built with
the resort's real photographs. Nothing here is a description you have to interpret — open
the files in a browser and match what you see.

**Design tokens** (already defined at the top of `style.css`, keep the exact values):

```
--ink #141E1A   --pine #1D352D   --brass #BE9247   --brass-lt #D8B472
--sand #F4EFE6  --cream #FBF8F2  --body #54504A
Display font: Cormorant Garamond   Body font: Jost
```

**Homepage section order** — do not reorder:
hero slider → availability bar → story → stats band → stays → experiences grid →
**jeep tours** → dining → gallery → reviews → location + map → FAQ → dark CTA band → footer

**Navigation:** Home · Stays · Tours · Gallery · Contact

---

## 4. Data model

```prisma
model Room {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  tagline     String              // the small tag on the card: "Most booked"
  shortDesc   String              // card text
  longDesc    String   @db.Text   // detail page text
  guests      String              // "2 guests"
  beds        String              // "1 queen bed"
  sizeSqft    String?             // "220 sq ft"
  view        String              // "River-facing"
  amenities   String[]            // bullet list on the detail page
  price       Int?                // PKR per night, nullable
  showPrice   Boolean  @default(false)
  order       Int      @default(0)
  published   Boolean  @default(true)
  photos      Media[]
  enquiries   Enquiry[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Tour {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String              // "Ratti Gali Lake", "Arang Kel"
  tagline     String              // card tag: "Most popular", "Full day"
  shortDesc   String              // card text
  longDesc    String   @db.Text   // detail page text
  season      String?             // "Open late June – September"
  difficulty  String?             // "Jeep track, then a 45-min walk"
  travelNote  String?             // "About 3 hrs from Kel, a full day from Muzaffarabad"
  highlights  String[]            // what you see
  includes    String[]            // driver, fuel, waiting time…
  showPrice   Boolean  @default(false)  // master switch for this tour's published fares
  order       Int      @default(0)
  published   Boolean  @default(true)
  fares       TourFare[]
  photos      Media[]
  enquiries   Enquiry[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// A published fare for ONE pick-up point on ONE tour. Most tours have none — their fare is
// agreed on WhatsApp. A Tour itself never carries a single price: it depends on the pick-up.
model TourFare {
  id         String   @id @default(cuid())
  tourId     String
  tour       Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)
  pickupName String                        // "Kel", "Sharda" — plain text, no separate model
  priceMin   Int                           // PKR, per jeep
  priceMax   Int?                          // null = a single fixed price, not a range
  note       String?                       // "Varies with season and road condition"
  order      Int      @default(0)
  published  Boolean  @default(true)
  updatedAt  DateTime @updatedAt
}

model Media {
  id           String    @id @default(cuid())
  publicId     String                 // Cloudinary public_id — the only thing we store
  type         MediaType @default(IMAGE)
  width        Int
  height       Int
  duration     Float?                 // seconds, video only
  alt          String    @default("")
  placement    Placement              // where it appears on the site
  brandKey     String?   @unique      // BRAND only: logo-light | logo-dark | favicon | og-image
  tile         String    @default("") // gallery grid: "tall" | "wide" | ""
  order        Int       @default(0)
  published    Boolean   @default(true)
  roomId       String?
  room         Room?     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  tourId       String?
  tour         Tour?     @relation(fields: [tourId], references: [id], onDelete: Cascade)
  createdAt    DateTime  @default(now())
}

enum MediaType { IMAGE VIDEO }
enum Placement { HERO ROOM TOUR GALLERY STORY DINING CTA PAGE_HEADER BRAND }

model Enquiry {
  id        String        @id @default(cuid())
  name      String
  phone     String
  checkIn   DateTime?
  checkOut  DateTime?
  guests    String?
  message   String        @db.Text
  kind      EnquiryKind   @default(STAY)
  source    String                    // "bookbar" | "contact-form" | "room-card" | "tour-card"
  status    EnquiryStatus @default(NEW)
  roomId    String?
  room      Room?         @relation(fields: [roomId], references: [id])
  tourId    String?
  tour      Tour?         @relation(fields: [tourId], references: [id])
  pickupPoint String?               // the pick-up the guest chose, as plain text
  createdAt DateTime      @default(now())
}

enum EnquiryKind { STAY TOUR }

enum EnquiryStatus { NEW REPLIED CLOSED }

model Setting {
  key   String @id        // whatsapp, phone, address, heroHeadline, heroSub, seasonBanner,
  value String @db.Text   // instagram, facebook, tiktok, googleMapsUrl,
}                         // pickupPoints (one place name per line), ratesUpdated

model AdminUser {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String
  name         String
  role         Role   @default(STAFF)
  createdAt    DateTime @default(now())
}

enum Role { OWNER STAFF }
```

---

## 5. The media pipeline

This is the part that matters most. Get it wrong and the site is slow on mobile data.

### Upload (admin → Cloudinary → database)

1. Admin picks a file in the browser.
2. Browser calls `POST /api/cloudinary/sign` — a server route that returns a **signed
   upload payload** (timestamp + signature, generated with `CLOUDINARY_API_SECRET`).
   The secret never reaches the browser.
3. Browser uploads **directly to Cloudinary**, showing a progress bar. The file never
   passes through our server — a 200 MB video would time out a serverless function.
4. Cloudinary responds with `public_id`, `width`, `height`, `duration`, `resource_type`.
5. Browser calls a server action that saves a `Media` row with those values.

Upload preset: folder `neelum/`, `unique_filename: true`, `overwrite: false`.
Accept `image/jpeg, image/png, image/webp, video/mp4, video/quicktime`.
Reject images over 25 MB and videos over 200 MB client-side, with a clear message.

### Delivery (database → page)

Never store a full URL in the database. Build it at render time:

```ts
// lib/cloudinary.ts
export function imageUrl(publicId: string, width: number) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,c_fill,w_${width}/${publicId}`
}
export function videoUrl(publicId: string) {
  return `https://res.cloudinary.com/${CLOUD}/video/upload/f_auto,q_auto,vc_auto/${publicId}.mp4`
}
export function posterUrl(publicId: string, width = 1600) {
  return `https://res.cloudinary.com/${CLOUD}/video/upload/so_0,f_auto,q_auto,w_${width}/${publicId}.jpg`
}
```

`f_auto,q_auto` is what turns the owner's 6 MB phone photo into a ~120 KB WebP. It is not
optional.

**Images:** use `next/image` with a custom Cloudinary loader so `srcSet` and lazy loading
come for free. Hero images get `priority`; everything else lazy-loads. Every image carries
its real `width`/`height` from the database so nothing shifts while loading.

**Video — read this carefully:**

- Autoplay background video on **desktop only**. On screens under 900px, or when
  `navigator.connection.saveData` is true, render the poster image instead and do not
  download the video at all. Guests here are on valley mobile data.
- `<video muted playsInline loop preload="none" poster={posterUrl(id)} />`, and only set
  `src` after the component mounts and the desktop check passes.
- Cap hero video at 12 seconds. Longer clips belong in the gallery, behind a click.

---

## 5b. Brand assets (logo, favicon, social image)

Four `Media` rows with `placement: BRAND`, each identified by `brandKey`:

| `brandKey` | Used for | Upload as |
|---|---|---|
| `logo-light` | Header over the hero, and the footer — both dark backgrounds | PNG or SVG, transparent, light/white mark |
| `logo-dark` | Header once it turns solid, and any light background | PNG or SVG, transparent, dark mark |
| `favicon` | Browser tab, phone home screen | Square PNG, 512×512, transparent |
| `og-image` | WhatsApp / Facebook link previews | JPG or PNG, 1200×630 |

Two logo files, not one. The current design flips the logo colour as the header goes from
transparent to solid; once it is an uploaded image rather than inline SVG, that needs two
assets. Tell the client this when you ask for the logo.

**Delivery rules:**

```ts
// SVG: deliver raw, no transformations — transforming an SVG rasterises it
export function logoUrl(m: Media) {
  return m.format === 'svg'
    ? `https://res.cloudinary.com/${CLOUD}/image/upload/fl_sanitize/${m.publicId}.svg`
    : `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,h_80/${m.publicId}`
}
// Favicon: force PNG. f_auto would serve WebP, which older browsers reject as an icon
export function faviconUrl(publicId: string, size: number) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/c_pad,b_transparent,w_${size},h_${size},f_png/${publicId}`
}
```

Always pass `fl_sanitize` on SVG uploads — an SVG is executable markup and the admin panel
accepts files from a non-technical user.

**Wiring the favicon.** There is no `app/favicon.ico`. The root layout's
`generateMetadata` reads the brand rows through a cached query and returns:

```ts
icons: {
  icon: [{ url: faviconUrl(id, 32), sizes: '32x32', type: 'image/png' },
         { url: faviconUrl(id, 192), sizes: '192x192', type: 'image/png' }],
  apple: [{ url: faviconUrl(id, 180), sizes: '180x180' }],
}
```

Wrap the brand query in React `cache()` + `unstable_cache` so it runs once per build, not
once per page.

**Two things that will otherwise waste an afternoon:**

- Browsers cache favicons far more aggressively than anything else. After the client
  uploads a new one they will swear it did not work. Append `?v=<media.updatedAt>` to the
  favicon URLs so a change busts the cache, and say so in `HANDOVER.md`.
- **Every brand slot needs a code fallback.** If no row exists, render the inline SVG mark
  from `design-reference` and a default favicon. A fresh database, or a deleted row, must
  never produce a broken image in the header.

---

## 5c. Jeep tours

The resort's second business. They run 4x4 jeeps with a driver along the whole Neelum
Valley road, and **the guest chooses where to be picked up** — anywhere from Muzaffarabad
at the bottom of the valley to Taobat at the top. The fare depends on that starting point,
so the site uses a **mixed model**, and the mix itself is the message:

- **Routes the resort runs regularly get a published fare.** Today that is Taobat Valley
  from Kel and from Sharda. Showing them proves the operation is real and priced honestly.
- **Everything else says the fare is quoted on WhatsApp.** Not because it is a secret, but
  because it genuinely depends on where the guest starts.

Both must be framed as a deliberate choice, never as a gap. The copy says *why*:

> We publish fares for the routes we run every week. For anywhere else, tell us where
> you're starting from and we'll quote you the same day.

**Destinations to seed** — Ratti Gali Lake, Arang Kel, Baboon Valley, Taobat Valley.
**Fares to seed** — Taobat Valley only, and these are the client's real numbers:

| Tour | Pick-up | Fare (PKR, per jeep) |
|---|---|---|
| Taobat Valley | Kel | 14,000 – 16,000 |
| Taobat Valley | Sharda | 20,000 – 22,000 |

Everything else in the seed is placeholder copy to be confirmed.

### Rules specific to fares

- **A `Tour` has no price field.** Prices live on `TourFare`, one row per pick-up point.
  A tour with no fare rows shows "Fare agreed on WhatsApp". Do not add `Tour.price`.
- **Price per jeep, not per person.** Jeep hire in Azad Kashmir is quoted per vehicle.
  Every fare renders as "PKR 14,000–16,000 **per jeep** (up to 6)". Show a per-jeep figure
  as per-person and the resort looks absurdly expensive; the reverse and they lose money.
- **A range must always carry its reason.** Never render "PKR 14,000–16,000" alone — show
  the `note` beside it ("varies with season and road condition"). A range without a reason
  reads as "we charge what we think you'll pay"; a range with one reads as honesty.
- **`Setting["ratesUpdated"]`** holds a month and year ("September 2026") and renders as a
  muted line under any fare list: *"Fares last updated September 2026."* Fuel prices move;
  this protects the owner from being held to a stale number and signals the site is looked
  after.
- **`Tour.showPrice`** is the master switch, same as rooms. Off hides every fare for that
  tour and falls back to "Fare agreed on WhatsApp" — one toggle when fuel prices jump.
- `priceMax` is nullable. Null means a single fixed price, rendered without a dash.

### What the card shows

| State | Card price area |
|---|---|
| `showPrice` on, fares exist | Up to two fares as compact lines — `Kel · PKR 14,000–16,000` / `Sharda · PKR 20,000–22,000` — then `+2 more pick-up points` if there are more |
| `showPrice` off, or no fares | **Fare agreed on WhatsApp** — pick-up from anywhere in the valley |

The detail page shows the full fare list as a small table, followed by the line:
*"Starting somewhere else? Tell us where you are and we'll quote you."*

### The "How it works" strip

`/tours` opens with a three-step strip above the tour grid. This is the part of the page
that does the actual work, so give it real prominence:

```
1  Pick where you want to go     2  Tell us where you are       3  We confirm on WhatsApp
   Lakes, meadows and valleys       We run jeeps the length        Published fares for our
   across Neelum.                   of the valley — Muzaffarabad   regular routes, a same-day
                                    to Taobat.                     quote for anywhere else.
```

Repeat the middle idea as one line under the tours section on the homepage. Guests who
assume every tour starts at the resort are the ones who never message.

### The pick-up selector

On each tour card and detail page, a plain `<select>` labelled **"Where should we pick you
up?"**, populated from `Setting["pickupPoints"]` with a final "Somewhere else" option. It
changes nothing on the page — it only composes the WhatsApp message. No price updates, no
fetching, no loading state.

### Other rules

- **Season matters more than for rooms.** Ratti Gali is snowbound most of the year. The
  `season` field shows on the card, and a tour can be unpublished out of season without
  being deleted.
- **Duration is a rough note, not a promise.** `travelNote` holds "About 3 hrs from Kel,
  a full day from Muzaffarabad". Never render one authoritative duration on a tour card.
- Enquiries from a tour set `kind: TOUR`, `tourId` and `pickupPoint` (plain text).

### Routes

```
/tours            "How it works" strip + all published tours, ordered by `order`
/tours/[slug]     detail: gallery, highlights, includes, fare table, pick-up selector, CTA
```

The homepage section shows the first three tours as cards plus a "See all tours" link.

### WhatsApp message for a tour

```
Assalam o Alaikum! I'd like to ask about the <tour name> jeep tour.

Pick-up from: <selected point, or "Somewhere else">
Preferred date: <date, if given>
People: <n>

Could you let me know availability and the fare from there? Thank you.
```

---

## 6. WhatsApp flow

Three entry points, all ending in `wa.me`. The number comes from `Setting["whatsapp"]`.

| Source | Pre-filled message |
|---|---|
| Availability bar under the hero | check-in, check-out, guests, room |
| Room card / room detail | that room by name |
| Tour card / tour detail | that tour by name, the chosen pick-up point, date and party size |
| Contact form | name, phone, dates, guests, message |

**The popup-blocker gotcha — do it this way:**

```ts
function onSubmit(e) {
  e.preventDefault()
  const url = buildWaUrl(formData)
  window.open(url, '_blank')                    // synchronous, inside the click — survives
  saveEnquiry(formData)                          // fire-and-forget server action
}
```

Opening the window *after* an `await` gets blocked by Safari and Chrome. Open first, save
second. If the save fails, the guest still reaches WhatsApp — that is the priority.

A floating WhatsApp button sits bottom-right on every page, including admin-free pages.

---

## 7. Performance budget

Check these at the end of every phase from Phase 2 onward.

- Lighthouse mobile: **Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95**
- LCP under 2.5s on simulated Slow 4G
- CLS under 0.05 — every image and video box has a reserved aspect ratio
- Homepage total transfer under **1.2 MB** including images
- Public pages are statically rendered with ISR (`export const revalidate = 3600`).
  A guest hitting the homepage should not touch the database.
- After any admin save, call `revalidatePath()` for the affected routes so edits appear
  within seconds without losing the static cache.
- Fonts: `next/font/google` with `display: 'swap'` and a preload of the two weights
  actually used. No font file over 40 KB.

---

## 8. Phases

### Phase 0 — Setup
- `pnpm create next-app` (TypeScript, App Router, `src/`, no Tailwind, no ESLint prompt spam).
- Install: `prisma @prisma/client next-auth@beta bcryptjs zod cloudinary`.
- Create `CLAUDE.md` at the repo root summarising sections 1, 2 and 7 of this brief, so
  future sessions inherit the rules.
- Create `.env.example` with every variable from section 9.
- `git init`, first commit.

**Done when:** `pnpm dev` serves the default page and `CLAUDE.md` exists.

### Phase 1 — Design system and layout shell
- Port `design-reference/css/style.css` into `src/styles/global.css` unchanged except for
  font declarations, which move to `next/font`.
- Build `<Header>`, `<MobileNav>`, `<Footer>`, `<WhatsAppFloat>`, `<Button>`,
  `<Eyebrow>`, `<SectionHead>` as components. Header still goes transparent over the hero
  and solid on scroll.
- Port the scroll-reveal IntersectionObserver as a small `useReveal` hook. Respect
  `prefers-reduced-motion`.

**Done when:** an empty page renders with a working header and footer, identical to the
reference at 1440px and 390px.

### Phase 2 — Database first

Nothing renders in this phase. The database exists before any page does, so no page is
ever built against temporary data and no page has to be rewritten later.

- Write `prisma/schema.prisma` from section 4. `prisma migrate dev`.
- `src/lib/db.ts` with the standard Prisma singleton (avoids connection exhaustion in
  dev hot-reload).
- `prisma/data.ts` — the real content as typed objects matching the Prisma models
  exactly: four rooms, four tours, the `Setting` rows (including `pickupPoints` and
  `ratesUpdated`). **Only `prisma/seed.ts` ever imports this file.** No page, ever.
- `prisma/seed.ts` writes it all to the database, plus one `AdminUser` from env vars.
  - Rooms seed with `showPrice: false`.
  - Taobat Valley seeds with `showPrice: true` and its two real fares: Kel
    14,000–16,000 and Sharda 20,000–22,000, per jeep, note "Varies with season and road
    condition".
  - The other three tours seed with no fares, so both the priced and the "quote on
    WhatsApp" paths exist from day one.
- Write `src/lib/queries.ts`: `getRooms()`, `getRoom(slug)`, `getTours()`,
  `getTour(slug)`, `getSettings()`, `getMedia(placement)`, `getBrand()`. Every one
  returns a sensible empty result rather than throwing when the table is empty.

**Done when:** `prisma studio` shows the seeded rows, and every function in
`queries.ts` returns the right shape — including against an empty database.

### Phase 3 — Public pages, reading from the database

- Build all routes: `/`, `/stays`, `/stays/[slug]`, `/tours`, `/tours/[slug]`,
  `/gallery`, `/contact`.
- **Every page is a Server Component calling `queries.ts` from its first line.** There is
  no hardcoded content step and no temporary data file in `src/`.
- `export const revalidate = 3600` on every public route.
- Open each page in `design-reference/` and match it. Everything is already designed,
  jeep tours included — do not invent layouts.
- Hero slider, availability bar, gallery masonry + lightbox, FAQ accordion (native
  `<details>`), contact form, the tours "how it works" strip.
- `<PriceTag>` (rooms only), `<FareList>` (a tour's published fares, card and detail
  variants), `<PickupSelect>` — a client component that only composes the WhatsApp
  message; it must not change prices or fetch anything.
- Images still come from `design-reference/images/` in this phase. Cloudinary is Phase 4.

**Done when:** every page matches the reference side by side on desktop and mobile,
editing a row in `prisma studio` changes the live page after revalidation, the pages
render without crashing on an empty database, and Lighthouse mobile performance is ≥ 95.

### Phase 4 — Cloudinary
- Build everything in section 5: the signing route, `lib/cloudinary.ts`, the custom
  `next/image` loader, `<CldImage>` and `<CldVideo>` components.
- Extend `prisma/seed.ts` to upload `design-reference/images/` to Cloudinary into folders
  `neelum/rooms/`, `neelum/tours/`, `neelum/gallery/` and `neelum/brand/`. Pages then read
  media through `queries.ts` like everything else.
- **Seed only what is correct.** Write a `Media` row only where the photograph genuinely
  matches its placement. Several files in `design-reference/images/` fill a slot with the
  wrong subject because there were not enough photographs: `bonfire.jpg` is the resort
  building, `kahwa.jpg` is a bedroom, `dining.jpg` is the courtyard, and `hero-3.jpg`
  duplicates `story.jpg`. Do not seed those. The three tours other than Taobat have a jeep
  photo only — no destination photography exists yet.
- **Every unseeded section degrades gracefully**, because the client fills these in from
  the admin panel later and a wrong photo is worse than none:
  - Hero with fewer than three slides runs with what exists, dots matching the real count;
    with none, a solid `--pine` background behind the headline.
  - A room or tour with no photo shows a neutral `--sand` block in the image area — never
    a broken image, never a collapsed layout.
  - A gallery with no media does not render the section at all.
  - A brand slot with no media uses the inline SVG fallback.
- Print a table of every placement, whether it was seeded, and from which file. That table
  is the photography request list for the client.
- Public pages now render media from `Media` rows, rooms and tours alike
  (`placement: ROOM` / `placement: TOUR`).
- Brand assets per section 5b: `logoUrl` / `faviconUrl` helpers, the `<Logo>` component
  that picks light or dark by header state, root-layout `generateMetadata` for the icons,
  and the inline-SVG fallback for every slot.

**Done when:** every image on the site is served from `res.cloudinary.com` with
`f_auto,q_auto`, the homepage is under 1.2 MB, a hero video plays on desktop but shows
only the poster on a 390px viewport, and every unseeded section renders cleanly at both
1440px and 390px.

### Phase 5 — Auth and admin shell
- Auth.js with Credentials, bcrypt password hashes, JWT sessions.
- `middleware.ts` protects everything under `/admin` except `/admin/login`.
- Admin layout: sidebar on desktop, bottom tab bar on mobile. Its own stylesheet —
  functional and dense, not the marketing design.
- `/admin` dashboard: new enquiry count, five most recent enquiries, quick upload button.

**Done when:** a logged-out visitor to `/admin/rooms` lands on the login page, and the
admin shell is usable one-handed at 360px.

### Phase 6 — Admin CRUD
Build in this order, each one complete before the next:

1. **Enquiries** — table (date, name, phone, dates, room *or* tour + pick-up point,
   status). Row opens a
   detail panel with the full message, a **"Reply on WhatsApp"** button that opens `wa.me`
   with that guest's number, and a status dropdown. Filter by status **and by kind
   (stays / tours)**, since they are two different businesses with different lead times.
   This screen is the one the owner will use daily; make it the best one.
2. **Rooms** — list with drag-to-reorder. Edit form with all fields, amenities as
   add/remove chips, photo manager (upload, reorder, set cover, delete), the
   "Show price on website" toggle, and a Published toggle.
3. **Tours** — the same screen as Rooms, different fields: destination name, season,
   difficulty, travel note, highlights and includes as chip lists, photo manager, Published
   toggle, drag-to-reorder. **No single price field on the tour** — if one appears, section
   5c has been misread.
   Inside the tour form, a small repeatable **Fares** list: pick-up name, min price, max
   price (optional), note, published — with an "Add pick-up" button and drag-to-reorder.
   Four fields in a row, not a separate screen; most tours will have none. Above it, the
   "Show fares on website" master toggle. Share the form components with Rooms.
4. **Gallery** — grid, multi-file upload with per-file progress, drag-to-reorder, inline
   alt text, tile size selector (`tall` / `wide` / normal), delete with confirmation.
5. **Branding** — four upload slots (`logo-light`, `logo-dark`, `favicon`, `og-image`),
   each showing the current asset with a Replace button and the recommended dimensions
   written next to it. Preview the logo on both a dark and a light strip so the client can
   see straight away if they uploaded the wrong variant. Accept SVG here, and only here.
6. **Settings** — WhatsApp number, phone, address, social links, hero headline and
   sub-line, Google Maps URL, **pick-up points** (a textarea, one place name per line, which
   populates the selector on every tour), **rates last updated** (a month and year shown
   under every fare list) and a **season banner**: free text that, when
   non-empty, renders a strip across the top of every public page (for "Road closed for
   winter — reopening May").
7. **Users** — OWNER role only. Add and remove staff accounts.

Every mutation is a server action that validates with Zod, checks the session, writes, then
calls `revalidatePath()`. Every destructive action asks for confirmation. Every form shows
a saving state and a success toast.

**Done when:** the entire public site can be changed without touching code, adding a new
pick-up point takes one line in Settings, and reordering photos on a phone works with touch
drag.

### Phase 7 — Polish
- `generateMetadata` per page; Open Graph image from the `og-image` brand row, falling
  back to the first hero image.
- JSON-LD `Hotel` schema on the homepage with the real address, phone, geo coordinates
  (34.7247131, 74.7096112) and `aggregateRating` 4.9 / 705. Add `TouristTrip` schema on
  each tour detail page, with an `Offer` carrying `priceSpecification` for each published
  fare and no offer at all where the fare is quoted on WhatsApp. These pages are the site's
  best shot at ranking for "jeep to Taobat from Kel" and similar, which is real search
  traffic the resort gets none of today.
- `sitemap.ts`, `robots.ts`.
- Accessibility pass: keyboard-navigable lightbox and slider, visible focus rings, alt text
  everywhere, `aria-live` on form results, colour contrast checked against the brass on
  cream.
- Error and loading states: `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Rate-limit the enquiry endpoint (simple in-memory or Upstash) so the form cannot be
  spammed.

**Done when:** Lighthouse mobile hits the section 7 targets on every route.

### Phase 8 — Deploy and hand over
- Deploy to Render (Starter, Singapore), connect Neon **in the same region**, set all env
  vars, run migrations against production.
- Point the domain, confirm HTTPS.
- Seed production with real content.
- Write `HANDOVER.md`: how to log in, how to add a room, how to add a tour, how to change a
  published fare, how to add a pick-up point, how to turn prices on or off, how to upload photos, how to reply to an enquiry, how to unpublish a
  tour when the pass closes, what to do if something breaks. Written for the resort owner, not
  for a developer. Keep it under two pages.

**Done when:** the client can log in on their own phone and change a photo unaided.

---

## 9. Environment variables

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=
```

## 10. Commands

```
pnpm dev                  # develop
pnpm build                # must pass before any phase is "done"
pnpm prisma migrate dev
pnpm prisma studio
pnpm prisma db seed
```

---

## How to start

> Read `PROMPT.md`. Confirm you understand the non-negotiable rules in section 1, then do
> **Phase 0 only**. Stop when it is done and show me what you built.
