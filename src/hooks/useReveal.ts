"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal, ported from the reference script's IntersectionObserver.
 * Attach the returned ref to an element that carries the `reveal` class; it
 * gains `is-in` the first time it comes into view, then stops being observed.
 *
 * When the visitor prefers reduced motion the element is revealed immediately
 * and no observer is created.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
