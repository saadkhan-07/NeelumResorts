"use client";

import { useReveal } from "@/hooks/useReveal";

type RevealProps = {
  children: React.ReactNode;
  /** Extra classes, e.g. `feature` or `room` — `reveal` is always added. */
  className?: string;
  id?: string;
};

/** Thin wrapper around `useReveal` for the common `<div class="reveal">` case. */
export function Reveal({ children, className, id }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} id={id} className={["reveal", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
