import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { LocationSection } from "@/components/sections/LocationSection";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { hotel, rooms, venues, dining } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Hotel Panorama — rooms, conference and banquet at Anandnagar Cross Road, Satellite, Ahmedabad.",
  alternates: { canonical: "/about" },
};

const expectations = [
  { title: "A warm welcome", text: "A reception that never closes, a lounge to settle into, and a team that treats every guest personally." },
  { title: "Rooms finished with care", text: `${rooms.map((r) => r.name).join(", ").replace(/, ([^,]*)$/, " and $1")} — king, queen and twin rooms in warm timber and soft ivory.` },
  { title: "Spaces to celebrate", text: `${venues.map((v) => v.name).join(" and ")}, each with a built-in buffet counter and flexible layouts.` },
  { title: "Dining in-house", text: `${dining.name}, a warm room of terracotta and lamplight just off the lobby.` },
];

export default function AboutPage() {
  return (
    <>
      <HeroSection
        size="page"
        image="ext-night-aerial"
        eyebrow="About Hotel Panorama"
        lines={["Rooms. Conference.", "Banquet."]}
        lede={<p>A contemporary hotel at Anandnagar Cross Road in Satellite, Ahmedabad — built for comfortable stays and the occasions that bring people together.</p>}
      />

      {/* Editorial intro */}
      <section className="py-24 lg:py-36">
        <div className="container-luxe">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p data-reveal className="eyebrow justify-center text-gold-deep">Our philosophy</p>
            <p data-reveal className="mt-8 font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.2] text-charcoal">
              We believe hospitality lives in the details — a quiet room after a long day, a table set just so, a hall
              that makes a family celebration feel <em className="text-forest">effortless</em>.
            </p>
          </Reveal>

          <div className="mt-24 grid gap-6 md:grid-cols-2">
            <ParallaxImage id="lobby-reception" className="aspect-[3/2] rounded-sm" sizes="(min-width: 768px) 50vw, 100vw" />
            <ParallaxImage id="lobby-lounge-wide" className="aspect-[3/2] rounded-sm" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <Reveal className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-12">
            <p data-reveal className="leading-relaxed text-charcoal/75">
              Step inside and you’re greeted by timber-panelled walls, polished marble floors and a crystal
              chandelier above the reception desk, where the Panorama emblem glows against veined stone.
            </p>
            <p data-reveal className="leading-relaxed text-charcoal/75">
              Beyond the lobby are our rooms, our restaurant and two event halls — all designed in the same warm,
              contemporary language of wood, stone and soft light.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-ivory-deep py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="What to expect" title="Everything under one roof" className="mb-16" />
          <Reveal as="ol" className="grid gap-px overflow-hidden rounded-sm bg-charcoal/10 md:grid-cols-2" stagger={0.1}>
            {expectations.map((e, i) => (
              <li key={e.title} data-reveal className="bg-ivory p-8 lg:p-12">
                <span className="font-display text-5xl italic text-gold">0{i + 1}</span>
                <h3 className="mt-5 font-display text-3xl">{e.title}</h3>
                <p className="mt-3 leading-relaxed text-charcoal/70">{e.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2">
          <ParallaxImage id="housekeeping-bed" className="aspect-[3/2] rounded-sm" sizes="(min-width: 1024px) 50vw, 100vw" />
          <div>
            <SectionHeading eyebrow="Hotel highlights" title="At a glance" />
            <Reveal as="dl" className="mt-10 divide-y divide-charcoal/15 border-y border-charcoal/15" stagger={0.06}>
              {[
                ["Location", `${hotel.address.street}, ${hotel.address.locality}`],
                ["Rooms", `${rooms.length} categories — ${rooms.map((r) => r.name).join(", ")}`],
                ["Event halls", venues.map((v) => v.name).join(" & ")],
                ["Dining", dining.name],
                ["Reception", hotel.receptionHours],
                ["Check-in / out", `${hotel.checkIn} / ${hotel.checkOut}`],
              ].map(([k, v]) => (
                <div key={k} data-reveal className="grid grid-cols-[8.5rem_1fr] gap-4 py-4 text-[0.95rem]">
                  <dt className="text-charcoal/60">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              {[
                ["/rooms", "Our rooms"],
                ["/banquets", "Banquets"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-forest">
                  <span className="link-underline">{label}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LocationSection />
      <BookingCTA image="ext-facade-upward" />
    </>
  );
}
