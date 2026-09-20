/**
 * Brand slot keys. Plain module, not a `"use server"` file — an actions file may
 * only export async functions, so shared constants and types live here.
 */
export const BRAND_KEYS = ["logo-light", "logo-dark", "favicon", "og-image"] as const;
export type BrandKey = (typeof BRAND_KEYS)[number];
