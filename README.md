# Neelum Resort Taobat

Production website for Neelum Resort Taobat — a riverside resort at the end of Neelum
Valley, Azad Kashmir.

Next.js 15 (App Router, TypeScript) · plain CSS · Prisma + PostgreSQL (Neon) ·
Cloudinary for all media · Auth.js v5 for the admin panel.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill it in
pnpm dev
```

Open http://localhost:3000.

## Read first

- **`CLAUDE.md`** — the non-negotiable rules, the stack, and the performance budget.
- **`PROMPT.md`** — the full build brief and the phase plan.
- **`design-reference/`** — the visual spec. Read it before changing any layout.

## Commands

| Command | |
|---|---|
| `pnpm dev` | develop |
| `pnpm build` | must pass before any phase is "done" |
| `pnpm prisma migrate dev` | apply schema changes |
| `pnpm prisma studio` | browse the database |
| `pnpm prisma db seed` | load seed content |
