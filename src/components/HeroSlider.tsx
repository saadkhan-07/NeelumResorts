"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CldImage } from "./CldImage";
import type { MediaRow } from "@/lib/queries";

/**
 * The hero slider, ported from the reference script: a 6.5s timer, dots down the
 * right edge, ken-burns zoom from the stylesheet.
 *
 * It runs on however many slides actually exist. The reference had three; the
 * delivery only contains two photographs that work as a full-bleed hero, so the
 * dots show two and the timer cycles two. With one, there is no timer and no
 * dots at all — a single still, not a slider pretending to be one.
 *
 * `prefers-reduced-motion` stops the auto-advance; the dots still work, so the
 * guest can still see every photograph on their own terms.
 */
export function HeroSlider({ slides }: { slides: MediaRow[] }) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    // Slides after the first sit in the viewport at opacity 0, so `loading=lazy`
    // does not hold them back and every photograph lands on the critical path.
    // Mounting them after hydration keeps the first paint to one image.
    setMounted(true);
  }, []);

  const go = useCallback(
    (n: number) => setIndex((n + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (reduced || slides.length < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced, slides.length, index]);

  if (slides.length === 0) return null;

  const visible = mounted ? slides : slides.slice(0, 1);

  return (
    <>
      <div className="hero__slides">
        {visible.map((slide, n) => (
          <div
            key={slide.id}
            className={n === index ? "hero__slide is-active" : "hero__slide"}
          >
            <CldImage media={slide} priority={n === 0} sizes="100vw" />
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="hero__dots">
          {slides.map((slide, n) => (
            <button
              key={slide.id}
              aria-label={`Slide ${n + 1} of ${slides.length}`}
              aria-current={n === index}
              className={n === index ? "is-active" : undefined}
              onClick={() => go(n)}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
