"use client";

import { useCallback, useEffect, useState } from "react";
import { CldImage } from "./CldImage";
import { imageUrl } from "@/lib/cloudinary";
import type { MediaRow } from "@/lib/queries";

/**
 * The masonry grid and its lightbox, ported from the reference script. Escape
 * closes, arrows move, and body scroll is restored on close.
 *
 * Renders nothing at all when there is no media — the caller drops the whole
 * section rather than showing an empty grid.
 */
export function Gallery({ images }: { images: MediaRow[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const show = useCallback(
    (n: number) => setOpen(((n % images.length) + images.length) % images.length),
    [images.length],
  );

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open === null) return;

    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(open + 1);
      if (e.key === "ArrowLeft") show(open - 1);
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close, show]);

  if (images.length === 0) return null;

  const current = open === null ? null : images[open];

  return (
    <>
      <div className="gallery">
        {images.map((image, n) => (
          <a
            key={image.id}
            className={image.tile || undefined}
            href={imageUrl(image.publicId, 1600)}
            onClick={(e) => {
              e.preventDefault();
              show(n);
            }}
          >
            <CldImage media={image} sizes="(max-width: 560px) 44vw, (max-width: 900px) 48vw, 25vw" />
          </a>
        ))}
      </div>

      {current ? (
        <div
          className="lightbox is-open"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button className="lb-close" aria-label="Close" onClick={close}>
            &times;
          </button>
          <button className="lb-prev" aria-label="Previous" onClick={() => show(open! - 1)}>
            &#8249;
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(current.publicId, 1600)} alt={current.alt} />
          <button className="lb-next" aria-label="Next" onClick={() => show(open! + 1)}>
            &#8250;
          </button>
        </div>
      ) : null}
    </>
  );
}
