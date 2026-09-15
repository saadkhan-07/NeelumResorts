# Neelum Resort Taobat — build brief for Claude Code

You are building the production website for **Neelum Resort Taobat**, a small riverside
resort at the end of Neelum Valley, Azad Kashmir. A completed static HTML design already
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
3. **No prices on the public site by default.** Room cards show "Rates on request".
   A `showPrice` boolean per room exists in the database so the owner can turn rates on
   later from the admin panel — it defaults to `false`.
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
| Hosting | Vercel | |
| Node | 20+ | Use `pnpm` |

Do not add a UI component library, a state manager, an animation library, or an image
library. The reference site is 14 KB of CSS and 140 lines of vanilla JS. Keep it that light.

---

## 3. Design source

```
design-reference/
├── index.html      home
├── rooms.html      stays
├── gallery.html    gallery + lightbox
├── contact.html    enquiry form + map
├── css/style.css   the entire design system — port this
└── js/main.js      slider, lightbox, WhatsApp links, scroll reveal
```

**Design tokens** (already defined at the top of `style.css`, keep the exact values):

```
--ink #141E1A   --pine #1D352D   --brass #BE9247   --brass-lt #D8B472
--sand #F4EFE6  --cream #FBF8F2  --body #54504A
Display font: Cormorant Garamond   Body font: Jost
```

**Homepage section order** — do not reorder:
hero slider → availability bar → story → stats band → stays → experiences grid →
dining → gallery → reviews → location + map → FAQ → dark CTA band → footer

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
  createdAt    DateTime  @default(now())
}

enum MediaType { IMAGE VIDEO }
enum Placement { HERO ROOM GALLERY STORY DINING CTA PAGE_HEADER BRAND }

model Enquiry {
  id        String        @id @default(cuid())
  name      String
  phone     String
  checkIn   DateTime?
  checkOut  DateTime?
  guests    String?
  message   String        @db.Text
  source    String                    // "bookbar" | "contact-form" | "room-card"
  status    EnquiryStatus @default(NEW)
  roomId    String?
  room      Room?         @relation(fields: [roomId], references: [id])
  createdAt DateTime      @default(now())
}

enum EnquiryStatus { NEW REPLIED CLOSED }

model Setting {
  key   String @id        // whatsapp, phone, address, heroHeadline, heroSub,
  value String @db.Text   // seasonBanner, instagram, facebook, tiktok, googleMapsUrl
}

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

### Brand assets (logo, favicon, social image)

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

## 6. WhatsApp flow

Three entry points, all ending in `wa.me`. The number comes from `Setting["whatsapp"]`.

| Source | Pre-filled message |
|---|---|
| Availability bar under the hero | check-in, check-out, guests, room |
| Room card / room detail | that room by name |
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
  future sessions inherit the rules.also saying that :" design-reference/ is the visual spec — read it before changing any layout."
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

### Phase 2 — Public pages, content hardcoded
- Build all four routes: `/`, `/stays`, `/stays/[slug]`, `/gallery`, `/contact`.
- Content lives in a single `src/content/seed.ts` file for now — no database yet.
- Hero slider, gallery masonry + lightbox, FAQ accordion (native `<details>`),
  availability bar, contact form. All WhatsApp links work.
- Add `/stays/[slug]` detail pages — the reference only has the combined list, so follow
  the same visual language for the detail layout.

**Done when:** every page matches the reference screenshots side by side, on desktop and
mobile, and Lighthouse mobile performance is ≥ 95 (no database or remote images yet).

### Phase 3 — Database
- Write `prisma/schema.prisma` from section 4. `prisma migrate dev`.
- Write `prisma/seed.ts` that loads `src/content/seed.ts` into the database, plus the
  default `Setting` rows and one `AdminUser` from env vars.
- Add `src/lib/db.ts` with the standard Prisma singleton (avoids connection exhaustion in
  dev hot-reload).
- Swap the public pages from `seed.ts` to database reads in Server Components. Add
  `export const revalidate = 3600`.

**Done when:** editing a row directly in the database and waiting for revalidation changes
the live page, and the pages still render if the database is empty (sensible fallbacks, no
crashes).

### Phase 4 — Cloudinary
- Build everything in section 5: the signing route, `lib/cloudinary.ts`, the custom
  `next/image` loader, `<CldImage>` and `<CldVideo>` components.
- Extend the seed to upload the placeholder images from `design-reference/images/` to
  Cloudinary so there is real data to work with.
- Public pages now render media from `Media` rows.
- Brand assets per section 5b: `logoUrl` / `faviconUrl` helpers, the `<Logo>` component
  that picks light or dark by header state, root-layout `generateMetadata` for the icons,
  and the inline-SVG fallback for every slot.

**Done when:** every image on the site is served from `res.cloudinary.com` with
`f_auto,q_auto`, the homepage is under 1.2 MB, and a hero video plays on desktop but shows
only the poster on a 390px viewport.

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

1. **Enquiries** — table (date, name, phone, dates, room, status). Row opens a detail
   panel with the full message, a **"Reply on WhatsApp"** button that opens `wa.me` with
   that guest's number, and a status dropdown. Filter by status. This screen is the one
   the owner will use daily; make it the best one.
2. **Rooms** — list with drag-to-reorder. Edit form with all fields, amenities as
   add/remove chips, photo manager (upload, reorder, set cover, delete), the
   "Show price on website" toggle, and a Published toggle.
3. **Gallery** — grid, multi-file upload with per-file progress, drag-to-reorder, inline
   alt text, tile size selector (`tall` / `wide` / normal), delete with confirmation.
4. **Branding** — four upload slots (`logo-light`, `logo-dark`, `favicon`, `og-image`),
   each showing the current asset with a Replace button and the recommended dimensions
   written next to it. Preview the logo on both a dark and a light strip so the client can
   see straight away if they uploaded the wrong variant. Accept SVG here, and only here.
5. **Settings** — WhatsApp number, phone, address, social links, hero headline and
   sub-line, Google Maps URL, and a **season banner**: free text that, when non-empty,
   renders a strip across the top of every public page (for "Road closed for winter —
   reopening May").
6. **Users** — OWNER role only. Add and remove staff accounts.

Every mutation is a server action that validates with Zod, checks the session, writes, then
calls `revalidatePath()`. Every destructive action asks for confirmation. Every form shows
a saving state and a success toast.

**Done when:** the entire public site can be changed without touching code, and reordering
photos on a phone works with touch drag.

### Phase 7 — Polish
- `generateMetadata` per page; Open Graph image from the `og-image` brand row, falling
  back to the first hero image.
- JSON-LD `Hotel` schema on the homepage with the real address, phone, geo coordinates
  (34.7247131, 74.7096112) and `aggregateRating` 4.9 / 705.
- `sitemap.ts`, `robots.ts`.
- Accessibility pass: keyboard-navigable lightbox and slider, visible focus rings, alt text
  everywhere, `aria-live` on form results, colour contrast checked against the brass on
  cream.
- Error and loading states: `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Rate-limit the enquiry endpoint (simple in-memory or Upstash) so the form cannot be
  spammed.

**Done when:** Lighthouse mobile hits the section 7 targets on every route.

### Phase 8 — Deploy and hand over
- Deploy to Vercel, connect Neon, set all env vars, run migrations against production.
- Point the domain, confirm HTTPS.
- Seed production with real content.
- Write `HANDOVER.md`: how to log in, how to add a room, how to upload photos, how to
  reply to an enquiry, what to do if something breaks. Written for the resort owner, not
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
