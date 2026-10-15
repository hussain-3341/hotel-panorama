"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { img } from "@/content/images";

type Action = { href: string; label: string; variant?: "gold" | "ghost" };

type Props = {
  /** Landscape image for tablet/desktop. */
  image: string;
  /** Optional portrait image for phones. */
  mobileImage?: string;
  eyebrow?: string;
  /** Each entry renders on its own line and rises in sequence. */
  lines: string[];
  lede?: ReactNode;
  actions?: Action[];
  size?: "full" | "page";
  objectPosition?: string;
  mobileObjectPosition?: string;
  scrollCue?: boolean;
};

export function HeroSection({
  image,
  mobileImage,
  eyebrow,
  lines,
  lede,
  actions = [],
  size = "full",
  objectPosition,
  mobileObjectPosition,
  scrollCue = size === "full",
}: Props) {
  const root = useRef<HTMLElement>(null);
  const desktop = img(image);
  const mobile = mobileImage ? img(mobileImage) : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo("[data-hero-media]", { scale: 1.18 }, { scale: 1, duration: 2.6, ease: "power2.out" }, 0)
          .fromTo("[data-hero-shade]", { opacity: 1 }, { opacity: 0, duration: 1.6 }, 0)
          .fromTo("[data-hero-eyebrow]", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2 }, 0.35)
          .fromTo("[data-hero-word]", { yPercent: 110, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1.5, stagger: 0.06 }, 0.45)
          .fromTo("[data-hero-fade]", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.2, stagger: 0.12 }, 1.0);

        // Drift the photograph and fade the copy as the hero scrolls away.
        gsap.to("[data-hero-parallax]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-copy]", {
          yPercent: -25,
          autoAlpha: 0.1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className={clsx(
        "relative isolate flex items-end overflow-hidden bg-charcoal text-ivory",
        size === "full" ? "min-h-[100svh]" : "min-h-[78svh] lg:min-h-[82svh]"
      )}
    >
      <div data-hero-parallax className="absolute inset-0 -z-10">
        <div data-hero-media className="absolute inset-0">
          <Image
            src={desktop.src}
            alt={desktop.alt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={desktop.blurDataURL}
            className={clsx("object-cover", mobile && "hidden sm:block")}
            style={{ objectPosition: objectPosition ?? desktop.position }}
          />
          {mobile && (
            <Image
              src={mobile.src}
              alt={mobile.alt}
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={mobile.blurDataURL}
              className="object-cover sm:hidden"
              style={{ objectPosition: mobileObjectPosition ?? mobile.position }}
            />
          )}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(41_39_37/0.96)_0%,rgb(41_39_37/0.82)_42%,rgb(41_39_37/0.35)_70%,rgb(41_39_37/0.2)_100%)] lg:bg-[linear-gradient(to_top,#292725_0%,rgb(41_39_37/0.45)_50%,rgb(41_39_37/0.3)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/55 via-transparent to-transparent" />
      <div data-hero-shade className="pointer-events-none absolute inset-0 -z-10 bg-charcoal opacity-0" />

      <div
        data-hero-copy
        className={clsx(
          "container-luxe relative grid gap-8 lg:grid-cols-[1.9fr_1fr] lg:items-end lg:gap-12",
          size === "full" ? "pb-24 pt-40 lg:pb-20" : "pb-16 pt-36 lg:pb-20"
        )}
      >
        <div>
        {eyebrow && (
          <p data-hero-eyebrow className="eyebrow mb-6 text-gold">
            {eyebrow}
          </p>
        )}
        <h1 className={clsx(size === "full" ? "display-xl" : "display-lg", "max-w-4xl")}>
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block overflow-hidden pb-[0.12em] align-top">
                  <span data-hero-word className={clsx("inline-block", li === lines.length - 1 && size === "full" && "italic text-gold")}>
                    {word}
                    {wi < line.split(" ").length - 1 ? " " : ""}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        </div>
        <div className="lg:pb-3">
        {lede && (
          <div data-hero-fade className="lede max-w-xl text-ivory/85">
            {lede}
          </div>
        )}
        {actions.length > 0 && (
          <div data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {actions.map((a) => (
              <Link key={`${a.href}-${a.label}`} href={a.href} className={clsx("btn", a.variant === "ghost" ? "btn-ghost-light" : "btn-gold")}>
                {a.label}
              </Link>
            ))}
          </div>
        )}
        </div>
      </div>

      {scrollCue && (
        <div data-hero-fade className="absolute bottom-8 right-6 hidden flex-col items-center gap-3 text-ivory/70 md:flex lg:hidden">
          <span className="text-[0.65rem] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Scroll</span>
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
        </div>
      )}
    </section>
  );
}
