import type { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Check, Clock, Camera } from "lucide-react";
import { ZoomHero } from "@/components/sections/ZoomHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Photo } from "@/components/ui/Photo";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { BookingCTA } from "@/components/sections/BookingCTA";
import { hotel, rooms } from "@/content/site";
import { img } from "@/content/images";

export const metadata: Metadata = {
  title: "Rooms & Accommodation",
  description:
    "Royal Crest (king bed), Elegance (queen bed) and Twin Elegance (two single beds) rooms at Hotel Panorama, Satellite, Ahmedabad. Check-in 11:00 AM, check-out 10:00 AM.",
  alternates: { canonical: "/rooms" },
};

export default function RoomsPage() {
  // A curated selection — the full set lives on the Gallery page.
  const roomImages = [
    "royal-crest-windows",
    "twin-sage-curtain",
    "room-guest",
    "elegance-sage-wide",
    "royal-crest-bath",
    "twin-sage-front",
    "elegance-sage-window",
    "twin-terracotta-wide",
    "room-guest-wide",
  ].map(img);
  return (
    <>
      <ZoomHero
        image="royal-crest-window"
        eyebrow="Rooms & accommodation"
        split={["Rest", "Beautifully"]}
        lines={["Rest, beautifully", "considered."]}
        lede={<p>Three room categories finished in warm timber, soft ivory and terracotta or sage — each with an en-suite bathroom and everything you need for a restful stay.</p>}
        actions={[
          { href: "/enquire?type=room", label: "Request Availability" },
          { href: "#categories", label: "View room categories", variant: "ghost" },
        ]}
      />

      {/* Intro */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <SectionHeading
            eyebrow="Your stay"
            title="Calm rooms in the middle of the city"
            lede="Every room pairs crisp white linens with padded headboards, framed contemporary art and warm reading lights. Choose a king, queen or twin configuration."
          />
          <Reveal as="dl" className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-charcoal/10" stagger={0.08}>
            {[
              { k: "Check-in", v: hotel.checkIn, icon: Clock },
              { k: "Check-out", v: hotel.checkOut, icon: Clock },
              { k: "Room categories", v: String(rooms.length), icon: BedDouble },
              { k: "Reception", v: "24 hours", icon: Clock },
            ].map((s) => (
              <div key={s.k} data-reveal className="bg-ivory p-7">
                <dt className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-charcoal/60">
                  <s.icon className="h-3.5 w-3.5 text-gold-deep" aria-hidden /> {s.k}
                </dt>
                <dd className="mt-3 font-display text-4xl text-forest">{s.v}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="scroll-mt-24 pb-12" aria-label="Room categories">
        {rooms.map((room, i) => {
          const reverse = i % 2 === 1;
          return (
            <article key={room.slug} id={room.slug} className="scroll-mt-24 py-16 lg:py-24">
              <div className={`container-luxe grid items-center gap-12 lg:grid-cols-12 lg:gap-16`}>
                <div className={`lg:col-span-7 ${reverse ? "lg:order-2" : ""}`}>
                  <ParallaxImage id={room.hero} className="aspect-[3/2] rounded-sm" sizes="(min-width: 1024px) 58vw, 100vw" />
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {room.gallery.slice(1, 4).map((id) => (
                      <Link key={id} href={`/rooms/${room.slug}#gallery`} className="zoom-frame block rounded-sm" aria-label={`More ${room.name} photographs`}>
                        <Photo id={id} className="aspect-[4/3]" sizes="(min-width: 1024px) 19vw, 33vw" />
                      </Link>
                    ))}
                  </div>
                </div>
                <Reveal className={`lg:col-span-5 ${reverse ? "lg:order-1" : ""}`}>
                  <p data-reveal className="font-display text-6xl italic text-gold">0{i + 1}</p>
                  <p data-reveal className="eyebrow mt-3 text-gold-deep">{room.bed}</p>
                  <h2 data-reveal className="display-lg mt-3">{room.name}</h2>
                  <p data-reveal className="lede mt-5 text-charcoal/75">{room.summary}</p>

                  <dl data-reveal className="mt-8 grid grid-cols-3 gap-4 border-y border-charcoal/15 py-5 text-sm">
                    <div><dt className="text-charcoal/60">Bed</dt><dd className="mt-1 font-semibold">{room.bed}</dd></div>
                    <div><dt className="text-charcoal/60">Occupancy</dt><dd className="mt-1 font-semibold">{room.occupancy ?? "On enquiry"}</dd></div>
                    <div><dt className="text-charcoal/60">Rate</dt><dd className="mt-1 font-semibold">{room.price ?? "On request"}</dd></div>
                  </dl>

                  <ul data-reveal className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-charcoal/80" aria-label={`${room.name} amenities`}>
                    {room.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-2"><Check className="h-4 w-4 text-forest" aria-hidden /> {a}</li>
                    ))}
                  </ul>

                  <div data-reveal className="mt-9 flex flex-wrap gap-3">
                    <Link href={`/rooms/${room.slug}`} className="btn btn-primary">Room details</Link>
                    <Link href={`/enquire?type=room&room=${room.slug}`} className="btn btn-ghost-dark">Enquire About Rooms</Link>
                  </div>
                </Reveal>
              </div>
            </article>
          );
        })}
      </section>

      {/* All room photos */}
      <section className="bg-ivory-deep py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Room gallery"
            title="Look inside"
            lede={<span className="inline-flex items-center gap-2"><Camera className="h-4 w-4" aria-hidden /> A few favourite views of our rooms. Select any image to enlarge.</span>}
            className="mb-14"
          />
          <GalleryGrid images={roomImages} />
          <div className="mt-12 text-center">
            <Link href="/gallery" className="btn btn-ghost-dark">View all photographs</Link>
          </div>
        </div>
      </section>

      {/* Housekeeping */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe grid items-center gap-14 lg:grid-cols-2">
          <ParallaxImage id="housekeeping-turndown" className="aspect-[3/2] rounded-sm" sizes="(min-width: 1024px) 50vw, 100vw" />
          <SectionHeading
            eyebrow="Housekeeping"
            title="Prepared with care, every day"
            lede={`Our housekeeping team prepares each room by hand — from smoothing the bed runner to the folded-towel details. Should you need anything during your stay, reception is ${hotel.receptionHours.toLowerCase()}.`}
          />
        </div>
      </section>

      <BookingCTA
        image={img("royal-crest-swans").id}
        eyebrow="Request availability"
        title="Tell us your dates — we’ll take care of the rest."
        text="Room rates and availability are confirmed personally by our reservations team. Send an enquiry and we’ll respond as soon as possible."
        primary={{ href: "/enquire?type=room", label: "Request Availability" }}
        secondary={{ href: "/contact", label: "Contact Reception" }}
      />
    </>
  );
}
