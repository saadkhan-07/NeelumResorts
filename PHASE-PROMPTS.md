# Neelum Resort — phase prompts for Claude Code

Paste these into Claude Code **one at a time**, in order. Don't paste the next one until
the previous phase is finished and you've looked at it yourself.

`PROMPT.md` is the full brief and sits at the repo root. Every prompt below points back at
it, so you never have to re-explain the project.

**The database comes before the pages.** Nothing is ever hardcoded into a page, and no
page gets rewritten later to "switch to the database":

| Phase | What happens |
|---|---|
| 2 | Schema, migration and seed. **Neon holds the content before any page exists** |
| 3 | Every page built as a Server Component reading from Neon, from its first line |
| 4 | Media moves to Cloudinary, still read through the same queries |
| 6 | The client edits all of it in the admin panel |

The only file holding content as code is `prisma/data.ts`, and the only thing that ever
reads it is `prisma/seed.ts`. No page imports it.

**Repo layout before you start:**

```
neelum-resort/
├── PROMPT.md           the full brief
├── PHASE-PROMPTS.md    this file
└── design-reference/   the finished static design — unzip it here
```

---

## Prompt 0 — Setup

```
Read PROMPT.md in full, then read design-reference/index.html and
design-reference/css/style.css so you know what we're building.

Confirm back to me, in your own words, the seven non-negotiable rules in section 1.
If you can't state all seven, re-read before continuing.

Then do Phase 0 only:
- Scaffold Next.js 15 with TypeScript, App Router, src/ directory, no Tailwind.
- Install: prisma, @prisma/client, next-auth@beta, bcryptjs, zod, cloudinary.
- Write CLAUDE.md at the repo root summarising sections 1, 2 and 7 of PROMPT.md,
  plus one line saying design-reference/ is the visual spec and must be opened
  before any layout work.
- Write .env.example with every variable from section 9.
- git init and make the first commit.

Stop there. Show me CLAUDE.md and the folder structure. Do not start Phase 1.
```

---

## Prompt 1 — Design system and layout shell

```
Phase 1 from PROMPT.md.

Port design-reference/css/style.css into src/styles/global.css. Change nothing except
the font declarations, which move to next/font/google (Cormorant Garamond + Jost,
display: swap).

Build as components: Header, MobileNav, Footer, WhatsAppFloat, Button, Eyebrow,
SectionHead. The header must still be transparent over the hero and turn solid on
scroll, exactly as design-reference/js/main.js does it.

Port the scroll-reveal IntersectionObserver as a useReveal hook. Respect
prefers-reduced-motion.

Done when an otherwise empty page renders with a working header and footer that I
cannot tell apart from the reference at 1440px and at 390px.

Stop there and show me both widths.
```

---

## Prompt 2 — Database first

```
Phase 2 from PROMPT.md. Nothing renders in this phase — we build the database before
any page, so no page is ever written against temporary data.

- prisma/schema.prisma exactly as PROMPT.md section 4 specifies. Run prisma migrate dev
  against Neon.
- src/lib/db.ts with the standard Prisma singleton.
- prisma/data.ts — the real content as typed objects matching the Prisma models exactly:
  four rooms, four tours, and the Setting rows including pickupPoints and ratesUpdated.
  ONLY prisma/seed.ts imports this file. No page ever imports it.
- prisma/seed.ts writes it to the database, plus one AdminUser from env vars.
  - Rooms seed with showPrice: false.
  - Taobat Valley seeds with showPrice: true and its two real fares:
    Kel 14,000–16,000 and Sharda 20,000–22,000, per jeep,
    note "Varies with season and road condition".
  - The other three tours seed with no fares, so both the priced and the
    "quote on WhatsApp" paths exist from day one.
- src/lib/queries.ts: getRooms, getRoom(slug), getTours, getTour(slug), getSettings,
  getMedia(placement), getBrand. Every one returns an empty result rather than throwing
  when the table is empty — the site must never crash on a fresh database.

Done when prisma studio shows the seeded rows and every query returns the right shape,
including against an empty database.

Stop there. Show me the schema and the output of prisma studio.
```

---

## Prompt 3 — Public pages, reading from the database

