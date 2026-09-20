/**
 * Uploads the curated photographs to Cloudinary and writes a `Media` row for
 * each — PROMPT.md § 8, Phase 4.
 *
 * Idempotent: a file that has already been uploaded keeps its `public_id`, so
 * re-running the seed updates the row instead of filling Cloudinary with copies.
 * Deterministic public ids are how that works — `unique_filename: false` plus a
 * fixed id per file, which is the one place we *want* to overwrite.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { v2 as cloudinary } from "cloudinary";
import type { PrismaClient } from "../src/generated/prisma/client";
import { mediaToSeed, type SeedMedia } from "./media";

const IMAGES = join(process.cwd(), "design-reference", "images");

export type SeedResult = {
  placement: string;
  target: string;
  file: string;
  publicId: string | null;
  status: "uploaded" | "reused" | "skipped" | "failed";
  note?: string;
};

function configure() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local.",
    );
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/** Refuses anything that is not actually a JPEG or PNG, whatever it is called. */
function readImage(file: string) {
  const buffer = readFileSync(join(IMAGES, file));
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e;
  if (!isJpeg && !isPng) {
    throw new Error(`${file} is not an image file`);
  }
  return buffer;
}

/** `neelum/gallery/cta` — stable, so re-seeding replaces rather than duplicates. */
function publicIdFor(item: SeedMedia) {
  const stem = item.file.replace(/\.[a-z]+$/i, "");
  const suffix = item.roomSlug ?? item.tourSlug ?? "";
  return `${item.folder}/${stem}${suffix ? `-${suffix}` : ""}`;
}

export async function seedMedia(prisma: PrismaClient): Promise<SeedResult[]> {
  configure();

  const results: SeedResult[] = [];

  // Media rows are rebuilt from scratch each run: the curated list is the source
  // of truth for what should exist, and a row removed from the list should
  // disappear from the site too.
  await prisma.media.deleteMany({});

  for (const item of mediaToSeed) {
    const target =
      item.roomSlug ?? item.tourSlug ?? (item.tile ? `tile ${item.order + 1}` : `#${item.order + 1}`);

    let buffer: Buffer;
    try {
      buffer = readImage(item.file);
    } catch (error) {
      results.push({
        placement: item.placement,
        target,
        file: item.file,
        publicId: null,
        status: "skipped",
        note: (error as Error).message,
      });
      continue;
    }

    const publicId = publicIdFor(item);

    try {
      const upload = await new Promise<{
        public_id: string;
        width: number;
        height: number;
        format: string;
        existing?: boolean;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: publicId,
              folder: undefined, // public_id already carries the folder
              overwrite: true,
              unique_filename: false,
              resource_type: "image",
            },
            (error, result) => {
              if (error || !result) return reject(error ?? new Error("no result"));
              resolve(result as never);
            },
          )
          .end(buffer);
      });

      const roomId = item.roomSlug
        ? (await prisma.room.findUnique({ where: { slug: item.roomSlug }, select: { id: true } }))?.id
        : undefined;
      const tourId = item.tourSlug
        ? (await prisma.tour.findUnique({ where: { slug: item.tourSlug }, select: { id: true } }))?.id
        : undefined;

      await prisma.media.create({
        data: {
          publicId: upload.public_id,
          type: "IMAGE",
          width: upload.width,
          height: upload.height,
          alt: item.alt,
          placement: item.placement,
          tile: item.tile ?? "",
          order: item.order,
          published: true,
          roomId: roomId ?? null,
          tourId: tourId ?? null,
        },
      });

      results.push({
        placement: item.placement,
        target,
        file: item.file,
        publicId: upload.public_id,
        status: "uploaded",
      });
    } catch (error) {
      results.push({
        placement: item.placement,
        target,
        file: item.file,
        publicId: null,
        status: "failed",
        note: (error as Error).message,
      });
    }
  }

  return results;
}
