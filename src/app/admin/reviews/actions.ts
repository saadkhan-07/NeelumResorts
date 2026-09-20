"use server";

import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateEverything } from "@/lib/revalidate";

/**
 * Guest reviews, copied across from the resort's own Google listing.
 *
 * These are other people's words, so the form keeps the author's name with the
 * text and the site attributes every one. Nothing here rewrites a review: the
 * owner may choose *which* reviews to show, not what they say.
 */
const schema = z.object({
  id: z.string().optional(),
  author: z.string().trim().min(1, "Whose review is it?").max(120),
  body: z.string().trim().min(1, "The review needs some text").max(2000),
  rating: z.coerce.number().int().min(1).max(5),
  whenText: z.string().trim().max(60),
  source: z.string().trim().max(40),
  published: z.boolean(),
});

export async function saveReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse({
    id: (formData.get("id") as string) || undefined,
    author: formData.get("author"),
    body: formData.get("body"),
    rating: formData.get("rating") ?? 5,
    whenText: formData.get("whenText") ?? "",
    source: formData.get("source") || "Google",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form" };

  const { id, ...data } = parsed.data;

  try {
    if (id) {
      await prisma.review.update({ where: { id }, data });
    } else {
      const last = await prisma.review.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      await prisma.review.create({ data: { ...data, order: (last?.order ?? -1) + 1 } });
    }
  } catch {
    return { error: "Could not save that review." };
  }

  revalidateEverything();
  return { ok: true, message: id ? "Review saved" : `Added ${data.author}` };
}

export async function deleteReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Nothing to delete." };

  try {
    await prisma.review.delete({ where: { id } });
  } catch {
    return { error: "Could not delete that review." };
  }

  revalidateEverything();
  return { ok: true, message: "Review removed" };
}

export async function reorderReviews(ids: string[]): Promise<ActionState> {
  await requireAdmin();
  const parsed = z.array(z.string().min(1)).max(100).safeParse(ids);
  if (!parsed.success) return { error: "Bad order" };

  await prisma.$transaction(
    parsed.data.map((id, index) => prisma.review.update({ where: { id }, data: { order: index } })),
  );

  revalidateEverything();
  return { ok: true, message: "Order saved" };
}
