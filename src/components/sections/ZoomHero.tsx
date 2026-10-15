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
  image: string;
  mobileImage?: string;
  eyebrow: string;
  /** Two words that part to either side as the photograph zooms through. */
  split: [string, string];
  /** Headline revealed once the photograph fills the screen. */
  lines: string[];
  lede?: ReactNode;
  actions?: Action[];
};

/** Card frame for each breakpoint — must match the CSS in globals.css. */
const CARD = {
  desktop: "inset(20% 34% 15% 34% round 18px)",
  mobile: "inset(30% 8% 24% 8% round 14px)",
};
const FULL = "inset(0% 0% 0% 0% round 0px)";

/**
 * Scroll-driven "zoom-through" hero.
 * The section pins; the headline splits apart while the photograph grows from
 * a framed card to fill the screen, then the main headline and actions rise in.
 * Without JavaScript or with reduced motion it renders the final, full-bleed state.
 */
export function ZoomHero({
  image,
  mobileImage,
  eyebrow,
  split,
  lines,
  lede,
  actions = [],
}: Props) {
  const root = useRef<HTMLElement>(null);
  const desktop = img(image);
  const mobile = mobileImage ? img(mobileImage) : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: `${MOTION_OK} and (min-width: 1024px)`,
          mobile: `${MOTION_OK} and (max-width: 1023.98px)`,
        },
        (ctx) => {
          const card = ctx.conditions?.desktop ? CARD.desktop : CARD.mobile;
          // How far each word travels off-screen, in px (recomputed on resize).
          const travel = () =>
            window.innerWidth * (ctx.conditions?.desktop ? 0.45 : 0.9);

          // Arrival: the card and words settle in.
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .fromTo(
              "[data-zh-frame]",
              { scale: 0.82, autoAlpha: 0 },
              { scale: 1, autoAlpha: 1, duration: 1.8 },
              0,
            )
            .fromTo(
              "[data-zh-word]",
              { yPercent: 110 },
              { yPercent: 0, duration: 1.6, stagger: 0.12 },
              0.25,
            )
            .fromTo(
              "[data-zh-fade]",
              { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.1 },
              0.6,
            );

          // Scroll: zoom through.
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "+=170%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              "[data-zh-frame]",
              { clipPath: card },
              { clipPath: FULL, duration: 1, ease: "power2.inOut" },
              0,
            )
            .fromTo(
              "[data-zh-img]",
              { scale: 0.8 },
              { scale: 1, duration: 1, ease: "power2.inOut" },
              0,
            )
            .to(
              "[data-zh-left]",
              {
                x: () => -travel(),
                autoAlpha: 0,
                duration: 0.7,
                ease: "power2.in",
              },
              0,
            )
            .to(
              "[data-zh-right]",
              {
                x: () => travel(),
                autoAlpha: 0,
                duration: 0.7,
                ease: "power2.in",
              },
              0,
            )
            .to("[data-zh-chrome]", { autoAlpha: 0, duration: 0.25 }, 0)
            .fromTo(
              "[data-zh-shade]",
              { opacity: 0 },
              { opacity: 1, duration: 0.5 },
              0.45,
            )
            .fromTo(
              "[data-zh-final] [data-zh-rise]",
              { y: 70, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.35,
                stagger: 0.06,
                ease: "power3.out",
              },
              0.78,
            )
            .set("[data-zh-final]", { autoAlpha: 1 }, 0.78);
        },
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="zoom-hero relative isolate h-[100svh] overflow-hidden bg-ivory text-ivory"
    >
      {/* Backdrop: warm ivory with a faint, light vignette */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,#fbf8f2_0%,#f5f0e7_55%,#ece4d6_100%)]" />
      {/* Photograph (clip-path grows from card to full screen) */}
      <div
        data-zh-frame
        className="absolute inset-0 overflow-hidden will-change-[clip-path]"
      >
        <div data-zh-img className="absolute inset-0 will-change-transform">
          <Image
            src={desktop.src}
            alt={desktop.alt}
            fill
            priority
            sizes="100vw"
            placeholder="blur"
            blurDataURL={desktop.blurDataURL}
            className={clsx("object-cover", mobile && "hidden sm:block")}
            style={{ objectPosition: desktop.position }}
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
              style={{ objectPosition: mobile.position }}
            />
          )}
        </div>
        <div
          data-zh-shade
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(41_39_37/0.96)_0%,rgb(41_39_37/0.82)_42%,rgb(41_39_37/0.35)_70%,rgb(41_39_37/0.2)_100%)] lg:bg-[linear-gradient(to_top,#292725_0%,rgb(41_39_37/0.45)_50%,rgb(41_39_37/0.3)_100%)]"
        />
      </div>

      {/* Intro: words parting around the card (decorative — the real heading is below) */}
      <div
        data-zh-intro
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        {/* The arrival animation fades the inner items in; scrolling fades this wrapper out. */}
        <div data-zh-chrome className="absolute inset-0">
          <p
            data-zh-fade
            className="eyebrow absolute inset-x-0 top-[calc(30%-6.25rem)] justify-center text-[0.68rem] text-gold-deep lg:top-[calc(20%-2.6rem)]"
          >
            {eyebrow}
          </p>
          <p
            data-zh-fade
            className="absolute inset-x-0 bottom-[4.5%] hidden flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.32em] text-charcoal/55 lg:flex"
          >
            Scroll to explore
            <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
          </p>
        </div>
        <span
          data-zh-left
          className="absolute inset-x-0 top-[calc(30%-4.6rem)] block text-center font-display text-[clamp(2.5rem,4.2vw,4.5rem)] font-normal leading-none tracking-[-0.01em] text-charcoal lg:inset-x-auto lg:right-[calc(66%+2.75rem)] lg:top-[52.5%] lg:-translate-y-1/2 lg:text-right"
        >
          <span className="inline-block overflow-hidden pb-[0.1em]">
            <span data-zh-word className="inline-block">
              {split[0]}
            </span>
          </span>
        </span>
        <span
          data-zh-right
          className="absolute inset-x-0 top-[calc(76%+1.25rem)] block text-center font-display text-[clamp(2.5rem,4.2vw,4.5rem)] font-normal italic leading-none tracking-[-0.01em] text-forest lg:inset-x-auto lg:left-[calc(66%+2.75rem)] lg:top-[52.5%] lg:-translate-y-1/2 lg:text-left"
        >
          <span className="inline-block overflow-hidden pb-[0.1em]">
            <span data-zh-word className="inline-block">
              {split[1]}
            </span>
          </span>
        </span>
      </div>

      {/* Final state */}
      <div data-zh-final className="absolute inset-0 flex items-end">
        <div className="container-luxe grid gap-8 pb-24 pt-40 lg:grid-cols-[1.9fr_1fr] lg:items-end lg:gap-12 lg:pb-20">
          <div>
            <p data-zh-rise className="eyebrow mb-6 text-gold">
              {eyebrow}
            </p>
            <h1 className="max-w-4xl font-display text-[clamp(2.4rem,4.6vw,4.75rem)] leading-[1.05]">
              {lines.map((line, i) => (
                <span
                  key={line}
                  data-zh-rise
                  className={clsx(
                    "block",
                    i === lines.length - 1 &&
                      lines.length > 1 &&
                      "italic text-ivory/90",
                  )}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>
          <div className="lg:pb-3">
            {lede && (
              <div data-zh-rise className="lede hidden max-w-xl text-ivory/85 sm:block">
                {lede}
              </div>
            )}
            {actions.length > 0 && (
              <div
                data-zh-rise
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
              >
                {actions.map((a) => (
                  <Link
                    key={`${a.href}-${a.label}`}
                    href={a.href}
                    className={clsx(
                      "btn",
                      a.variant === "ghost" ? "btn-ghost-light" : "btn-gold",
                    )}
                  >
                    {a.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
