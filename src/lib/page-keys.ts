/**
 * The inner pages that carry a `.page-head` photograph. Plain module, not a
 * `"use server"` file, so the admin screen, the actions and the queries can all
 * share it.
 *
 * Each page has exactly one header photo, stored as a PAGE_HEADER Media row with
 * `pageKey` set. A room's or tour's own page reuses the Stays or Tours photo.
 */
export const PAGE_KEYS = ["stays", "tours", "gallery", "contact"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

/** Routes whose static copy shows each header, for `revalidatePath`. */
export const PAGE_ROUTES: Record<PageKey, string[]> = {
  stays: ["/stays", "/stays/[slug]"],
  tours: ["/tours", "/tours/[slug]"],
  gallery: ["/gallery"],
  // The contact photo also fills the "Finding us" section on the homepage.
  contact: ["/contact", "/"],
};
