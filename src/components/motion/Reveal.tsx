"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children marked [data-reveal] one after another. */
  stagger?: number;
  y?: number;
  delay?: number;
  start?: string;
};

/**
 * Scroll-triggered fade-and-rise. Elements with `data-reveal` inside are
 * animated (or the wrapper itself if none). Content stays visible without JS
 * or with reduced motion.
 */
export function Reveal({ children, as: Tag = "div", className, stagger = 0.12, y = 40, delay = 0, start = "top 85%" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = el.querySelectorAll<HTMLElement>("[data-reveal]");
        const items = targets.length ? Array.from(targets) : [el];
        gsap.fromTo(
          items,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            delay,
            stagger,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(el.querySelectorAll("[data-reveal]"), { autoAlpha: 1 });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
