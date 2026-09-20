"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateGallery, revalidateRooms } from "@/lib/revalidate";

/**
 * Room mutations. Every one: validate with Zod, check the session, write,
 * revalidate the public routes it touched.
 */

const slugRx = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const roomSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "A web address is required")
    .max(80)
    .regex(slugRx, "Use lower-case letters, numbers and hyphens only"),
  name: z.string().trim().min(1, "A name is required").max(120),
  tagline: z.string().trim().max(60),
  shortDesc: z.string().trim().min(1, "The card needs a line of text").max(400),
  longDesc: z.string().trim().min(1, "The detail page needs a description").max(4000),
  guests: z.string().trim().min(1).max(60),
  beds: z.string().trim().min(1).max(60),
  sizeSqft: z.string().trim().max(60).optional(),
  view: z.string().trim().min(1).max(60),
  amenities: z.array(z.string().trim().min(1).max(160)).max(30),
  // Rule 3: a price may exist, but it only reaches the website when the owner
  // also turns showPrice on. Both halves are deliberate.
  price: z.coerce.number().int().positive().max(10_000_000).optional(),
  showPrice: z.boolean(),
  published: z.boolean(),
});

function read(formData: FormData) {
  const priceRaw = String(formData.get("price") ?? "").trim();
  return {
    id: (formData.get("id") as string) || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    tagline: formData.get("tagline") ?? "",
    shortDesc: formData.get("shortDesc"),
    longDesc: formData.get("longDesc"),
    guests: formData.get("guests"),
    beds: formData.get("beds"),
    sizeSqft: (formData.get("sizeSqft") as string) || undefined,
    view: formData.get("view"),
    amenities: formData.getAll("amenities").map(String).filter(Boolean),
    price: priceRaw === "" ? undefined : priceRaw,
    showPrice: formData.get("showPrice") === "on",
    published: formData.get("published") === "on",
  };
}

export async function saveRoom(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = roomSchema.safeParse(read(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const { id, ...data } = parsed.data;
  const payload = { ...data, price: data.price ?? null, sizeSqft: data.sizeSqft || null };

  try {
    if (id) {
      const before = await prisma.room.findUnique({ where: { id }, select: { slug: true } });
      await prisma.room.update({ where: { id }, data: payload });
      // A renamed slug leaves a stale page behind at the old address.
      if (before && before.slug !== payload.slug) revalidateRooms(before.slug);
    } else {
      const last = await prisma.room.findFirst({ orderBy: { order: "desc" }, select: { order: true } });
      await prisma.room.create({ data: { ...payload, order: (last?.order ?? -1) + 1 } });
    }
  } catch (error) {
    const message = (error as { code?: string }).code === "P2002"
      ? "Another room already uses that web address."
      : "Could not save. Please try again.";
    return { error: message };
  }

  revalidateRooms(payload.slug);
  return { ok: true, message: "Room saved" };
}

export async function deleteRoom(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Nothing to delete." };

  const room = await prisma.room.findUnique({ where: { id }, select: { slug: true } });

  try {
    // Photos cascade with the room; enquiries do not — they keep their history
    // and simply lose the link, which is why Enquiry.roomId is nullable.
    await prisma.enquiry.updateMany({ where: { roomId: id }, data: { roomId: null } });
    await prisma.room.delete({ where: { id } });
  } catch {
    return { error: "Could not delete the room." };
  }

  revalidateRooms(room?.slug);
  redirect("/admin/rooms");
}

const orderSchema = z.array(z.string().min(1)).max(100);

export async function reorderRooms(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = orderSchema.safeParse(ids);
  if (!parsed.success) return { error: "Bad order" };

  try {
    await prisma.$transaction(
      parsed.data.map((id, index) =>
        prisma.room.update({ where: { id }, data: { order: index } }),
      ),
    );
  } catch {
    return { error: "Could not save the new order." };
  }

  revalidateRooms();
  return { ok: true, message: "Order saved" };
}

/* ------------------------------------------------------------- photos */

const photoSchema = z.object({
  roomId: z.string().min(1),
  publicId: z.string().min(1).max(300),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  alt: z.string().trim().max(300).default(""),
});

export async function addRoomPhoto(input: z.input<typeof photoSchema>): Promise<ActionState> {
  await requireAdmin();
  const parsed = photoSchema.safeParse(input);
  if (!parsed.success) return { error: "That upload was not usable." };

  const { roomId, ...media } = parsed.data;
  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { slug: true } });
  if (!room) return { error: "That room no longer exists." };

  const last = await prisma.media.findFirst({
    where: { roomId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.media.create({
    data: { ...media, placement: "ROOM", roomId, order: (last?.order ?? -1) + 1 },
  });

  revalidateRooms(room.slug);
  revalidateGallery();
  return { ok: true, message: "Photo added" };
}

export async function setRoomPhotoOrder(roomId: string, ids: string[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = orderSchema.safeParse(ids);
  if (!parsed.success) return { error: "Bad order" };

  await prisma.$transaction(
    parsed.data.map((id, index) =>
      prisma.media.update({ where: { id }, data: { order: index } }),
    ),
  );

  const room = await prisma.room.findUnique({ where: { id: roomId }, select: { slug: true } });
  revalidateRooms(room?.slug);
  return { ok: true, message: "Photo order saved" };
}

export async function deleteRoomPhoto(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("photoId") ?? "");
  if (!id) return { error: "Nothing to delete." };

  const media = await prisma.media.findUnique({
    where: { id },
    select: { room: { select: { slug: true } } },
  });

  // The row goes; the file stays in Cloudinary. Deleting the asset as well would
  // make this irreversible, and an accidental tap would destroy the only copy of
  // a photograph the owner may not have anywhere else.
  await prisma.media.delete({ where: { id } });

  revalidateRooms(media?.room?.slug);
  return { ok: true, message: "Photo removed from this room" };
}
