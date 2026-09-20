/**
 * Seeds the database from `prisma/data.ts`, plus the first admin account.
 *
 * Idempotent: every write is an upsert keyed on the slug, the setting key or the
 * email, so running it twice changes nothing and running it after an edit puts the
 * reference content back. A tour's fares are rewritten rather than duplicated.
 *
 * Run with: pnpm prisma db seed
 */

import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { rooms, settings, tours } from "./data";
import { seedMedia } from "./seed-media";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill in the Neon connection string.",
  );
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function seedRooms() {
  for (const room of rooms) {
    await prisma.room.upsert({
      where: { slug: room.slug },
      update: room,
      create: room,
    });
  }
  return rooms.length;
}

async function seedTours() {
  let fareCount = 0;

  for (const tour of tours) {
    // `fares` is a nested create, which the `update` branch of an upsert cannot
    // reuse. Write the tour's own columns first, then replace its fare rows — the
    // seed stays the single source of truth for which fares are published.
    const { fares, ...scalars } = tour;

    const saved = await prisma.tour.upsert({
      where: { slug: tour.slug },
      update: scalars,
      create: scalars,
      select: { id: true },
    });

    await prisma.tourFare.deleteMany({ where: { tourId: saved.id } });

    const rows = fares?.create
      ? Array.isArray(fares.create)
        ? fares.create
        : [fares.create]
      : [];

    for (const fare of rows) {
      await prisma.tourFare.create({ data: { ...fare, tourId: saved.id } });
      fareCount += 1;
    }
  }

  return { tours: tours.length, fares: fareCount };
}

async function seedSettings() {
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  return Object.keys(settings).length;
}

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn(
      "  ! SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping the admin account.",
    );
    return false;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    // An existing account keeps its password: re-seeding content must never
    // silently reset the owner's login.
    update: { name: "Owner", role: "OWNER" },
    create: { email, passwordHash, name: "Owner", role: "OWNER" },
  });
  return true;
}

async function main() {
  console.log("Seeding Neelum Resort Taobat…");

  console.log(`  ${await seedRooms()} rooms (all showPrice: false)`);

  const tourResult = await seedTours();
  console.log(`  ${tourResult.tours} tours, ${tourResult.fares} published fares`);

  console.log(`  ${await seedSettings()} settings`);

  if (await seedAdmin()) console.log(`  1 admin account (${process.env.SEED_ADMIN_EMAIL})`);

  // Phase 4: upload the curated photographs and write their Media rows.
  if (process.env.SEED_MEDIA !== "0") {
    const media = await seedMedia(prisma);
    const uploaded = media.filter((m) => m.status === "uploaded").length;
    const problems = media.filter((m) => m.status !== "uploaded");
    console.log(`  ${uploaded} media uploaded to Cloudinary`);
    for (const p of problems) {
      console.warn(`  ! ${p.placement}/${p.target} ${p.file}: ${p.status} — ${p.note ?? ""}`);
    }
  }

  console.log("Done.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
