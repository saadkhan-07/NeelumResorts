"use server";

import { z } from "zod";
import { requireAdmin, type ActionState } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { revalidateEverything } from "@/lib/revalidate";

/**
 * Site settings — PROMPT.md § 8, Phase 6 item 6.
 *
 * Every value here appears on the public site, so a save purges the whole layout.
 */
/** An optional profile link that must be on `domain` (or blank). */
function socialLink(domain: string, name: string) {
  return z.union([
    z
      .string()
      .trim()
      .url()
      .refine((v) => {
        const host = new URL(v).hostname.replace(/^www\./, "");
        return host === domain || host.endsWith(`.${domain}`);
      }, `That is not a ${name} link`),
    z.literal(""),
  ]);
}

const schema = z.object({
  // Digits only: wa.me rejects +, spaces and dashes, and the owner will type all
  // three. Cleaning it here means the website never builds a broken link.
  whatsapp: z
    .string()
    .trim()
    .transform((v) => v.replace(/[^\d]/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 15, "A WhatsApp number needs 10–15 digits"),
  phone: z.string().trim().min(5).max(30),
  phoneDisplay: z.string().trim().min(5).max(40),
  address: z.string().trim().min(1).max(400),
  googleMapsUrl: z.string().trim().url("That does not look like a link").max(400),

  heroHeadline: z.string().trim().min(1).max(200),
  heroSub: z.string().trim().min(1).max(500),

  // Empty is the normal state. Non-empty puts a strip across every public page.
  seasonBanner: z.string().trim().max(300),

  // Each link must point at its own site. The TikTok field once held the Facebook
  // URL, which sent the footer's TikTok icon to Facebook and gave Google the same
  // profile twice in the schema.
  instagram: socialLink("instagram.com", "Instagram"),
  facebook: socialLink("facebook.com", "Facebook"),
  tiktok: socialLink("tiktok.com", "TikTok"),

  // One place name per line; it populates the selector on every tour.
  pickupPoints: z.string().trim().max(2000),
  ratesUpdated: z.string().trim().max(60),

  // Shown in the hero pill, the story badge and the reviews heading. They drift,
  // so they are editable rather than compiled in.
  ratingScore: z.string().trim().max(8),
  ratingCount: z.string().trim().max(12),
});

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form" };
  }

  const entries = Object.entries(parsed.data);

  try {
    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        }),
      ),
    );
  } catch {
    return { error: "Could not save the settings." };
  }

  revalidateEverything();
  return { ok: true, message: "Settings saved — the website is updated" };
}
