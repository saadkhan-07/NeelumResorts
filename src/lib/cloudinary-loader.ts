"use client";

/**
 * The custom `next/image` loader, registered globally in `next.config.ts`.
 *
 * It has to be its own file with a default export because a loader passed as a
 * prop cannot cross a server-to-client boundary — `next/image` is a client
 * component, and a function is not serialisable. Configuring it at the framework
 * level also means every image on the site goes through Cloudinary by
 * construction, with no way to accidentally bypass it.
 */
export default function cloudinaryImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  // q_auto:eco rather than plain q_auto (which is q_auto:good). On these
  // photographs eco saves roughly a quarter of the bytes with no visible
  // difference at the sizes they render — and the homepage budget is 1.2 MB for
  // the whole scroll, not just the hero. Anything that needs more can pass an
  // explicit `quality`.
  // `quality={40}` or below means "behind a dark wash" — the page-head photo sits
  // under a 30–85% gradient — and asks Cloudinary for q_auto:low instead of a
  // fixed number, so it still adapts to each photo.
  const q = !quality ? "q_auto:eco" : quality <= 40 ? "q_auto:low" : `q_${quality}`;
  // c_limit never enlarges past the source, so a small upload is not upscaled.
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,${q},c_limit,w_${width}/${src}`;
}
