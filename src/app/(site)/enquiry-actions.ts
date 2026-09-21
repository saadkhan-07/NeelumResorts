"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { allow, clientIp } from "@/lib/rate-limit";

/**
 * Records a guest enquiry — rule 1: the row in the database is the *only* record
 * there is, because there is no email anywhere in this system.
 *
 * Called fire-and-forget, always AFTER `window.open` has already sent the guest
 * to WhatsApp. If this write fails the guest still reaches WhatsApp, which is the
 * outcome that matters; the owner loses a row, not a booking.
 *
 * It is public by design — it is how the website talks to itself — so it is
 * deliberately narrow: it validates hard, truncates, and can only ever create a
 * NEW enquiry. There is no id to update and no status to set.
 */

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(3).max(40),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.string().trim().max(60).optional(),
  message: z.string().trim().max(4000).optional(),
  kind: z.enum(["STAY", "TOUR"]).default("STAY"),
  source: z.enum(["bookbar", "contact-form", "room-card", "tour-card"]),
  roomSlug: z.string().trim().max(120).optional(),
  tourSlug: z.string().trim().max(120).optional(),
  pickupPoint: z.string().trim().max(120).optional(),
})
  /**
   * A stay cannot end before it starts.
   *
   * The form already blocks this, but this action is a public endpoint — it is
   * how the website talks to itself, and anything can POST to it. Since the
   * `Enquiry` row is the only record of a booking request that exists anywhere
   * (rule 1: there is no email), a nonsense range must not be able to reach it
   * and have the owner ring a guest about dates they never asked for.
   */
  .refine(
    (d) => {
      if (!d.checkIn || !d.checkOut) return true;
      const from = new Date(d.checkIn);
      const to = new Date(d.checkOut);
      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return true;
      return to > from;
    },
    { message: "Check-out must be after check-in", path: ["checkOut"] },
  );

export type EnquiryInput = z.input<typeof schema>;

function asDate(value?: string) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Ten enquiries per address per ten minutes. A real guest tapping through every
 * room and tour card stays well inside it; a script filling the owner's inbox
 * does not. Over the limit the row is simply not written — the guest has already
 * reached WhatsApp, which is the part that matters.
 */
const LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000;

export async function saveEnquiry(input: EnquiryInput): Promise<{ ok: boolean }> {
  if (!allow(`enquiry:${clientIp(await headers())}`, LIMIT, WINDOW_MS)) return { ok: false };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false };

  const d = parsed.data;

  try {
    const [room, tour] = await Promise.all([
      d.roomSlug
        ? prisma.room.findUnique({ where: { slug: d.roomSlug }, select: { id: true } })
        : null,
      d.tourSlug
        ? prisma.tour.findUnique({ where: { slug: d.tourSlug }, select: { id: true } })
        : null,
    ]);

    await prisma.enquiry.create({
      data: {
        name: d.name,
        phone: d.phone,
        checkIn: asDate(d.checkIn),
        checkOut: asDate(d.checkOut),
        guests: d.guests || null,
        message: d.message ?? "",
        kind: d.kind,
        source: d.source,
        roomId: room?.id ?? null,
        tourId: tour?.id ?? null,
        pickupPoint: d.pickupPoint || null,
      },
    });
    return { ok: true };
  } catch (error) {
    console.error("[saveEnquiry] failed:", error);
    return { ok: false };
  }
}
