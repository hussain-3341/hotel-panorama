import {
  BedDouble, Sparkles, UtensilsCrossed, ConciergeBell, Wifi, BellRing, Snowflake,
  Presentation, Sofa, Sparkle, KeyRound, MapPin, type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import type { Facility } from "@/content/site";

const ICONS: Record<string, LucideIcon> = {
  BedDouble, Sparkles, UtensilsCrossed, ConciergeBell, Wifi, BellRing, Snowflake, Presentation, Sofa, Sparkle, KeyRound, MapPin,
};

/** Facility cards: light, evenly sized, with an icon badge and a gold rule. */
export function AmenitiesSection({ items }: { items: Facility[] }) {
  return (
    <Reveal as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06} y={30}>
      {items.map((f) => {
        const Icon = ICONS[f.icon] ?? Sparkle;
        return (
          <li
            key={f.title}
            data-reveal
            className="group flex h-full flex-col rounded-xl border border-charcoal/10 bg-white p-7 shadow-[0_1px_2px_rgb(41_39_37/0.04)] transition-[translate,border-color,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_22px_45px_-24px_rgb(48_61_50/0.35)] lg:p-8"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest/[0.07] text-forest ring-1 ring-forest/10 transition-colors duration-500 group-hover:bg-forest group-hover:text-ivory">
              <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </span>
            <h3 className="mt-6 font-display text-[1.55rem] leading-tight text-charcoal">{f.title}</h3>
            <span aria-hidden className="mt-4 h-px w-10 bg-gold transition-[width] duration-500 group-hover:w-16" />
            <p className="mt-4 text-[0.92rem] leading-relaxed text-charcoal/70">{f.text}</p>
          </li>
        );
      })}
    </Reveal>
  );
}
