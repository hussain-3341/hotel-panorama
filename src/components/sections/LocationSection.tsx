import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { hotel, mapsDirectionsUrl, mapsEmbedUrl } from "@/content/site";

export function ContactDetails({ tone = "light" }: { tone?: "light" | "dark" }) {
  const muted = tone === "light" ? "text-ivory/70" : "text-charcoal/70";
  const strong = tone === "light" ? "text-ivory" : "text-charcoal";
  const accent = tone === "light" ? "text-gold" : "text-gold-deep";
  return (
    <dl className="grid gap-8 sm:grid-cols-2">
      <div>
        <dt className={`eyebrow mb-3 ${accent}`}><MapPin className="h-3.5 w-3.5" aria-hidden /> Address</dt>
        <dd className={strong}>
          <address className="not-italic leading-relaxed">
            {hotel.address.street},<br />
            {hotel.address.locality}, {hotel.address.city} – {hotel.address.postalCode}<br />
            {hotel.address.region}, India
          </address>
        </dd>
      </div>
      <div>
        <dt className={`eyebrow mb-3 ${accent}`}><Phone className="h-3.5 w-3.5" aria-hidden /> Telephone</dt>
        <dd className="space-y-1">
          {hotel.phones.map((p) => (
            <a key={p.href} href={p.href} className={`link-underline block text-lg ${strong}`}>{p.label}</a>
          ))}
        </dd>
      </div>
      <div>
        <dt className={`eyebrow mb-3 ${accent}`}><Mail className="h-3.5 w-3.5" aria-hidden /> Email</dt>
        <dd><a href={`mailto:${hotel.email}`} className={`link-underline break-all ${strong}`}>{hotel.email}</a></dd>
      </div>
      <div>
        <dt className={`eyebrow mb-3 ${accent}`}><Clock className="h-3.5 w-3.5" aria-hidden /> Hours</dt>
        <dd className={`space-y-1 text-sm ${muted}`}>
          <p><span className={strong}>Reception:</span> {hotel.receptionHours}</p>
          <p><span className={strong}>Check-in:</span> {hotel.checkIn} · <span className={strong}>Check-out:</span> {hotel.checkOut}</p>
          <p><span className={strong}>Visitors:</span> {hotel.visitorHours}</p>
        </dd>
      </div>
    </dl>
  );
}

export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-sm bg-charcoal/20 ${className}`}>
      <iframe
        title="Map showing Hotel Panorama, Anandnagar Cross Road, Satellite, Ahmedabad"
        src={mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 grayscale-[35%] contrast-[1.05]"
      />
    </div>
  );
}

export function LocationSection() {
  return (
    <section className="relative overflow-hidden bg-forest text-ivory" aria-labelledby="location-heading">
      <div className="container-luxe grid items-center gap-14 py-24 lg:grid-cols-[1fr_1.1fr] lg:py-32">
        <Reveal>
          <p data-reveal className="eyebrow text-gold">Location</p>
          <h2 id="location-heading" data-reveal className="display-lg mt-5">
            In the heart of <em className="text-gold">Satellite</em>, Ahmedabad
          </h2>
          <p data-reveal className="lede mt-6 max-w-lg text-ivory/75">
            Find us at Anandnagar Cross Road, near Madhur Hall — a well-connected address in one of the city’s busiest
            neighbourhoods.
          </p>
          <div className="mt-12">
            <ContactDetails />
          </div>
          <a data-reveal href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-12">
            <Navigation className="h-4 w-4" aria-hidden /> Get directions
          </a>
        </Reveal>
        <MapEmbed className="aspect-[4/5] w-full sm:aspect-[4/3] lg:aspect-[4/5]" />
      </div>
    </section>
  );
}
