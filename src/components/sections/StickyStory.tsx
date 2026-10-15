"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { img } from "@/content/images";

export type StoryStep = { image: string; eyebrow: string; title: string; text: string; href: string; cta: string };

/**
 * Sticky storytelling: the photograph column stays in view while the copy
 * scrolls past; each step cross-fades its own image in. The section's
 * background eases from ivory into a soft sage mist as it arrives.
 */
export function StickyStory({ steps, heading }: { steps: StoryStep[]; heading: string }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const stepEls = gsap.utils.toArray<HTMLElement>("[data-step]");
      const triggers = stepEls.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        })
      );
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          root.current,
          { backgroundColor: "#F5F0E7" },
          {
            backgroundColor: "#E6E9E0",
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: true },
          }
        );
        stepEls.forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll("[data-step-copy]"),
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.1, duration: 1.1, scrollTrigger: { trigger: el, start: "top 75%", once: true } }
          );
        });
      });
      return () => {
        triggers.forEach((t) => t.kill());
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative bg-mist text-charcoal" aria-labelledby="story-heading">
      <div className="container-luxe pb-8 pt-24 lg:pt-36">
        <p className="eyebrow text-gold-deep">The Panorama experience</p>
        <h2 id="story-heading" className="display-lg mt-5 max-w-3xl">
          {heading}
        </h2>
      </div>

      <div className="container-luxe grid gap-10 pb-24 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:pb-36">
        {/* Sticky image stack (desktop) */}
        <div className="relative hidden lg:block">
          <div className="sticky top-28 aspect-[4/5] max-h-[calc(100svh-9rem)] w-full overflow-hidden rounded-sm">
            {steps.map((s, i) => {
              const image = img(s.image);
              return (
                <Image
                  key={s.image}
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  placeholder="blur"
                  blurDataURL={image.blurDataURL}
                  className={clsx(
                    "object-cover transition-[opacity,transform] duration-[1400ms] ease-[cubic-bezier(.22,1,.36,1)]",
                    i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  )}
                  style={{ objectPosition: image.position }}
                />
              );
            })}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-charcoal/55 to-transparent p-6">
              {steps.map((s, i) => (
                <span key={s.title} className={clsx("h-px flex-1 transition-colors duration-700", i <= active ? "bg-gold" : "bg-ivory/45")} />
              ))}
            </div>
          </div>
        </div>

        {/* Steps */}
        <ol className="flex flex-col">
          {steps.map((s, i) => {
            const image = img(s.image);
            return (
              <li key={s.title} data-step className="flex flex-col justify-center py-10 lg:min-h-[85svh]">
                <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-sm lg:hidden">
                  <Image src={image.src} alt={image.alt} fill sizes="100vw" placeholder="blur" blurDataURL={image.blurDataURL} className="object-cover" />
                </div>
                <p data-step-copy className="font-display text-6xl italic text-gold">
                  0{i + 1}
                </p>
                <p data-step-copy className="eyebrow mt-4 text-gold-deep">
                  {s.eyebrow}
                </p>
                <h3 data-step-copy className="display-md mt-4">
                  {s.title}
                </h3>
                <p data-step-copy className="lede mt-5 max-w-md text-charcoal/75">
                  {s.text}
                </p>
                <div data-step-copy className="mt-8">
                  <Link href={s.href} className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-forest">
                    <span className="link-underline">{s.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
                  </Link>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
