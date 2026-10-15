"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { Expand } from "lucide-react";
import { Lightbox } from "./Lightbox";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { GalleryCategory, HotelImage } from "@/content/images";

type Props = {
  images: HotelImage[];
  categories?: { key: GalleryCategory; label: string }[];
  /** Columns on large screens. */
  columns?: 3 | 4;
};

/**
 * Uniform grid: every tile shares the same 4:3 frame so rows line up evenly;
 * each photo is cropped around its focal point and shown uncropped in the
 * lightbox.
 */
export function GalleryGrid({ images, categories, columns = 3 }: Props) {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [index, setIndex] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const visible = useMemo(() => (filter === "all" ? images : images.filter((i) => i.category === filter)), [filter, images]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Tiles in the same row rise with a small left-to-right stagger.
        gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 0.9, delay: (i % columns) * 0.08, scrollTrigger: { trigger: el, start: "top 94%", once: true } }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true }
  );

  const tabs = categories ? [{ key: "all" as const, label: "All" }, ...categories.filter((c) => images.some((i) => i.category === c.key))] : [];
  const sizes = columns === 4 ? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

  return (
    <div ref={root}>
      {tabs.length > 0 && (
        <div role="tablist" aria-label="Filter photographs" className="mb-12 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((t) => {
            const count = t.key === "all" ? images.length : images.filter((i) => i.category === t.key).length;
            const active = filter === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setFilter(t.key)}
                className={clsx(
                  "shrink-0 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                  active ? "border-forest bg-forest text-ivory" : "border-charcoal/20 text-charcoal/75 hover:border-forest hover:text-forest"
                )}
              >
                {t.label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <ul className={clsx("grid gap-4 sm:grid-cols-2 lg:gap-5", columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
        {visible.map((image, i) => (
          <li key={image.id} data-tile>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-charcoal/10 text-left"
              aria-label={`Open photo: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={sizes}
                placeholder="blur"
                blurDataURL={image.blurDataURL}
                style={{ objectPosition: image.position }}
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
              />
              <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/75 via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="flex w-full items-center justify-between gap-4 p-5 text-sm text-ivory">
                  <span className="line-clamp-2">{image.alt}</span>
                  <Expand className="h-4 w-4 shrink-0" aria-hidden />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox images={visible} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </div>
  );
}
