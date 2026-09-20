"use server";

import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateEverything } from "@/lib/revalidate";
import { BRAND_KEYS } from "./keys";

const schema = z.object({
  brandKey: z.enum(BRAND_KEYS),
  publicId: z.string().min(1).max(300),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  alt: z.string().trim().max(300).default(""),
});

/**
 * Replaces one brand asset.
 *
 * Replace, not add: there is exactly one logo-light, and `Media.brandKey` is
 * unique, so the old row is deleted and a new one written. That also moves
 * `createdAt`, which is what the favicon `?v=` stamp uses to break the browser
 * cache — otherwise the owner uploads a new icon and sees the old one for days.
 */
export async function saveBrandAsset(input: z.input<typeof schema>): Promise<ActionState> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: "That upload was not usable." };

  const { brandKey, ...media } = parsed.data;

  try {
    await prisma.$transaction([
      prisma.media.deleteMany({ where: { brandKey } }),
      prisma.media.create({
        data: { ...media, placement: "BRAND", brandKey, order: 0 },
      }),
    ]);
  } catch {
    return { error: "Could not save that asset." };
  }

  // The logo and favicon are in the layout of every page, public and admin.
  revalidateEverything();
  return { ok: true, message: `${brandKey} updated` };
}

export async function clearBrandAsset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = z.enum(BRAND_KEYS).safeParse(formData.get("brandKey"));
  if (!parsed.success) return { error: "Unknown brand slot." };

  await prisma.media.deleteMany({ where: { brandKey: parsed.data } });

  revalidateEverything();
  return { ok: true, message: "Removed — the built-in mark is back" };
}
