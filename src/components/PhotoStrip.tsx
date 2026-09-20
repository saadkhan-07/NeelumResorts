"use client";

import { useCallback, useEffect, useState } from "react";
import { CldImage, MediaPlaceholder } from "./CldImage";
import { imageUrl } from "@/lib/cloudinary";
import type { MediaRow } from "@/lib/queries";

/**
 * Every photograph of a room or a tour, not just the cover.
 *
 * The detail rows used to render `photos[0]` and silently drop the rest, so a
 * room with six photographs looked exactly like a room with one.
 *
 * The shape is a large image with a strip of thumbnails beneath it: the same
 * arrangement a guest already understands from every booking site. Tapping a
 * thumbnail swaps the large image; tapping the large image opens the full-size
 * viewer with arrow keys and Escape.
 *
 * With one photograph there is no strip and no viewer — just the image, exactly
 * as before. With none, the neutral block. Both matter: most rooms will have one
 * or none until the owner has been through the admin panel.
 */
export function PhotoStrip({
  photos,
  alt,
  sizes = "(max-width: 900px) 100vw, 50vw",
}: {
  photos: MediaRow[];
  alt: string;
  sizes?: string;
}) {
  const [active, setActive] = useState(0);
  const [viewing, setViewing] = useState(false);

  const show = useCallback(
    (n: number) => setActive(((n % photos.length) + photos.length) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    if (!viewing) return;

    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewing(false);
      if (e.key === "ArrowRight") show(active + 1);
      if (e.key === "ArrowLeft") show(active - 1);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [viewing, active, show]);

  if (photos.length === 0) {
    return (
      <div className="room-row__media" style={{ position: "relative", aspectRatio: "4 / 3" }}>
        <MediaPlaceholder label={`${alt} — photograph to come`} />
      </div>
    );
  }

  const current = photos[active];
  const many = photos.length > 1;

  return (
    <div className="room-row__media">
      {many ? (
        <button
          type="button"
          className="photo-strip__main"
          onClick={() => setViewing(true)}
          aria-label={`View ${alt} photographs full size — ${active + 1} of ${photos.length}`}
        >
          <CldImage media={current} intrinsic sizes={sizes} />
          <span className="photo-strip__count" aria-hidden="true">
            {active + 1} / {photos.length}
          </span>
        </button>
      ) : (
        <CldImage media={current} intrinsic sizes={sizes} />
      )}

      {many ? (
        <div className="photo-strip__thumbs" role="tablist" aria-label={`${alt} photographs`}>
          {photos.map((photo, n) => (
            <button
              key={photo.id}
              type="button"
              role="tab"
              aria-selected={n === active}
              aria-label={photo.alt || `Photograph ${n + 1}`}
              className={n === active ? "is-active" : undefined}
              onClick={() => setActive(n)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(photo.publicId, 200)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}

      {viewing ? (
        <div
          className="lightbox is-open"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt || alt}
          onClick={(e) => {
            if (e.target === e.currentTarget) setViewing(false);
          }}
        >
          <button className="lb-close" aria-label="Close" onClick={() => setViewing(false)}>
            &times;
          </button>
          <button className="lb-prev" aria-label="Previous" onClick={() => show(active - 1)}>
            &#8249;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(current.publicId, 1600)} alt={current.alt || alt} />
          <button className="lb-next" aria-label="Next" onClick={() => show(active + 1)}>
            &#8250;
          </button>
        </div>
      ) : null}
    </div>
  );
}
