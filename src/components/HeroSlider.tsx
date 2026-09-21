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
 *
 * WCAG 2.2.2 (anything that moves on its own for over five seconds needs a way to
 * stop it): the timer pauses while the pointer or keyboard focus is anywhere in
 * the hero — so it never changes under someone reading the headline or tabbing
 * to "Check availability" — and stops for good once a dot is chosen.
 */
export function HeroSlider({ slides }: { slides: MediaRow[] }) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    const hero = slidesRef.current?.closest(".hero");
    if (!hero) return;
    const pause = () => setPaused(true);
    const resume = (e: Event) => {
      // focusout fires when focus moves between two things inside the hero too.
      const next = (e as FocusEvent).relatedTarget as Node | null;
      if (next && hero.contains(next)) return;
      setPaused(false);
    };
    hero.addEventListener("mouseenter", pause);
    hero.addEventListener("mouseleave", resume);
    hero.addEventListener("focusin", pause);
    hero.addEventListener("focusout", resume);
    return () => {
      hero.removeEventListener("mouseenter", pause);
      hero.removeEventListener("mouseleave", resume);
      hero.removeEventListener("focusin", pause);
      hero.removeEventListener("focusout", resume);
    };
  }, []);

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
    if (reduced || paused || chosen || slides.length < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [reduced, paused, chosen, slides.length, index]);

  if (slides.length === 0) return null;

  const visible = mounted ? slides : slides.slice(0, 1);

  return (
    <>
      <div className="hero__slides" ref={slidesRef}>
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
              aria-current={n === index ? "true" : undefined}
              className={n === index ? "is-active" : undefined}
              onClick={() => {
                setChosen(true);
                go(n);
              }}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
