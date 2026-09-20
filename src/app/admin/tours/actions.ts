"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateGallery, revalidateTours } from "@/lib/revalidate";

/**
 * Tour mutations — PROMPT.md § 5c.
 *
 * Note what is NOT here: a price field on the tour. There is no `price` in the
 * schema below because there is none in the model, and there is none in the
 * model because a jeep fare depends on where the guest is picked up. Fares live
 * on `TourFare`, one row per pick-up point, and are edited inside this same form.
 */

const slugRx = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const fareSchema = z
  .object({
    id: z.string().optional(),
    pickupName: z.string().trim().min(1, "Every fare needs a pick-up point").max(80),
    priceMin: z.coerce.number().int().positive("A fare must be more than zero").max(10_000_000),
    priceMax: z.union([z.coerce.number().int().positive().max(10_000_000), z.literal("")]).optional(),
    note: z.string().trim().max(200).optional(),
    published: z.boolean(),
  })
  .transform((f) => ({ ...f, priceMax: f.priceMax === "" ? null : (f.priceMax ?? null) }))
  .refine((f) => f.priceMax === null || f.priceMax >= f.priceMin, {
    message: "The upper fare cannot be lower than the lower one",
  });

const tourSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(1, "A web address is required").max(80).regex(slugRx, "Use lower-case letters, numbers and hyphens only"),
  name: z.string().trim().min(1, "A name is required").max(120),
  tagline: z.string().trim().max(60),
  shortDesc: z.string().trim().min(1, "The card needs a line of text").max(400),
  longDesc: z.string().trim().min(1, "The detail page needs a description").max(4000),
  season: z.string().trim().max(120).optional(),
  difficulty: z.string().trim().max(160).optional(),
  travelNote: z.string().trim().max(200).optional(),
  highlights: z.array(z.string().trim().min(1).max(160)).max(30),
  includes: z.array(z.string().trim().min(1).max(160)).max(30),
  showPrice: z.boolean(),
  published: z.boolean(),
  fares: z.array(fareSchema).max(40),
});

function readFares(formData: FormData) {
  const names = formData.getAll("fare-pickupName").map(String);
  return names.map((pickupName, i) => ({
    id: (formData.getAll("fare-id")[i] as string) || undefined,
    pickupName,
    priceMin: String(formData.getAll("fare-priceMin")[i] ?? ""),
    priceMax: String(formData.getAll("fare-priceMax")[i] ?? ""),
    note: String(formData.getAll("fare-note")[i] ?? ""),
    published: String(formData.getAll("fare-published")[i] ?? "") === "on",
  }));
}

export async function saveTour(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = tourSchema.safeParse({
    id: (formData.get("id") as string) || undefined,
    slug: formData.get("slug"),
    name: formData.get("name"),
    tagline: formData.get("tagline") ?? "",
    shortDesc: formData.get("shortDesc"),
    longDesc: formData.get("longDesc"),
    season: (formData.get("season") as string) || undefined,
    difficulty: (formData.get("difficulty") as string) || undefined,
    travelNote: (formData.get("travelNote") as string) || undefined,
    highlights: formData.getAll("highlights").map(String).filter(Boolean),
    includes: formData.getAll("includes").map(String).filter(Boolean),
    showPrice: formData.get("showPrice") === "on",
    published: formData.get("published") === "on",
    fares: readFares(formData),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const { id, fares, ...data } = parsed.data;
  const payload = {
    ...data,
    season: data.season || null,
    difficulty: data.difficulty || null,
    travelNote: data.travelNote || null,
  };

  try {
    const tourId = id
      ? (await prisma.tour.update({ where: { id }, data: payload, select: { id: true } })).id
      : (
          await prisma.tour.create({
            data: {
              ...payload,
              order:
                ((await prisma.tour.findFirst({ orderBy: { order: "desc" }, select: { order: true } }))
                  ?.order ?? -1) + 1,
            },
            select: { id: true },
          })
        ).id;

    // Fares are replaced wholesale: the form is the complete list, so a row the
    // owner removed from the form must disappear rather than linger unpublished.
    await prisma.tourFare.deleteMany({ where: { tourId } });
    if (fares.length > 0) {
      await prisma.tourFare.createMany({
        data: fares.map((f, index) => ({
          tourId,
          pickupName: f.pickupName,
          priceMin: f.priceMin,
          priceMax: f.priceMax,
          note: f.note || null,
          published: f.published,
          order: index,
        })),
      });
    }
  } catch (error) {
    return {
      error:
        (error as { code?: string }).code === "P2002"
          ? "Another tour already uses that web address."
          : "Could not save. Please try again.",
    };
  }

  revalidateTours(payload.slug);
  return { ok: true, message: `Tour saved with ${fares.length} fare${fares.length === 1 ? "" : "s"}` };
}

export async function deleteTour(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Nothing to delete." };

  const tour = await prisma.tour.findUnique({ where: { id }, select: { slug: true } });

  try {
    await prisma.enquiry.updateMany({ where: { tourId: id }, data: { tourId: null } });
    await prisma.tour.delete({ where: { id } });
  } catch {
    return { error: "Could not delete the tour." };
  }

  revalidateTours(tour?.slug);
  redirect("/admin/tours");
}

const orderSchema = z.array(z.string().min(1)).max(100);

export async function reorderTours(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = orderSchema.safeParse(ids);
  if (!parsed.success) return { error: "Bad order" };

  await prisma.$transaction(
    parsed.data.map((id, index) => prisma.tour.update({ where: { id }, data: { order: index } })),
  );

  revalidateTours();
  return { ok: true, message: "Order saved" };
}

/* ------------------------------------------------------------- photos */

const photoSchema = z.object({
  tourId: z.string().min(1),
  publicId: z.string().min(1).max(300),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  alt: z.string().trim().max(300).default(""),
});

export async function addTourPhoto(input: z.input<typeof photoSchema>): Promise<ActionState> {
  await requireAdmin();
  const parsed = photoSchema.safeParse(input);
  if (!parsed.success) return { error: "That upload was not usable." };

  const { tourId, ...media } = parsed.data;
  const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { slug: true } });
  if (!tour) return { error: "That tour no longer exists." };

  const last = await prisma.media.findFirst({
    where: { tourId },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  await prisma.media.create({
    data: { ...media, placement: "TOUR", tourId, order: (last?.order ?? -1) + 1 },
  });

  revalidateTours(tour.slug);
  revalidateGallery();
  return { ok: true, message: "Photo added" };
}

export async function setTourPhotoOrder(tourId: string, ids: string[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = orderSchema.safeParse(ids);
  if (!parsed.success) return { error: "Bad order" };

  await prisma.$transaction(
    parsed.data.map((id, index) => prisma.media.update({ where: { id }, data: { order: index } })),
  );

  const tour = await prisma.tour.findUnique({ where: { id: tourId }, select: { slug: true } });
  revalidateTours(tour?.slug);
  return { ok: true, message: "Photo order saved" };
}

export async function deleteTourPhoto(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("photoId") ?? "");
  if (!id) return { error: "Nothing to delete." };

  const media = await prisma.media.findUnique({
    where: { id },
    select: { tour: { select: { slug: true } } },
  });

  await prisma.media.delete({ where: { id } });
  revalidateTours(media?.tour?.slug);
  return { ok: true, message: "Photo removed from this tour" };
}
