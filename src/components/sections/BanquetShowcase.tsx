import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import type { Venue } from "@/content/site";

/** Two-venue cinematic feature used on the homepage. */
export function BanquetShowcase({ venues }: { venues: Venue[] }) {
  return (
    <section className="relative bg-ivory-deep text-charcoal" aria-labelledby="banquet-heading">
      <ParallaxImage id="rivazz-aisle" className="h-[70svh] lg:h-[95svh]" strength={18} reveal={false} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70svh] bg-[linear-gradient(to_bottom,transparent_45%,rgb(236_228_214/0.75)_78%,#ece4d6_100%)] lg:h-[95svh]" />

      <div className="container-luxe relative z-[2] -mt-28 pb-24 lg:-mt-44 lg:pb-36">
        <Reveal className="max-w-3xl">
          <p data-reveal className="eyebrow text-gold-deep">Banquets &amp; events</p>
          <h2 id="banquet-heading" data-reveal className="display-lg mt-5">
            Celebrate your special moments at <em className="text-forest">Panorama</em>
          </h2>
          <p data-reveal className="lede mt-6 text-charcoal/75">
            Two beautifully finished halls — Rivazz Hall beneath its crystal ceiling, and the warm, timber-panelled
            Horizon Hall — for weddings, receptions, family celebrations and corporate gatherings.
          </p>
        </Reveal>

        <Reveal className="mt-16 grid gap-10 md:grid-cols-2" stagger={0.18} y={60}>
          {venues.map((v) => (
            <article key={v.slug} data-reveal className="group">
              <Link href={`/banquets#${v.slug}`} className="block">
                <ParallaxImage id={v.hero} className="zoom-frame aspect-[16/11] rounded-sm" sizes="(min-width: 768px) 45vw, 100vw" strength={10} />
              </Link>
              <h3 className="mt-6 font-display text-3xl lg:text-4xl">{v.name}</h3>
              <p className="mt-2 text-charcoal/70">{v.summary}</p>
              <Link href={`/banquets#${v.slug}`} className="mt-5 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-forest">
                <span className="link-underline">Discover {v.name}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden />
              </Link>
            </article>
          ))}
        </Reveal>

        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <Link href="/banquets" className="btn btn-primary">Explore Banquets</Link>
          <Link href="/enquire?type=banquet" className="btn btn-ghost-dark">Plan Your Event</Link>
        </div>
      </div>
    </section>
  );
}
