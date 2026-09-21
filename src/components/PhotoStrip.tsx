"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CldImage, MediaPlaceholder } from "./CldImage";
import { useDialogFocus } from "./useDialogFocus";
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
  defer = false,
}: {
  photos: MediaRow[];
  alt: string;
  sizes?: string;
  /**
   * Rows further down a list page: hold the main photo back until the row is
   * near the screen. Chrome starts `loading="lazy"` images up to 2,500 px early
   * on a slow connection, so without this every room on /stays downloaded with
   * the header photo and slowed the first paint.
   */
  defer?: boolean;
}) {
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(!defer);
  // Thumbnails are never the first thing anyone looks at; they wait for the page
  // to finish loading so they do not compete with the header photo. Their
  // buttons are sized by the stylesheet, so nothing moves when they fill in.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") return setLoaded(true);
    const done = () => setLoaded(true);
    window.addEventListener("load", done, { once: true });
    return () => window.removeEventListener("load", done);
  }, []);

  useEffect(() => {
    if (near || !box.current) return;
    if (!("IntersectionObserver" in window)) return setNear(true);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [near]);
  const [viewing, setViewing] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  useDialogFocus(viewing, dialog);

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

  // Same 4:3 box, radius and shadow as `.room-row__media img`, so the photo
  // replaces it without shifting anything.
  const main = near ? (
    <CldImage media={current} intrinsic sizes={sizes} />
  ) : (
    <span className="photo-strip__placeholder" aria-hidden="true" />
  );

  return (
    <div className="room-row__media" ref={box}>
      {many ? (
        <button
          type="button"
          className="photo-strip__main"
          onClick={() => setViewing(true)}
          aria-label={`View ${alt} photographs full size — ${active + 1} of ${photos.length}`}
        >
          {main}
          <span className="photo-strip__count" aria-hidden="true">
            {active + 1} / {photos.length}
          </span>
        </button>
      ) : (
        main
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
              {loaded && near ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl(photo.publicId, 200)} alt="" loading="lazy" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}

      {viewing ? (
        <div
          ref={dialog}
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
