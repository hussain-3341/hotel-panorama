"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Recalculates every ScrollTrigger once fonts and images have settled and
 * after each client-side navigation, so pins and reveals line up.
 */
export function ScrollRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(refresh).catch(() => {});
    window.addEventListener("load", refresh, { once: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, [pathname]);

  return null;
}
