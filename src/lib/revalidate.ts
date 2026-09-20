import { revalidatePath } from "next/cache";

/**
 * Public routes are statically rendered with a one-hour ISR window. Without an
 * explicit purge the owner changes a price, reloads the site, sees the old one,
 * and concludes the admin panel is broken. So every write says exactly which
 * pages it invalidated.
 */

export function revalidateRooms(slug?: string) {
  revalidatePath("/");
  revalidatePath("/stays");
  if (slug) revalidatePath(`/stays/${slug}`);
  revalidatePath("/stays/[slug]", "page");
}

export function revalidateTours(slug?: string) {
  revalidatePath("/");
  revalidatePath("/tours");
  if (slug) revalidatePath(`/tours/${slug}`);
  revalidatePath("/tours/[slug]", "page");
}

export function revalidateGallery() {
  revalidatePath("/");
  revalidatePath("/gallery");
}

/** Settings and branding touch the header, footer and metadata of every page. */
export function revalidateEverything() {
  revalidatePath("/", "layout");
}
