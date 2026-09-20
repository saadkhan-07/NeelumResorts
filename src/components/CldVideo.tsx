"use client";

import { useEffect, useState } from "react";
import { posterUrl, videoUrl } from "@/lib/cloudinary";
import type { MediaRow } from "@/lib/queries";

/**
 * Background video — PROMPT.md § 5, and the rules here are about data cost, not
 * taste.
 *
 * Guests in Neelum Valley are on mobile data that is slow and metered. So:
 *
 * - Under 900px the video is never downloaded at all. Not paused, not preloaded
 *   — `src` is never set, so the browser makes no request. The poster still
 *   shows, which is what the section needs to look right.
 * - Same when `navigator.connection.saveData` is on: the visitor has told the
 *   browser they are paying for bytes, and a decorative loop is exactly what
 *   that setting means to skip.
 * - `src` is only attached after mount, so the server-rendered HTML never
 *   contains a video URL for a preload scanner to start fetching early.
 */
export function CldVideo({
  media,
  className,
}: {
  media: Pick<MediaRow, "publicId" | "alt">;
  className?: string;
}) {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;

    const allowed =
      window.matchMedia("(min-width: 900px)").matches &&
      !connection?.saveData &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setPlay(allowed);
  }, []);

  const poster = posterUrl(media.publicId);

  return (
    <video
      className={className}
      muted
      playsInline
      loop
      autoPlay={play}
      preload="none"
      poster={poster}
      aria-label={media.alt || undefined}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      {...(play ? { src: videoUrl(media.publicId) } : {})}
    />
  );
}
