"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Phone } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { img } from "@/content/images";
import { hotel } from "@/content/site";

type Props = {
  image?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
};

/** Full-bleed closing call to action; the photo settles as the panel opens. */
export function BookingCTA({
  image = "ext-night-aerial",
  eyebrow = "Plan your visit",
  title = "Your room, your celebration — let’s begin.",
  text = "Send us your dates and requirements. Our team will check availability and get back to you personally.",
  primary = { href: "/enquire?type=room", label: "Enquire About Rooms" },
  secondary = { href: "/enquire?type=banquet", label: "Enquire About Banquets" },
}: Props) {
  const root = useRef<HTMLElement>(null);
  const photo = img(image);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo("[data-cta-frame]", { clipPath: "inset(10% 6% round 1.5rem)" }, {
          clipPath: "inset(0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 20%", scrub: true },
        });
        gsap.fromTo("[data-cta-img]", { scale: 1.25 }, {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.fromTo("[data-cta-copy] > *", { y: 40, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, stagger: 0.12, duration: 1.2,
          scrollTrigger: { trigger: root.current, start: "top 55%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="bg-ivory">
      <div data-cta-frame className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <div data-cta-img className="absolute inset-0 -z-10">
          <Image src={photo.src} alt="" fill sizes="100vw" placeholder="blur" blurDataURL={photo.blurDataURL} className="object-cover" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/30" />
        <div data-cta-copy className="container-luxe flex min-h-[85svh] flex-col items-center justify-center py-28 text-center">
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 className="display-lg mt-6 max-w-4xl">{title}</h2>
          <p className="lede mt-6 max-w-xl text-ivory/80">{text}</p>
          <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Link href={primary.href} className="btn btn-gold">{primary.label}</Link>
            <Link href={secondary.href} className="btn btn-ghost-light">{secondary.label}</Link>
          </div>
          <a href={hotel.phones[0].href} className="mt-8 inline-flex items-center gap-2 text-sm text-ivory/80 hover:text-gold">
            <Phone className="h-4 w-4" aria-hidden /> Prefer to talk? Call {hotel.phones[0].label}
          </a>
        </div>
      </div>
    </section>
  );
}
