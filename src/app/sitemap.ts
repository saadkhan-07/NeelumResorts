import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getRooms, getTours } from "@/lib/queries";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

/**
 * Every public page, with a real `lastModified` — the time the content behind
 * it was last saved. A page with nothing to date it (contact) gets none rather
 * than "now", which would tell Google it changes on every crawl.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rooms, tours, newestPhoto] = await Promise.all([
    getRooms(),
    getTours(),
    prisma.media
      .findFirst({ where: { published: true }, orderBy: { createdAt: "desc" }, select: { createdAt: true } })
      .catch(() => null),
  ]);

  const latest = (dates: Date[]) =>
    dates.length ? new Date(Math.max(...dates.map((d) => d.getTime()))) : undefined;
  const roomsAt = latest(rooms.map((r) => r.updatedAt));
  const toursAt = latest(tours.map((t) => t.updatedAt));

  return [
    { url: absoluteUrl("/"), lastModified: latest([roomsAt, toursAt].filter((d): d is Date => !!d)) },
    { url: absoluteUrl("/stays"), lastModified: roomsAt },
    ...rooms.map((room) => ({ url: absoluteUrl(`/stays/${room.slug}`), lastModified: room.updatedAt })),
    { url: absoluteUrl("/tours"), lastModified: toursAt },
    ...tours.map((tour) => ({ url: absoluteUrl(`/tours/${tour.slug}`), lastModified: tour.updatedAt })),
    { url: absoluteUrl("/gallery"), lastModified: newestPhoto?.createdAt },
    { url: absoluteUrl("/contact") },
  ];
}