```
Phase 3 from PROMPT.md.

Routes: /, /stays, /stays/[slug], /tours, /tours/[slug], /gallery, /contact

Every page is a Server Component that calls src/lib/queries.ts from its first line.
There is no hardcoded content anywhere in src/. If you find yourself typing a room
name into a component, stop — it belongs in the database.

Add export const revalidate = 3600 to every public route.

Open each page in design-reference/ and match it. Everything is already designed,
including the jeep tours — do not invent layouts.

Build:
- Hero slider, availability bar, gallery masonry + lightbox, FAQ accordion
  (native <details>), contact form.
- The tours "how it works" three-step strip.
- PriceTag (rooms only), FareList (a tour's published fares — card and detail
  variants), PickupSelect (a client component that ONLY composes the WhatsApp
  message; it must not change prices or fetch anything).
- Every WhatsApp link working, per PROMPT.md section 6.

Remember: window.open fires synchronously inside the click handler, before any
await, or Safari blocks it.

Images still come from design-reference/images/ this phase. Cloudinary is Phase 4.

Done when every page matches the reference on desktop and mobile, editing a row in
prisma studio changes the page after revalidation, an empty database renders without
crashing, and Lighthouse mobile performance is 95+.

Stop there. Show me / and /tours at both widths, and prove the prisma studio edit
reaches the page.
```

---

## Prompt 4 — Cloudinary

```
Phase 4 from PROMPT.md, sections 5 and 5b. This is the phase that decides whether
the site is fast on mobile data, so do not cut corners.

- POST /api/cloudinary/sign returning a signed upload payload. The API secret never
  reaches the browser.
- lib/cloudinary.ts: imageUrl, videoUrl, posterUrl, logoUrl, faviconUrl.
  f_auto,q_auto on everything except favicons, which force f_png. SVG is delivered
  raw with fl_sanitize and no other transformation.
- A custom next/image loader for Cloudinary, plus CldImage and CldVideo.
- Video: autoplay on desktop only. Under 900px, or when navigator.connection.saveData
  is set, render the poster and never download the video.
- Brand assets: the Logo component switching light/dark by header state, root-layout
  generateMetadata for the icons with ?v=<updatedAt> cache busting, and an inline-SVG
  fallback for every brand slot so an empty database never shows a broken image.
- Extend the seed to upload design-reference/images/ into Cloudinary folders
  neelum/rooms/, neelum/tours/, neelum/gallery/, neelum/brand/.

SEED ONLY WHAT IS CORRECT. Write a Media row only where the photograph genuinely
matches its placement. Leave every other slot unseeded — the client uploads the real
photo through the admin panel in Phase 6, and an empty section must render cleanly,
never with a wrong picture standing in.

Specifically, do NOT seed these — the files exist but show the wrong subject:
  bonfire.jpg   is the resort building, not a bonfire
  kahwa.jpg     is a bedroom, not kahwa being served
  dining.jpg    is the outdoor courtyard, not food or the dining area
  hero-3.jpg    is the same photograph as story.jpg, cropped differently — seed
                story.jpg only, and leave the third hero slide unseeded
Also leave the Ratti Gali, Arang Kel and Baboon Valley tours with their jeep photo
only. None of the destination photographs exist yet.

Every section that ends up with no media must degrade gracefully:
- Hero with fewer than 3 slides: the slider runs with however many exist, and the
  dots reflect the real count. With zero, a solid --pine background and the headline.
- A room or tour with no photo: the card's image area shows a neutral --sand block,
  not a broken image and not a layout collapse.
- A gallery with no media: the section does not render at all.
- Any brand slot with no media: the inline SVG fallback.

Then print me a table of every placement, whether it was seeded, and from which file.
That table is what I hand the client when I ask for the remaining photographs.

Done when every image on the site comes from res.cloudinary.com, the homepage is
under 1.2 MB total, a hero video plays on desktop but shows only a poster at 390px,
and every unseeded section renders cleanly at 1440px and 390px.

Stop there. Show me the network tab totals, the seeded/unseeded table, and
screenshots of the sections you left empty.
```

---

## Prompt 5 — Auth and admin shell

