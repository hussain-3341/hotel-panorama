import Link from "next/link";
import { ArrowUpRight, BedDouble } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Photo } from "@/components/ui/Photo";
import type { Room } from "@/content/site";

export function RoomCard({ room, index }: { room: Room; index: number }) {
  return (
    <article data-reveal className="group flex flex-col">
      <Link href={`/rooms/${room.slug}`} className="block" aria-label={`View ${room.name} room details`}>
        <div className="zoom-frame relative overflow-hidden rounded-sm">
          <Photo id={room.hero} className="aspect-[4/5]" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" />
          <span className="absolute left-5 top-5 font-display text-xl italic text-ivory drop-shadow">0{index + 1}</span>
          <span className="absolute bottom-5 right-5 grid h-12 w-12 translate-y-3 place-items-center rounded-full bg-ivory text-charcoal opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" aria-hidden />
          </span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col pt-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">
          <BedDouble className="h-4 w-4" aria-hidden /> {room.bed}
        </p>
        <h3 className="mt-3 font-display text-3xl lg:text-4xl">
          <Link href={`/rooms/${room.slug}`} className="link-underline">
            {room.name}
          </Link>
        </h3>
        <p className="mt-3 text-[0.97rem] leading-relaxed text-charcoal/75">{room.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${room.name} amenities`}>
          {room.amenities.map((a) => (
            <li key={a} className="rounded-full border border-charcoal/15 px-3 py-1 text-xs text-charcoal/80">
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-7">
          <Link href={`/rooms/${room.slug}`} className="btn btn-ghost-dark !min-h-11 !px-5 !py-2.5">
            View room
          </Link>
          <Link href={`/enquire?type=room&room=${room.slug}`} className="btn btn-primary !min-h-11 !px-5 !py-2.5">
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}

export function RoomShowcase({ rooms }: { rooms: Room[] }) {
  return (
    <Reveal className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" stagger={0.15} y={60}>
      {rooms.map((r, i) => (
        <RoomCard key={r.slug} room={r} index={i} />
      ))}
    </Reveal>
  );
}
