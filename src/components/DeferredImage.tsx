"use client";

import { useEffect, useRef, useState } from "react";
import { CldImage } from "./CldImage";
import { imageUrl } from "@/lib/cloudinary";
import type { MediaRow } from "@/lib/queries";

/**
 * A below-the-fold photograph that is not requested until it is nearly on screen.
 *
 * Native `loading="lazy"` was not enough: on a slow connection Chrome starts
 * "lazy" images up to 2,500 px early, so the closing band's 150 KB photo and the
 * lower gallery tiles downloaded alongside the header photo and slowed the
 * largest paint on every inner page. Here nothing is fetched until the box is
 * within `margin` of the viewport.
 *
 * Only for `fill` images, whose box is sized by the stylesheet — the space is
 * already reserved, so the photo arriving moves nothing (CLS). The <noscript>
 * copy keeps the image for anything that does not run JavaScript.
 */
export function DeferredImage({
  media,
  sizes,
  className,
  margin = "400px",
}: {
  media: Pick<MediaRow, "publicId" | "alt" | "width" | "height">;
  sizes?: string;
  className?: string;
  margin?: string;
}) {
  const sentinel = useRef<HTMLSpanElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  if (near) return <CldImage media={media} sizes={sizes} className={className} />;

  return (
    <>
      <span ref={sentinel} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl(media.publicId, 1200)}
          alt={media.alt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      </noscript>
    </>
  );
}
