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

## Layout notes — `design-reference/` filenames are scrambled

The folder is flat, and **every text file is saved under the wrong name**. The contents
are all correct; only the filenames are wrong. Read by content, not by name:

| File on disk | What it actually contains | Name the HTML expects |
|---|---|---|
| `lounge.jpg` | the stylesheet (22 KB CSS) | `css/style.css` |
| `contact.html` | the site script (140 lines of JS) | `js/main.js` |
| `rooms.html` | the **home** page | `index.html` |
| `style.css` | the **Our Stays** page | `rooms.html` |
| `index.html` | the **Gallery** page | `gallery.html` |
| `gallery.html` | the **Contact & Directions** page | `contact.html` |

So: the stylesheet to port in Phase 1 is `design-reference/lounge.jpg`, and the vanilla JS
to port is `design-reference/contact.html`.

**Gaps in the reference — confirm with the client before the phase that needs them:**

- Three images are genuinely absent, not just misnamed: `images/story.jpg`, `images/g7.jpg`
  and the real `images/lounge.jpg` photo.
- **There is no jeep-tours design.** PROMPT.md § 3 says the reference contains `tours.html`
  and a homepage tours section; it does not — the word "tour" appears nowhere in
  `design-reference/`, and the reference nav is Home · Stays · Gallery · Contact. The tours
  pages in Phase 3 must be composed from the existing design system (`.rooms`/`.room`
  cards, `.features`, `.room-row`, `.split`) rather than matched to a reference page.
