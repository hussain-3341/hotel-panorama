import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Utensils, Clock } from "lucide-react";
import { ZoomHero } from "@/components/sections/ZoomHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { dining, hotel } from "@/content/site";
import { byCategory } from "@/content/images";

export const metadata: Metadata = {
  title: "Dining",
  description: "Hotel Panorama Restaurant — the in-house restaurant at Hotel Panorama, Satellite, Ahmedabad, with table dining and a buffet counter.",
  alternates: { canonical: "/dining" },
};

export default function DiningPage() {
  return (
    <>
      <ZoomHero
        image="restaurant-dining-room"
        eyebrow="Dining"
        split={["Gather", "& Dine"]}
        lines={[dining.name]}
        lede={<p>{dining.intro}</p>}
        actions={[{ href: "/contact", label: "Ask about dining" }]}
      />

      <section className="py-24 lg:py-32">
        <div className="container-luxe grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
          <SectionHeading
            eyebrow="The restaurant"
            title="Warm light, generous tables"
            lede="Terracotta walls and timber panelling glow beneath a ceiling of lamps. Upholstered chairs, banquette seating along the wall and a long buffet counter with display niches make it an easy place to linger."
          />
          <div className="grid grid-cols-2 gap-4">
            <ParallaxImage id="restaurant-portrait-2" className="aspect-[3/4] rounded-sm" sizes="(min-width: 1024px) 25vw, 50vw" />
            <ParallaxImage id="restaurant-corner" className="aspect-[3/4] rounded-sm" sizes="(min-width: 1024px) 25vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="bg-mist py-24 text-charcoal lg:py-32">
        <div className="container-luxe">
          <ParallaxImage id="restaurant-buffet" className="aspect-[16/10] rounded-sm lg:aspect-[21/9]" sizes="100vw" />
          <Reveal className="mt-14 grid gap-10 md:grid-cols-3" stagger={0.12}>
            <div data-reveal>
              <Utensils className="h-7 w-7 text-gold-deep" strokeWidth={1.3} aria-hidden />
              <h2 className="mt-5 font-display text-3xl">Buffet &amp; table service</h2>
              <p className="mt-3 leading-relaxed text-charcoal/70">A dedicated buffet counter runs along the restaurant wall, alongside set tables for à-la-carte dining.</p>
            </div>
            <div data-reveal>
              <Clock className="h-7 w-7 text-gold-deep" strokeWidth={1.3} aria-hidden />
              <h2 className="mt-5 font-display text-3xl">Hours &amp; menus</h2>
              <p className="mt-3 leading-relaxed text-charcoal/70">
                {dining.hours ?? "For today’s timings, menus and cuisine, please ask at reception or call us."}
              </p>
            </div>
            <div data-reveal>
              <Phone className="h-7 w-7 text-gold-deep" strokeWidth={1.3} aria-hidden />
              <h2 className="mt-5 font-display text-3xl">Group dining</h2>
              <p className="mt-3 leading-relaxed text-charcoal/70">
                Planning a meal for a group or an event? <Link href="/enquire?type=banquet" className="text-forest underline underline-offset-4">Send us an enquiry</Link> or call {hotel.phones[0].label}.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Gallery" title="Inside the restaurant" className="mb-14" />
          <GalleryGrid images={byCategory("restaurant")} />
        </div>
      </section>

      <BookingCTA
        image="restaurant-wide"
        eyebrow="Stay & dine"
        title="A table is never far from your room."
        text="Ask our team about dining during your stay, or about catering for your celebration."
        primary={{ href: "/enquire?type=room", label: "Enquire About Rooms" }}
        secondary={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );
}
