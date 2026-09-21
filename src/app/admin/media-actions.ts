"use server";

import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateGallery, revalidateEverything } from "@/lib/revalidate";

/**
 * Media actions for the placement-based screens — hero slides and the gallery.
 *
 * One set of actions rather than one per screen: the only thing that differs is
 * the placement, so it is a parameter. It is validated against an allow-list, not
 * trusted from the form — otherwise a crafted POST could write a row into the
 * BRAND placement and replace the logo.
 */

const MANAGED = ["HERO", "GALLERY", "STORY", "DINING", "CTA"] as const;
type Managed = (typeof MANAGED)[number];
export type ManagedPlacement = Managed;

function revalidateFor(placement: Managed) {
  // The hero, the story split and the closing band are all on the homepage;
  // page headers are on every inner route. Only the gallery is narrow enough
  // to purge selectively.
  if (placement === "GALLERY") return revalidateGallery();
  return revalidateEverything();
}

const addSchema = z.object({
  placement: z.enum(MANAGED),
  publicId: z.string().min(1).max(300),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  alt: z.string().trim().max(300).default(""),
});

export async function addMedia(input: z.input<typeof addSchema>): Promise<ActionState> {
  await requireAdmin();
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { error: "That upload was not usable." };

  const { placement, ...media } = parsed.data;

  const last = await prisma.media.findFirst({
    where: { placement },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.media.create({
    data: { ...media, placement, order: (last?.order ?? -1) + 1 },
  });

  revalidateFor(placement);
  return { ok: true, message: "Photo added" };
}

const updateSchema = z.object({
  id: z.string().min(1),
  alt: z.string().trim().max(300),
  tile: z.enum(["", "tall", "wide"]),
});

export async function updateMedia(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    alt: formData.get("alt") ?? "",
    tile: formData.get("tile") ?? "",
  });
  if (!parsed.success) return { error: "Check the description and size." };

  const { id, ...data } = parsed.data;

  try {
    const row = await prisma.media.update({ where: { id }, data, select: { placement: true } });
    revalidateFor(row.placement as Managed);
  } catch {
    return { error: "Could not save — the photo may have been removed." };
  }

  return { ok: true, message: "Saved" };
}

export async function reorderMedia(
  placement: string,
  ids: string[],
): Promise<ActionState> {
  await requireAdmin();
  const p = z.enum(MANAGED).safeParse(placement);
  const parsed = z.array(z.string().min(1)).max(200).safeParse(ids);
  if (!p.success || !parsed.success) return { error: "Bad order" };

  await prisma.$transaction(
    parsed.data.map((id, index) => prisma.media.update({ where: { id }, data: { order: index } })),
  );

  revalidateFor(p.data);
  return { ok: true, message: "Order saved" };
}

export async function deleteMedia(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Nothing to delete." };

  try {
    // The row goes; the file stays in Cloudinary. An accidental tap should not
    // destroy the only copy of a photograph.
    const row = await prisma.media.delete({ where: { id }, select: { placement: true } });
    revalidateFor(row.placement as Managed);
  } catch {
    return { error: "Could not remove that photo." };
  }

  return { ok: true, message: "Photo removed" };
}
