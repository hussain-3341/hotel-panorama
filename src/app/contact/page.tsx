import type { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Sparkles, Navigation, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactDetails, MapEmbed } from "@/components/sections/LocationSection";
import { Reveal } from "@/components/motion/Reveal";
import { hotel, mapsDirectionsUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact & Location",
  description: `Contact Hotel Panorama: ${hotel.address.full}. Call ${hotel.phones.map((p) => p.label).join(" or ")}, or email ${hotel.email}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-forest pb-20 pt-36 text-ivory lg:pt-44">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="eyebrow text-gold">Contact &amp; location</p>
            <h1 className="display-lg mt-5">We’d love to hear from you</h1>
            <p className="lede mt-6 max-w-xl text-ivory/80">
              Call, message or write to us — or visit us at Anandnagar Cross Road, Satellite. Reception is{" "}
              {hotel.receptionHours.toLowerCase()}.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={hotel.phones[0].href} className="btn btn-gold">Call {hotel.phones[0].label}</a>
              <a href={hotel.whatsapp.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
            </div>
          </div>
          <ContactDetails />
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container-luxe grid gap-6 md:grid-cols-2">
          {[
            { href: "/enquire?type=room", icon: BedDouble, title: "Room enquiry", text: "Check availability for your dates and room preference." },
            { href: "/enquire?type=banquet", icon: Sparkles, title: "Banquet enquiry", text: "Plan a wedding, celebration or corporate event in our halls." },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group flex items-start gap-6 rounded-sm border border-charcoal/15 bg-white p-8 transition-colors hover:border-forest">
              <c.icon className="h-8 w-8 shrink-0 text-gold-deep" strokeWidth={1.3} aria-hidden />
              <span>
                <span className="block font-display text-3xl group-hover:text-forest">{c.title}</span>
                <span className="mt-2 block text-charcoal/70">{c.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-24 lg:pb-32" aria-labelledby="contact-form-title">
        <div className="container-luxe grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p data-reveal className="eyebrow text-gold-deep">Write to us</p>
            <h2 id="contact-form-title" data-reveal className="display-md mt-4">Send a message</h2>
            <p data-reveal className="mt-4 text-charcoal/70">For general questions, feedback or anything else. We reply by email or phone.</p>
            <div data-reveal className="mt-10">
              <ContactForm />
            </div>
          </Reveal>
          <div className="flex flex-col gap-6">
            <MapEmbed className="aspect-square w-full lg:aspect-auto lg:flex-1" />
            <a href={mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary self-start">
              <Navigation className="h-4 w-4" aria-hidden /> Get directions
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
