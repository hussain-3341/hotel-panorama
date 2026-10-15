"use client";

import Image from "next/image";
import { useRef } from "react";
import clsx from "clsx";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { img as getImg } from "@/content/images";

type Props = {
  id: string;
  className?: string;
  sizes?: string;
  /** Percentage of travel; the image is oversized to avoid gaps. */
  strength?: number;
  priority?: boolean;
  /** Reveal with a clip-path wipe when it enters the viewport. */
  reveal?: boolean;
  objectPosition?: string;
  alt?: string;
};

/**
 * A cover-fitted photograph that drifts gently against the scroll and,
 * optionally, unveils itself with a clip-path wipe.
 */
export function ParallaxImage({ id, className, sizes = "100vw", strength = 12, priority, reveal = true, objectPosition, alt }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const image = getImg(id);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (!wrap.current || !inner.current) return;
        gsap.fromTo(
          inner.current,
          { yPercent: -strength / 2 },
          {
            yPercent: strength / 2,
            ease: "none",
            scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
        if (reveal) {
          gsap.fromTo(
            wrap.current,
            { clipPath: "inset(12% 8% 12% 8%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.6,
              ease: "expo.out",
              scrollTrigger: { trigger: wrap.current, start: "top 88%", once: true },
            }
          );
        }
      });
      return () => mm.revert();
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} className={clsx("relative overflow-hidden bg-charcoal/10", className)}>
      <div ref={inner} className="absolute inset-x-0 will-change-transform" style={{ top: `-${strength / 2 + 2}%`, bottom: `-${strength / 2 + 2}%` }}>
        <Image
          src={image.src}
          alt={alt ?? image.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={image.blurDataURL}
          className="object-cover"
          style={{ objectPosition: objectPosition ?? image.position }}
        />
      </div>
    </div>
  );
}
