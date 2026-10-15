import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ZoomHero } from "@/components/sections/ZoomHero";
import { StickyStory } from "@/components/sections/StickyStory";
import { RoomShowcase } from "@/components/sections/RoomShowcase";
import { BanquetShowcase } from "@/components/sections/BanquetShowcase";
import { HorizontalGallery } from "@/components/sections/HorizontalGallery";
import { AmenitiesSection } from "@/components/sections/AmenitiesSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { hotel, rooms, venues, facilities, dining } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <ZoomHero
        image="ext-facade-dusk"
        mobileImage="ext-street-portrait"
        eyebrow="Satellite · Ahmedabad"
        split={["Experience", "Comfort."]}
        lines={["Experience Comfort.", "Celebrate Moments.", "Stay at Panorama."]}
        lede={
          <p>
            Rooms, conference and banquet at Anandnagar Cross Road — a warm, contemporary hotel in one of Ahmedabad’s
            most connected neighbourhoods.
          </p>
        }
        actions={[
          { href: "/rooms", label: "Explore Our Rooms" },
          { href: "/banquets", label: "Explore Banquets", variant: "ghost" },
        ]}
      />

      {/* About */}
      <section className="relative overflow-hidden py-24 lg:py-36" aria-labelledby="about-heading">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
          <div>
            <Reveal>
              <p data-reveal className="eyebrow text-gold-deep">Welcome to Panorama</p>
              <h2 id="about-heading" data-reveal className="display-lg mt-5">
                A considered stay, <em className="text-forest">close to everything</em>
              </h2>
              <p data-reveal className="lede mt-7 text-charcoal/75">
                From the moment you step beneath the crystal chandelier at reception, Hotel Panorama is about warmth and
                ease — timber and marble interiors, rooms finished with care, and halls made for the occasions that
                matter.
              </p>
              <p data-reveal className="mt-5 leading-relaxed text-charcoal/70">
                Whether you are in Ahmedabad for business, visiting family or planning a celebration, our team is here
                to look after the details.
              </p>
              <div data-reveal className="mt-10">
                <Link href="/about" className="btn btn-ghost-dark">About the hotel</Link>
              </div>
            </Reveal>

            <Reveal as="dl" className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-charcoal/15 pt-10 sm:grid-cols-4" stagger={0.08}>
              {[
                { k: "Room categories", v: String(rooms.length) },
                { k: "Event halls", v: String(venues.length) },
                { k: "Check-in", v: hotel.checkIn.replace(":00", "") },
                { k: "Reception", v: "24 / 7" },
              ].map((s) => (
                <div key={s.k} data-reveal>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-charcoal/60">{s.k}</dt>
                  <dd className="mt-2 font-display text-4xl text-forest">{s.v}</dd>
                </div>
              ))}
            </Reveal>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ParallaxImage id="lobby-reception" className="col-span-2 aspect-[3/2] rounded-sm" sizes="(min-width: 1024px) 45vw, 100vw" />
            <ParallaxImage id="lobby-lounge-detail" className="aspect-[4/3] rounded-sm" sizes="(min-width: 1024px) 22vw, 50vw" />
            <ParallaxImage id="lobby-seating" className="aspect-[4/3] rounded-sm" sizes="(min-width: 1024px) 22vw, 50vw" />
          </div>
        </div>
      </section>

      <StickyStory
        heading="From a warm welcome to a night to remember"
        steps={[
          { image: "lobby-reception", eyebrow: "Arrive", title: "A welcome beneath the chandelier", text: "Our reception is open around the clock, with a timber-panelled lounge to settle into as you arrive.", href: "/about", cta: "About Panorama" },
          { image: "royal-crest-suite", eyebrow: "Rest", title: "Rooms finished with care", text: "Three room categories — Royal Crest, Elegance and Twin Elegance — each with soft linens, warm timber and a calm, considered palette.", href: "/rooms", cta: "Explore our rooms" },
          { image: "restaurant-dining-room", eyebrow: "Dine", title: dining.name, text: dining.intro, href: "/dining", cta: "Discover dining" },
          { image: "rivazz-symmetry", eyebrow: "Celebrate", title: "Halls for life’s big moments", text: "Rivazz Hall and Horizon Hall host weddings, receptions, family celebrations and corporate gatherings.", href: "/banquets", cta: "Explore banquets" },
        ]}
      />

      {/* Rooms */}
      <section className="py-24 lg:py-36" aria-labelledby="rooms-heading">
        <div className="container-luxe">
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Rooms & accommodation"
              title={<span id="rooms-heading">Three ways to stay</span>}
              lede="King, queen or twin — every room pairs soft white linens with warm timber, framed art and an en-suite bathroom."
            />
            <Link href="/rooms" className="group inline-flex shrink-0 items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-forest">
              <span className="link-underline">All rooms</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>
          <RoomShowcase rooms={rooms} />
        </div>
      </section>

      <BanquetShowcase venues={venues} />

      {/* Facilities */}
      <section className="py-24 lg:py-36" aria-labelledby="facilities-heading">
        <div className="container-luxe">
          <div className="mb-14 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Facilities & services"
              title={<span id="facilities-heading">Everything in its place</span>}
              lede="Thoughtful essentials for business travellers, families and event guests alike."
            />
            <Link href="/facilities" className="btn btn-primary shrink-0">All facilities</Link>
          </div>
          <AmenitiesSection items={facilities.slice(0, 8)} />
        </div>
      </section>

      {/* Dining */}
      <section className="overflow-hidden bg-ivory-deep py-24 lg:py-36" aria-labelledby="dining-heading">
        <div className="container-luxe grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div className="grid grid-cols-2 gap-4">
            <ParallaxImage id="restaurant-ceiling" className="col-span-2 aspect-[3/2] rounded-sm" sizes="(min-width: 1024px) 50vw, 100vw" />
            <ParallaxImage id="restaurant-buffet" className="aspect-[4/3] rounded-sm" sizes="(min-width: 1024px) 25vw, 50vw" />
            <ParallaxImage id="restaurant-tables" className="aspect-[4/3] rounded-sm" sizes="(min-width: 1024px) 25vw, 50vw" />
          </div>
          <Reveal>
            <p data-reveal className="eyebrow text-gold-deep">Dining</p>
            <h2 id="dining-heading" data-reveal className="display-lg mt-5">{dining.name}</h2>
            <p data-reveal className="lede mt-7 text-charcoal/75">{dining.intro}</p>
            <p data-reveal className="mt-5 leading-relaxed text-charcoal/70">
              Terracotta walls, a ceiling of glowing lamps, upholstered chairs and a dedicated buffet counter make for an
              easy, unhurried place to gather.
            </p>
            <div data-reveal className="mt-10 flex flex-wrap gap-3">
              <Link href="/dining" className="btn btn-primary">Discover dining</Link>
              <Link href="/contact" className="btn btn-ghost-dark">Ask about meals</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <HorizontalGallery
        eyebrow="Gallery"
        title="Inside Hotel Panorama"
        ids={["rivazz-symmetry", "elegance-terracotta", "lobby-lounge-reception", "horizon-arch", "restaurant-wide", "royal-crest-swans", "lobby-lounge", "ext-night-aerial", "twin-sage", "rivazz-buffet-wide"]}
      />

      <LocationSection />

      <BookingCTA />
    </>
  );
}
