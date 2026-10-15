import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/sections/HeroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmenitiesSection } from "@/components/sections/AmenitiesSection";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { facilities } from "@/content/site";

export const metadata: Metadata = {
  title: "Facilities & Services",
  description: "Facilities at Hotel Panorama, Ahmedabad: 24-hour reception, free Wi-Fi, room service, restaurant, Rivazz and Horizon halls, meeting set-ups and air-conditioned rooms.",
  alternates: { canonical: "/facilities" },
};

const spaces = [
  { id: "lobby-lounge", title: "Lobby & lounge", text: "Leather sofas, timber panelling and a crystal chandelier at reception.", href: "/about" },
  { id: "royal-crest-lounge", title: "Guest rooms", text: "Royal Crest, Elegance and Twin Elegance rooms with en-suite bathrooms.", href: "/rooms" },
  { id: "restaurant-ceiling", title: "Restaurant", text: "Hotel Panorama Restaurant with table dining and a buffet counter.", href: "/dining" },
  { id: "rivazz-buffet-wide", title: "Rivazz Hall", text: "Our grand banquet hall beneath a cascading crystal ceiling.", href: "/banquets#rivazz-hall" },
  { id: "horizon-podium", title: "Horizon Hall", text: "Meetings and dinners in a warm, timber-panelled setting.", href: "/banquets#horizon-hall" },
  { id: "royal-crest-bath", title: "Bathrooms", text: "Glass-enclosed showers, vessel basins and backlit mirrors.", href: "/rooms" },
];

export default function FacilitiesPage() {
  return (
    <>
      <HeroSection
        size="page"
        image="lobby-lounge-reception"
        eyebrow="Facilities & services"
        lines={["Thoughtful,", "from arrival on."]}
        lede={<p>The services and spaces available to our guests — for a comfortable stay, a productive meeting or a memorable celebration.</p>}
      />

      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Services" title="What we offer" className="mb-14" />
          <AmenitiesSection items={facilities} />
        </div>
      </section>

      <section className="bg-ivory-deep py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Spaces" title="Around the hotel" className="mb-14" />
          <Reveal className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
            {spaces.map((s) => (
              <Link key={s.id} href={s.href} data-reveal className="group block">
                <div className="zoom-frame rounded-sm">
                  <Photo id={s.id} className="aspect-[4/3]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
                </div>
                <h3 className="mt-5 font-display text-3xl"><span className="link-underline">{s.title}</span></h3>
                <p className="mt-2 text-charcoal/70">{s.text}</p>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <BookingCTA image="horizon-overview" title="Questions about our facilities?" text="Our reception team is available 24 hours a day and happy to help." />
    </>
  );
}
