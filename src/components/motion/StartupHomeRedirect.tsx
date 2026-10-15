"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export function StartupHomeRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!isInitialLoad.current) return;
    isInitialLoad.current = false;

    if (pathname !== "/") router.replace("/");
  }, [pathname, router]);

  return null;
}
