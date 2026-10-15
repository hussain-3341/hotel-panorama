"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { HotelImage } from "@/content/images";
import { setScrollLocked } from "@/components/motion/SmoothScroll";

type Props = {
  images: HotelImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

/**
 * Accessible full-screen viewer: focus-trapped dialog, Esc to close,
 * arrow keys / swipe to move, cross-fading between photographs.
 */
export function Lightbox({ images, index, onClose, onIndex }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const open = index !== null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndex]
  );

  // Keep the latest handlers in refs so the open/close effect runs only once per opening.
  const goRef = useRef(go);
  const closeRef = useRef(onClose);
  useEffect(() => {
    goRef.current = go;
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setScrollLocked(true);
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      else if (e.key === "ArrowRight") goRef.current(1);
      else if (e.key === "ArrowLeft") goRef.current(-1);
      else if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      setScrollLocked(false);
      returnFocus.current?.focus?.();
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;
  const current = images[index];
  const neighbours = [images[(index + 1) % images.length], images[(index - 1 + images.length) % images.length]];

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
      aria-label={`Photo ${index + 1} of ${images.length}: ${current.alt}`}
      className="fixed inset-0 z-[80] flex flex-col bg-charcoal/97 text-ivory backdrop-blur-sm [animation:page-in_.4s_ease-out]"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-4 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-ivory/70" aria-live="polite">
          {index + 1} / {images.length}
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close gallery" className="grid h-12 w-12 place-items-center rounded-full border border-ivory/25 hover:border-gold hover:text-gold">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div key={current.id} className="absolute inset-4 [animation:page-in_.5s_cubic-bezier(.22,1,.36,1)] sm:inset-x-24 sm:inset-y-2">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="100vw"
            quality={90}
            placeholder="blur"
            blurDataURL={current.blurDataURL}
            onLoad={() => setLoaded((l) => ({ ...l, [current.id]: true }))}
            className={`object-contain transition-opacity duration-500 ${loaded[current.id] ? "opacity-100" : "opacity-90"}`}
          />
        </div>
        {/* Preload neighbours for instant navigation */}
        <div className="sr-only" aria-hidden>
          {neighbours.map((n) => (
            <Image key={n.id} src={n.src} alt="" width={64} height={64} sizes="100vw" quality={90} />
          ))}
        </div>
        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-charcoal/60 hover:text-gold sm:left-6">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-charcoal/60 hover:text-gold sm:right-6">
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <p className="px-6 py-5 text-center text-sm text-ivory/75">{current.alt}</p>
    </div>,
    document.body
  );
}
