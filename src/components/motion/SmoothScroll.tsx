"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";

let lenis: Lenis | null = null;

/**
 * Inertial "glide" scrolling (Lenis), driven by GSAP's ticker so every
 * ScrollTrigger stays perfectly in sync. Skipped entirely when the visitor
 * prefers reduced motion; touch devices keep their native scrolling.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;

    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: -96 } });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add("lenis-on");

    return () => {
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      document.documentElement.classList.remove("lenis-on");
    };
  }, []);

  // New page: jump to the top (or the hash target) without gliding.
  useEffect(() => {
    if (!lenis) return;
    if (window.location.hash) return;
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}

/** Pause/resume page scrolling while an overlay (menu, lightbox) is open. */
export function setScrollLocked(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}
