import Link from "next/link";
import type { ReactNode } from "react";
import { Mail, MapPin, Phone, MessageCircle, ArrowUpRight, Clock } from "lucide-react";
import { Logo } from "./Logo";
import { InstagramIcon, FacebookIcon } from "@/components/ui/BrandIcons";
import { hotel, nav, mapsDirectionsUrl } from "@/content/site";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-6 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold">{title}</h3>
      {children}
    </div>
  );
}

const linkClass = "text-ivory/75 transition-colors duration-300 hover:text-gold";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-forest-deep text-sm text-ivory/70" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Hotel Panorama — contact and site information</h2>
      <div aria-hidden className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="container-luxe">
        {/* Brand row */}
        <div className="flex flex-col items-center gap-10 border-b border-ivory/10 py-16 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-20 lg:text-left">
          <Link href="/" aria-label="Hotel Panorama — home" className="shrink-0">
            <Logo variant="full" tone="light" sizes="200px" className="!h-auto !w-[180px] lg:!w-[200px]" />
          </Link>
          <p className="max-w-md font-display text-[1.75rem] leading-snug text-ivory lg:text-[2rem]">
            Comfortable rooms and elegant banquets in the heart of Satellite, Ahmedabad.
          </p>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col xl:flex-row">
            <Link href="/enquire?type=room" className="btn btn-gold">Room enquiry</Link>
            <Link href="/enquire?type=banquet" className="btn btn-ghost-light">Banquet enquiry</Link>
          </div>
        </div>

        {/* Information columns */}
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.1fr_1fr_1fr] lg:gap-10">
          <Column title="Visit">
            <address className="space-y-4 not-italic">
              <p className="flex gap-3 leading-relaxed text-ivory/85">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  {hotel.address.street},<br />
                  {hotel.address.locality}, {hotel.address.city} – {hotel.address.postalCode}
                  <br />
                  {hotel.address.region}, India
                </span>
              </p>
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 pl-7 text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-ivory"
              >
                Get directions <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </address>
          </Column>

          <Column title="Contact">
            <ul className="space-y-3.5">
              {hotel.phones.map((p) => (
                <li key={p.href}>
                  <a href={p.href} className={`flex items-center gap-3 ${linkClass}`}>
                    <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden /> {p.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={hotel.whatsapp.href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 ${linkClass}`}>
                  <MessageCircle className="h-4 w-4 shrink-0 text-gold" aria-hidden /> WhatsApp us
                </a>
              </li>
              <li>
                <a href={`mailto:${hotel.email}`} className={`flex items-center gap-3 ${linkClass}`}>
                  <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                  {/* Let long addresses wrap at the @ rather than mid-word. */}
                  <span>
                    {hotel.email.split("@")[0]}
                    <wbr />@{hotel.email.split("@")[1]}
                  </span>
                </a>
              </li>
            </ul>
          </Column>

          <Column title="Explore">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3.5 lg:grid-cols-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className={linkClass}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </Column>

          <Column title="Your stay">
            <dl className="space-y-4">
              {[
                ["Check-in", hotel.checkIn],
                ["Check-out", hotel.checkOut],
                ["Visitor hours", hotel.visitorHours],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-ivory/10 pb-3">
                  <dt className="text-ivory/60">{k}</dt>
                  <dd className="text-right text-ivory">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex items-center gap-2 text-ivory/60">
              <Clock className="h-4 w-4 text-gold" aria-hidden /> Reception open 24 × 7
            </p>
          </Column>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-ivory/10 bg-black/15">
        <div className="container-luxe flex flex-col items-center gap-5 py-6 text-xs text-ivory/55 md:flex-row md:justify-between">
          <p>© {year} Hotel Panorama, Ahmedabad. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-gold">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold">Terms of Use</Link>
            <Link href="/contact" className="hover:text-gold">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            {[
              { href: hotel.social.instagram, label: "Hotel Panorama on Instagram", icon: <InstagramIcon className="h-4 w-4" /> },
              { href: hotel.social.facebook, label: "Hotel Panorama on Facebook", icon: <FacebookIcon className="h-4 w-4" /> },
              { href: hotel.whatsapp.href, label: "Message Hotel Panorama on WhatsApp", icon: <MessageCircle className="h-4 w-4" /> },
            ].map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-ivory/15 text-ivory/75 transition-colors hover:border-gold hover:text-gold"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
