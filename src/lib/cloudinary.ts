/**
 * Cloudinary URL builders — PROMPT.md § 5 and § 5b.
 *
 * Nothing in the database is ever a full URL. We store the `public_id` and build
 * the URL at render time, which is what lets the owner replace a photograph
 * without a deploy and lets us change delivery rules in one file.
 *
 * `f_auto,q_auto` is the whole point: it turns the owner's 6 MB phone photo into
 * a ~120 KB WebP for browsers that take it. It is on everything except favicons.
 */

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

const base = (kind: "image" | "video") =>
  `https://res.cloudinary.com/${CLOUD}/${kind}/upload`;

/** True for an SVG we uploaded — transforming an SVG rasterises it. */
export function isSvg(publicId: string) {
  return publicId.toLowerCase().endsWith(".svg");
}

/**
 * A delivered image at a given width. `c_fill` crops to the requested box, which
 * is what every slot in this design wants — the stylesheet already decides the
 * aspect ratio and `object-fit: cover` would otherwise throw the pixels away
 * after downloading them.
 */
export function imageUrl(publicId: string, width: number) {
  return `${base("image")}/f_auto,q_auto,c_fill,w_${width}/${publicId}`;
}

/**
 * A 9:16 portrait crop for the phone hero, where a landscape photo under
 * `object-fit: cover` would show only its middle third, scaled up ~3x.
 * `g_auto` keeps the subject in frame rather than the geometric centre.
 */
export function portraitUrl(publicId: string, width: number) {
  return `${base("image")}/f_auto,q_auto:good,c_fill,g_auto,ar_9:16,w_${width}/${publicId}`;
}

/** Same, without the crop — for images whose own aspect ratio must survive. */
export function imageUrlUncropped(publicId: string, width: number) {
  return `${base("image")}/f_auto,q_auto,w_${width}/${publicId}`;
}

export function videoUrl(publicId: string) {
  return `${base("video")}/f_auto,q_auto,vc_auto/${publicId}.mp4`;
}

/** Frame zero as a still, so a video box is never empty while it loads. */
export function posterUrl(publicId: string, width = 1600) {
  return `${base("video")}/so_0,f_auto,q_auto,w_${width}/${publicId}.jpg`;
}

/**
 * A brand logo. SVG is delivered raw with `fl_sanitize` and no other
 * transformation — an SVG is executable markup and the admin panel takes files
 * from a non-technical user, so it is sanitised on the way out every time.
 */
export function logoUrl(publicId: string, height = 80) {
  if (isSvg(publicId)) {
    return `${base("image")}/fl_sanitize/${publicId}`;
  }
  return `${base("image")}/f_auto,q_auto,h_${height}/${publicId}`;
}

/**
 * A favicon. `f_png` is forced rather than `f_auto`: f_auto would serve WebP,
 * which older browsers reject outright as an icon. Padded to a square on a
 * transparent ground so a non-square upload still renders as an icon.
 *
 * `version` busts the cache — browsers hold on to favicons harder than anything
 * else, and without it the owner will swear their new icon did not upload.
 */
export function faviconUrl(publicId: string, size: number, version?: string | number) {
  const url = `${base("image")}/c_pad,b_transparent,w_${size},h_${size},f_png/${publicId}`;
  return version ? `${url}?v=${encodeURIComponent(String(version))}` : url;
}

/** The social preview image. 1200x630 is what WhatsApp and Facebook expect. */
export function ogImageUrl(publicId: string) {
  return `${base("image")}/f_auto,q_auto,c_fill,w_1200,h_630/${publicId}`;
}

/* The `next/image` loader lives in `src/lib/cloudinary-loader.ts` — it is
   registered globally in next.config.ts, because a loader passed as a prop
   cannot cross a server-to-client boundary. */
