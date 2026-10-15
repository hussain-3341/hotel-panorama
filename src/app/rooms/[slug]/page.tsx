import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Camera, Clock } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { Reveal } from "@/components/motion/Reveal";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { RoomCard } from "@/components/sections/RoomShowcase";
import { hotel, rooms } from "@/content/site";
import { img } from "@/content/images";

type Params = { slug: string };

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const room = rooms.find((r) => r.slug === slug);
  if (!room) return {};
  const hero = img(room.hero);
  return {
    title: `${room.name} Room`,
    description: `${room.name} at Hotel Panorama, Satellite, Ahmedabad — ${room.bed.toLowerCase()}. ${room.summary}`,
    alternates: { canonical: `/rooms/${room.slug}` },
    openGraph: { images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }] },
  };
}

export default async function RoomDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = rooms.findIndex((r) => r.slug === slug);
  if (index < 0) notFound();
  const room = rooms[index];
  const others = rooms.filter((r) => r.slug !== slug);
  const gallery = room.gallery.map(img);

  return (
    <>
      <HeroSection
        size="page"
        image={room.hero}
        eyebrow={`Room 0${index + 1} · ${room.bed}`}
        lines={[room.name]}
        lede={<p>{room.summary}</p>}
        actions={[
          { href: `/enquire?type=room&room=${room.slug}`, label: "Request Availability" },
          { href: "#gallery", label: "View photographs", variant: "ghost" },
        ]}
      />

      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <Link href="/rooms" className="mb-12 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-forest">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All rooms
          </Link>
          <div className="grid gap-16 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <p data-reveal className="eyebrow text-gold-deep">About this room</p>
              <h2 data-reveal className="display-md mt-5">{room.name}</h2>
              {room.description.map((p) => (
                <p key={p.slice(0, 20)} data-reveal className="lede mt-6 text-charcoal/75">{p}</p>
              ))}

              <div data-reveal className="mt-12 grid gap-10 sm:grid-cols-2">
                <div>
                  <h3 className="eyebrow mb-5 text-gold-deep">Amenities</h3>
                  <ul className="space-y-3">
                    {room.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-3"><Check className="h-4 w-4 text-forest" aria-hidden /> {a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow mb-5 text-gold-deep"><Camera className="h-3.5 w-3.5" aria-hidden /> In the photographs</h3>
                  <ul className="space-y-3">
                    {room.seenInPhotos.map((a) => (
                      <li key={a} className="flex items-center gap-3"><Check className="h-4 w-4 text-sage" aria-hidden /> {a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Room summary">
              <div className="rounded-sm bg-forest p-8 text-ivory lg:p-10">
                <h3 className="font-display text-3xl">At a glance</h3>
                <dl className="mt-8 divide-y divide-ivory/15 text-sm">
                  {[
                    ["Bed configuration", room.bed],
                    ["Occupancy", room.occupancy ?? "Please enquire"],
                    ["Room size", room.size ?? "Please enquire"],
                    ["Rate", room.price ?? "Shared on request"],
                    ["Check-in", hotel.checkIn],
                    ["Check-out", hotel.checkOut],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 py-3.5">
                      <dt className="text-ivory/65">{k}</dt>
                      <dd className="text-right font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 flex gap-2 text-xs leading-relaxed text-ivory/65">
                  <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  Rates and availability are confirmed by our team in response to your enquiry.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <Link href={`/enquire?type=room&room=${room.slug}`} className="btn btn-gold">Enquire About Rooms</Link>
                  <a href={hotel.phones[0].href} className="btn btn-ghost-light">Call {hotel.phones[0].label}</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 bg-ivory-deep py-24 lg:py-32">
        <div className="container-luxe">
          <h2 className="display-md mb-12">{room.name} in pictures</h2>
          <GalleryGrid images={gallery} />
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <div className="mb-14 flex items-end justify-between gap-6">
            <h2 className="display-md">Other rooms</h2>
            <Link href="/rooms" className="hidden items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-forest sm:inline-flex">
              All rooms <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <Reveal className="grid gap-12 sm:grid-cols-2" stagger={0.15}>
            {others.map((r) => (
              <RoomCard key={r.slug} room={r} index={rooms.indexOf(r)} />
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
