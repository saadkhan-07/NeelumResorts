# Neelum Resort Taobat

Production website for a small riverside resort at the end of Neelum Valley, Azad Kashmir,
which also runs guided 4x4 jeep tours to the lakes and valleys around it. A finished static
HTML design lives in `design-reference/`; this repo rebuilds it as a Next.js app with a
database and an admin panel, **without changing how it looks**.

`PROMPT.md` is the full build brief and the phase plan. This file is the summary that every
session must inherit — sections 1, 2 and 7 of that brief.

> **`design-reference/` is the visual spec — open it in a browser before changing any layout.**
> Its filenames are scrambled; see "Layout notes" at the bottom for the real mapping.

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
   price — fares live on `TourFare`, one row per pick-up point, and a tour with none reads
   "Fare agreed on WhatsApp". **Never add a price field to `Tour`.** See PROMPT.md § 5c.
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

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript | Server Components by default |
| Styling | Plain CSS — port the stylesheet from `design-reference/` (see Layout notes) | **No Tailwind.** The CSS is already written and correct |
| Database | PostgreSQL on Neon | Free tier is sufficient |
| ORM | Prisma | |
| Media | Cloudinary | Images *and* video, signed direct upload from browser |
| Auth | Auth.js v5 (NextAuth), Credentials provider | 1–3 admin accounts, no OAuth |
| Validation | Zod | Every server action validates its input |
| Hosting | **Render** (Starter, Singapore region) | Vercel's free tier bars commercial use; Render Starter allows it and does not spin down |
| Node | 20+ | Use `pnpm` |

Do not add a UI component library, a state manager, an animation library, or an image
library. The reference site is 22 KB of CSS and 140 lines of vanilla JS. Keep it that light.

**Design tokens** (defined at the top of the stylesheet, keep the exact values):

```
--ink #141E1A   --pine #1D352D   --brass #BE9247   --brass-lt #D8B472
--sand #F4EFE6  --cream #FBF8F2  --body #54504A
Display font: Cormorant Garamond   Body font: Jost
```

**Homepage section order** — do not reorder:
hero slider → availability bar → story → stats band → stays → experiences grid →
**jeep tours** → dining → gallery → reviews → location + map → FAQ → dark CTA band → footer

**Navigation:** Home · Stays · Tours · Gallery · Contact

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

## Working agreement

Work **one phase at a time** (see `PROMPT.md` § 8). At the end of each phase, stop,
summarise, and wait. Do not start the next phase until told.

## Commands

```
pnpm dev                  # develop
pnpm build                # must pass before any phase is "done"
pnpm prisma migrate dev
pnpm prisma studio
pnpm prisma db seed
```

`pnpm` build scripts are allow-listed in `pnpm-workspace.yaml` (`allowBuilds:`), not in
`package.json`.

## Layout notes — `design-reference/` was re-delivered on 18 Sep 2026

The second drop arrived as loose files at the repo root with browser `(2)` suffixes and,
like the first, **every text file under the wrong name**. It has been copied into
`design-reference/` under the names the HTML expects:

| File as delivered | What it actually contains | Copied to |
|---|---|---|
| `style (2).css` | the **home** page | `design-reference/index.html` |
| `gallery (2).html` | the **Our Stays** page | `design-reference/rooms.html` |
| `main (1).js` | the **Jeep Tours** page | `design-reference/tours.html` |
| `story (1).jpg` | the **Gallery** page | `design-reference/gallery.html` |
| `tours (2).html` | the **Contact & Directions** page | `design-reference/contact.html` |
| `index (2).html` | a JPEG, 1000×1250 portrait | `design-reference/images/story.jpg` |
| `contact (2).html` | a JPEG, 1000×750 | `design-reference/images/tour-baboon.jpg` |

All 28 images the five pages reference are present. The last two rows are an inference by
size and aspect (they were the only two image slots left unfilled) — confirm them by eye
when the story section and the Baboon Valley tour card are first rendered.

**The second drop contains no stylesheet and no script.** `design-reference/css/style.css`
and `design-reference/js/main.js` are the **first** drop's files, restored from git
(commit `bdac108`). They predate the jeep-tours work, so eight classes the new pages use
have no rules in them: `.steps`, `.step`, `.room__foot--stack`, `.tour__fares`, `.tour__wa`,
`.fare-table`, `.rates-note`, `.pickup`.

Phase 3 had to render those sections, so `src/styles/global.css` now ends with a **PHASE 3
ADDENDUM** block writing those eight classes from the reference's own tokens and the spacing
of neighbouring components. Everything above that banner is still the byte-exact port.
**It is the one part of the build that is not a port** — when the real `css/style.css`
arrives, delete the addendum and re-port. Ask the client's designer for it.

**`design-reference/images/story.jpg` is not a photograph.** When the second drop was
copied into place, the rename loop matched `story (1).jpg` — which actually held the Gallery
*page* — and overwrote the real JPEG with it. The source file (`index (2).html`, a
1000x1250 portrait) has since been deleted from the repo root, so the photograph is gone.
Two slots use it: the homepage story split and one gallery tile. `/ref-images` checks magic
bytes and 404s rather than serving HTML as an image. **Ask the client to re-send that one
photo.**

## Phase 3 notes

- Images are served by `src/app/ref-images/[file]/route.ts` straight out of
  `design-reference/images/`, so `/public` stays empty (rule 6). **Phase 4 deletes that
  route** along with `SLUG_IMAGES` / `SLOT_IMAGES` in `src/lib/copy.ts`.
- `RefImage` has two modes and the choice matters: `fill` where the *container* is sized by
  CSS, explicit `width`/`height` + `height:auto` where the reference put `aspect-ratio` on
  the `img` itself (`.split__media img`, `.room-row__media img`). Getting this wrong
  collapses the whole section to zero height.
- `src/lib/copy.ts` holds page copy that has no database model — FAQ, guest quotes, stats,
  the feature grids, page headers. PROMPT.md § 4 defines no model for any of it and Phase 6
  gives the owner no screen to edit it. Rooms, tours, fares and settings all come from the
  database; nothing in `src/` imports `prisma/data.ts`.
- The reference has no per-room or per-tour page — `rooms.html` and `tours.html` stack every
  item as a `.room-row` with an id anchor. `/stays/[slug]` and `/tours/[slug]` render that
  same row for one item rather than inventing a second layout.
