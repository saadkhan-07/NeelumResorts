# Neelum Resort Taobat

Production website for a small riverside resort at the end of Neelum Valley, Azad Kashmir.
A finished static HTML design lives in `design-reference/`; this repo rebuilds it as a
Next.js app with a database and an admin panel, **without changing how it looks**.

`PROMPT.md` is the full build brief and the phase plan. This file is the summary that every
session must inherit — sections 1, 2 and 7 of that brief.

> **`design-reference/` is the visual spec — read it before changing any layout.**

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

## 2. Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Next.js 15, App Router, TypeScript | Server Components by default |
| Styling | Plain CSS — port `design-reference/style.css` | **No Tailwind.** The CSS is already written and correct |
| Database | PostgreSQL on Neon | Free tier is sufficient |
| ORM | Prisma | |
| Media | Cloudinary | Images *and* video, signed direct upload from browser |
| Auth | Auth.js v5 (NextAuth), Credentials provider | 1–3 admin accounts, no OAuth |
| Validation | Zod | Every server action validates its input |
| Hosting | Vercel | |
| Node | 20+ | Use `pnpm` |

Do not add a UI component library, a state manager, an animation library, or an image
library. The reference site is 14 KB of CSS and 140 lines of vanilla JS. Keep it that light.

**Design tokens** (defined at the top of `design-reference/style.css`, keep the exact values):

```
--ink #141E1A   --pine #1D352D   --brass #BE9247   --brass-lt #D8B472
--sand #F4EFE6  --cream #FBF8F2  --body #54504A
Display font: Cormorant Garamond   Body font: Jost
```

**Homepage section order** — do not reorder:
hero slider → availability bar → story → stats band → stays → experiences grid →
dining → gallery → reviews → location + map → FAQ → dark CTA band → footer

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

## Layout notes

- `design-reference/` is flat: `style.css` and the `*.jpg` files sit at its root, while the
  HTML files reference `css/style.css` and `images/*.jpg`. Read the files where they
  actually are. `g7.jpg`, `story.jpg` and `js/main.js` are referenced but not present —
  the reference JS behaviour has to be read out of the inline `<script>` in the HTML.
- `pnpm` build scripts are allow-listed in `pnpm-workspace.yaml` (`allowBuilds:`), not in
  `package.json`.
