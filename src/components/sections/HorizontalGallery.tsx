"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, DESKTOP_MOTION } from "@/lib/gsap";
import { img } from "@/content/images";

type Props = { ids: string[]; eyebrow: string; title: string; href?: string; cta?: string };

/**
 * Desktop: the section pins and the photo strip glides sideways as you scroll.
 * Mobile / reduced motion: a native, swipeable horizontal scroller.
 */
export function HorizontalGallery({ ids, eyebrow, title, href = "/gallery", cta = "View the full gallery" }: Props) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP_MOTION, () => {
        if (!track.current || !viewport.current) return;
        gsap.set(viewport.current, { overflow: "hidden" });
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance() * 0.65}`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-hg-img]").forEach((el) => {
          gsap.fromTo(el, { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance() * 0.65}`, scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-ivory-deep py-20" aria-label={title}>
      <div className="container-luxe mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-gold-deep">{eyebrow}</p>
          <h2 className="display-lg mt-4 max-w-2xl">{title}</h2>
        </div>
        <Link href={href} className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-forest">
          <span className="link-underline">{cta}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
        </Link>
      </div>
      <div ref={viewport} className="snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin]">
        <ul ref={track} className="flex w-max gap-5 px-[clamp(1.25rem,4vw,3.5rem)] lg:gap-8">
          {ids.map((id) => {
            const image = img(id);
            return (
              <li key={id} className="snap-start">
                <figure className="relative aspect-[4/3] w-[80vw] overflow-hidden rounded-sm sm:w-[56vw] lg:w-auto lg:h-[58svh]">
                  <div data-hg-img className="absolute inset-0">
                    <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 60vw, 80vw" placeholder="blur" blurDataURL={image.blurDataURL} className="object-cover" style={{ objectPosition: image.position }} />
                  </div>
                  <figcaption className="sr-only">{image.alt}</figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
