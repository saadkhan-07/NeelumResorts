"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Google Maps embed, loaded only when it scrolls into view.
 *
 * `loading="lazy"` on the iframe was not enough: on a phone the browser's lazy
 * threshold reaches well past the fold, so the embed's ~430 KB of Google scripts
 * downloaded with the page and competed with the photographs — the contact page
 * transferred 967 KB. `.map-card` has a fixed min-height, so nothing shifts when
 * the map arrives.
 */
export function LazyMap({ src, title, minHeight }: { src: string; title: string; minHeight?: string }) {
  const sentinel = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Until then the design's own `.map-fallback` (pin, name, coordinates) shows
  // through, as it always did while the embed loaded. The sentinel covers the
  // card so the observer has a box to watch; it is invisible and inert.
  return show ? (
    <iframe title={title} loading="lazy" allowFullScreen style={minHeight ? { minHeight } : undefined} src={src} />
  ) : (
    <span ref={sentinel} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
  );
}