```
Phase 5 from PROMPT.md.

- Auth.js v5, Credentials provider, bcrypt hashes, JWT sessions.
- middleware.ts protecting everything under /admin except /admin/login.
- Admin layout: sidebar on desktop, bottom tab bar on mobile, its own stylesheet.
  Functional and dense — this is not the marketing design.
- /admin dashboard: new enquiry count, five most recent enquiries, quick upload
  button.

Build this mobile-first. The owner uses it on a phone in a valley with weak signal.
If it only works on a laptop, it has failed.

Done when a logged-out visit to /admin/rooms redirects to login, and the shell is
usable one-handed at 360px.

Stop there. Show me the admin shell at 360px.
```

---

## Prompt 6 — Admin CRUD

```
Phase 6 from PROMPT.md. Build the screens in this order and finish each before
starting the next. Tell me when each one is done.

1. Enquiries — the most important screen. Table, detail panel, "Reply on WhatsApp"
   button, status dropdown, filter by status AND by kind (stays / tours).
2. Rooms — drag-to-reorder, full edit form, amenity chips, photo manager,
   "Show price on website" toggle, Published toggle.
3. Tours — same shape as Rooms. NO single price field on the tour. Inside the form,
   a small repeatable Fares list: pick-up name, min, max, note, published, with an
   "Add pick-up" button. Above it, the "Show fares on website" master toggle.
4. Gallery — multi-upload with per-file progress, drag-to-reorder, alt text,
   tile size, delete with confirmation.
5. Branding — four upload slots (logo-light, logo-dark, favicon, og-image), each
   previewed on both a dark and a light strip.
6. Settings — WhatsApp number, phone, address, socials, hero headline and sub-line,
   Google Maps URL, pick-up points (textarea, one per line), rates last updated,
   and the season banner.
7. Users — OWNER role only.

Every mutation: a server action that validates with Zod, checks the session, writes,
then calls revalidatePath(). Every destructive action confirms first. Every form
shows a saving state.

Done when the entire public site can be changed without touching code, and photo
reordering works with touch drag on a phone.
```

---

## Prompt 7 — Polish

```
Phase 7 from PROMPT.md.

- generateMetadata per page. OG image from the og-image brand row, falling back to
  the first hero image.
- JSON-LD: Hotel on the homepage (address, phone, geo 34.7247131 / 74.7096112,
  aggregateRating 4.9 from 705). TouristTrip on each tour detail page, with an Offer
  per published fare and no Offer where the fare is quoted on WhatsApp.
- sitemap.ts and robots.ts.
- Accessibility: keyboard-navigable lightbox and slider, visible focus rings, alt
  text everywhere, aria-live on form results, contrast checked on brass over cream.
- loading.tsx, error.tsx, not-found.tsx.
- Rate-limit the enquiry endpoint.

Done when Lighthouse mobile hits 90+ performance, 95+ accessibility and 95+ SEO on
every route. Show me the numbers per route.
```

---

## Prompt 8 — Deploy and hand over

```
Phase 8 from PROMPT.md.

- Deploy to Render, Starter plan, Singapore region. Connect Neon in the SAME region
  — a database on another continent adds a round trip to every query.
- Set all env vars, run migrations against production, seed the real content.
- Point the domain, confirm HTTPS.
- Write HANDOVER.md for the resort owner, not for a developer. Under two pages:
  how to log in, add a room, add a tour, change a published fare, add a pick-up
  point, turn prices on or off, upload photos, reply to an enquiry, unpublish a tour
  when the pass closes, and what to do if something breaks. Mention that a new
  favicon can take a while to show up in an already-open browser.

Done when the client can log in on their own phone and change a photo without
asking me.
```

---

## If Claude Code drifts

Three things go wrong most often. Paste the matching line:

| What you see | What to say |
|---|---|
| It added Tailwind, shadcn, framer-motion | `Stop. Section 2 of PROMPT.md forbids extra libraries. Remove it and port the reference CSS as written.` |
| A page doesn't match the design | `Open design-reference/<page>.html in the browser and compare against what you built. Section 1 rule 2: if it looks different, it's a bug.` |
| It added an email form or a price on a tour | `Re-read PROMPT.md section 1, rules 1 and 3. Undo that.` |

And one habit worth keeping: at the end of every phase, before you paste the next
prompt, **open the site yourself at 390px wide**. Claude Code will tell you a phase is
done. Only your own eyes confirm it.
