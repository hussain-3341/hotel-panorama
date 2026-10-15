"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Phone, ArrowUpRight, MessageCircle, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { hotel, nav } from "@/content/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { setScrollLocked } from "@/components/motion/SmoothScroll";

/** Pages whose first section is a full-bleed dark photo (nav starts transparent).
 *  Zoom-hero pages open on ivory, so they get the solid bar from the start. */
const DARK_HERO = ["/gallery", "/facilities", "/about"];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const overHero = DARK_HERO.includes(pathname) || pathname.startsWith("/rooms/");
  const solid = scrolled || !overHero || open;

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > last + 4);
      if (y < last - 4) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    setScrollLocked(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useGSAP(
    () => {
      if (!open || !panel.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(panel.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.out" });
        gsap.fromTo("[data-menu-item]", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.05, delay: 0.15, duration: 0.8 });
      });
      return () => mm.revert();
    },
    { dependencies: [open] }
  );

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded bg-ivory px-4 py-2 text-charcoal focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)]",
          solid || open ? "bg-forest/95 shadow-[0_1px_0_rgb(201_163_111/0.25)] backdrop-blur-md" : "bg-gradient-to-b from-charcoal/60 to-transparent",
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <nav
          aria-label="Main"
          className={clsx("container-luxe flex items-center justify-between gap-4 transition-[height] duration-500", solid ? "h-[4.5rem] lg:h-[5.25rem]" : "h-[4.5rem] lg:h-28")}
        >
          <Link href="/" aria-label="Hotel Panorama — home" className="relative z-10 flex shrink-0 items-center">
            {/* Compact lockup on phones/tablets, full logo with tagline on desktop */}
            <Logo variant="mark" priority sizes="100px" className="!h-12 lg:hidden" />
            <Logo
              variant="full"
              priority
              sizes="130px"
              className={clsx("hidden transition-[height] duration-500 lg:block", solid ? "lg:!h-[4.25rem]" : "lg:!h-[5.5rem]")}
            />
          </Link>

          <ul className="hidden items-center gap-8 xl:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "link-underline pb-1 text-[0.74rem] font-semibold uppercase tracking-[0.2em] transition-colors",
                      active ? "text-gold" : "text-ivory/90 hover:text-ivory"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={hotel.phones[0].href}
              className="hidden items-center gap-2 text-[0.74rem] font-semibold tracking-[0.12em] text-ivory/90 hover:text-gold md:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {hotel.phones[0].label}
            </a>
            <Link href="/enquire" className="btn btn-gold hidden !min-h-10 !px-5 !py-2 sm:inline-flex">
              Enquire
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="group relative z-10 flex h-11 items-center gap-3 rounded-full pl-3 pr-1 text-ivory xl:hidden"
            >
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-ivory/85">{open ? "Close" : "Menu"}</span>
              <span className="relative grid h-10 w-10 place-items-center rounded-full border border-ivory/25 transition-colors group-hover:border-gold">
                <span
                  aria-hidden
                  className={clsx(
                    "absolute h-px w-[18px] bg-current transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                    open ? "rotate-45" : "-translate-y-[4px]"
                  )}
                />
                <span
                  aria-hidden
                  className={clsx(
                    "absolute h-px bg-current transition-[transform,width] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                    open ? "w-[18px] -rotate-45" : "w-3 translate-x-[3px] translate-y-[4px]"
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          data-lenis-prevent
          className="fixed inset-0 z-[45] flex flex-col overflow-y-auto bg-forest-deep pt-[4.5rem] text-ivory lg:pt-28 xl:hidden"
        >
          <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <ul className="container-luxe flex flex-col pt-4">
            {[{ href: "/", label: "Home" }, ...nav].map((item, i) => {
              const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href} data-menu-item>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-center gap-4 border-b border-ivory/10 py-3"
                  >
                    <span className="w-6 text-[0.65rem] font-semibold tracking-[0.2em] text-gold/80">0{i + 1}</span>
                    <span className={clsx("flex-1 font-display text-[1.7rem] leading-tight sm:text-4xl", active ? "text-gold" : "text-ivory")}>
                      {item.label}
                    </span>
                    <ArrowUpRight
                      className="h-5 w-5 text-ivory/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div data-menu-item className="container-luxe mt-auto pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-8">
            <div className="grid grid-cols-2 gap-3">
              <a href={hotel.phones[0].href} className="btn btn-ghost-light !px-3">
                <Phone className="h-4 w-4" aria-hidden /> Call
              </a>
              <Link href="/enquire" className="btn btn-gold !px-3">
                Enquire
              </Link>
            </div>
            <a
              href={hotel.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 text-sm text-ivory/80 hover:text-gold"
            >
              <MessageCircle className="h-4 w-4 text-gold" aria-hidden /> WhatsApp {hotel.whatsapp.label}
            </a>
            <p className="mt-3 text-center text-xs leading-relaxed text-ivory/55">
              <MapPin className="mr-1.5 inline h-3.5 w-3.5 -translate-y-px text-gold/80" aria-hidden />
              {hotel.address.street}, {hotel.address.locality}, {hotel.address.city}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
