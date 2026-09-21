"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { PAGE_KEYS, PAGE_ROUTES, type PageKey } from "@/lib/page-keys";

function revalidatePage(key: PageKey) {
  for (const route of PAGE_ROUTES[key]) {
    if (route.includes("[")) revalidatePath(route, "page");
    else revalidatePath(route);
  }
}

const saveSchema = z.object({
  pageKey: z.enum(PAGE_KEYS),
  publicId: z.string().min(1).max(300),
  width: z.coerce.number().int().min(1),
  height: z.coerce.number().int().min(1),
  alt: z.string().trim().max(300).default(""),
});

/**
 * Replaces one page's header photo.
 *
 * Replace, not add: each page has exactly one header, and `Media.pageKey` is
 * unique. The description carries over so the owner does not retype it for a
 * new photo of the same view. The old file stays in Cloudinary — an accidental
 * upload should not destroy the only copy of a photograph.
 */
export async function savePageHeader(input: z.input<typeof saveSchema>): Promise<ActionState> {
  await requireAdmin();
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) return { error: "That upload was not usable." };

  const { pageKey, alt, ...media } = parsed.data;

  try {
    const previous = await prisma.media.findUnique({ where: { pageKey }, select: { alt: true } });
    await prisma.$transaction([
      prisma.media.deleteMany({ where: { pageKey } }),
      prisma.media.create({
        data: { ...media, alt: alt || previous?.alt || "", placement: "PAGE_HEADER", pageKey },
      }),
    ]);
  } catch {
    return { error: "Could not save that photo." };
  }

  revalidatePage(pageKey);
  return { ok: true, message: "Header photo updated" };
}

const altSchema = z.object({
  pageKey: z.enum(PAGE_KEYS),
  alt: z.string().trim().max(300),
});

export async function savePageHeaderAlt(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = altSchema.safeParse({
    pageKey: formData.get("pageKey"),
    alt: formData.get("alt") ?? "",
  });
  if (!parsed.success) return { error: "Check the description." };

  const { count } = await prisma.media.updateMany({
    where: { pageKey: parsed.data.pageKey },
    data: { alt: parsed.data.alt },
  });
  if (count === 0) return { error: "Upload a photo first." };

  revalidatePage(parsed.data.pageKey);
  return { ok: true, message: "Saved" };
}

export async function clearPageHeader(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.enum(PAGE_KEYS).safeParse(formData.get("pageKey"));
  if (!parsed.success) return { error: "Unknown page." };

  await prisma.media.deleteMany({ where: { pageKey: parsed.data } });

  revalidatePage(parsed.data);
  return { ok: true, message: "Removed — the header is a plain dark band now" };
}
