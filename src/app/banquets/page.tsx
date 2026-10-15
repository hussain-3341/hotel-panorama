import type { Metadata } from "next";
import Link from "next/link";
import { Check, Phone, Mail, MessageCircle, Users, LayoutGrid, Utensils } from "lucide-react";
import { ZoomHero } from "@/components/sections/ZoomHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { HorizontalGallery } from "@/components/sections/HorizontalGallery";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { BanquetEnquiryForm } from "@/components/forms/BanquetEnquiryForm";
import { hotel, venues, eventTypes } from "@/content/site";
import { img } from "@/content/images";

export const metadata: Metadata = {
  title: "Banquets & Events",
  description:
    "Rivazz Hall and Horizon Hall at Hotel Panorama, Satellite, Ahmedabad — banquet and conference halls for weddings, receptions, celebrations and corporate events. Enquire for availability.",
  alternates: { canonical: "/banquets" },
};

export default function BanquetsPage() {
  return (
    <>
      <ZoomHero
        image="rivazz-symmetry"
        eyebrow="Banquets & events"
        split={["Celebrate", "Together"]}
        lines={["Celebrate Your", "Special Moments", "at Panorama."]}
        lede={<p>Two beautifully finished halls — Rivazz Hall beneath its cascading crystal ceiling, and the warm, timber-panelled Horizon Hall.</p>}
        actions={[
          { href: "#enquire", label: "Enquire About Banquets" },
          { href: "#enquire", label: "Plan Your Event", variant: "ghost" },
        ]}
      />

      {/* Intro */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow="Our halls"
            title="Spaces made for gathering"
            lede="From a wedding reception to a business conference, our halls combine marble, timber and soft lighting with built-in buffet counters and flexible floor plans."
          />
          <Reveal as="ul" className="grid gap-px overflow-hidden rounded-sm bg-charcoal/10 sm:grid-cols-3" stagger={0.1}>
            {[
              { icon: LayoutGrid, k: "Two halls", v: "Rivazz & Horizon" },
              { icon: Utensils, k: "Buffet counters", v: "In both halls" },
              { icon: Users, k: "Capacity", v: "Shared on enquiry" },
            ].map((s) => (
              <li key={s.k} data-reveal className="bg-ivory p-6">
                <s.icon className="h-6 w-6 text-gold-deep" strokeWidth={1.4} aria-hidden />
                <p className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-charcoal/60">{s.k}</p>
                <p className="mt-1 font-display text-2xl text-forest">{s.v}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Venues */}
      <div id="venues" className="scroll-mt-24">
        {venues.map((v, i) => (
          <section key={v.slug} id={v.slug} className={`scroll-mt-24 py-20 lg:py-28 ${i % 2 ? "bg-ivory-deep" : "bg-mist"}`} aria-labelledby={`${v.slug}-title`}>
            <div className="container-luxe">
              <ParallaxImage id={v.hero} className="aspect-[16/10] rounded-sm lg:aspect-[21/9]" sizes="100vw" strength={14} />
              <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
                <Reveal>
                  <p data-reveal className="eyebrow text-gold-deep">Hall 0{i + 1}</p>
                  <h2 id={`${v.slug}-title`} data-reveal className="display-lg mt-4">{v.name}</h2>
                  <p data-reveal className="lede mt-6 text-charcoal/75">{v.description}</p>
                  <div data-reveal className="mt-10 flex flex-wrap gap-3">
                    <Link href={`/enquire?type=banquet&venue=${v.slug}`} className="btn btn-primary">Enquire about {v.name}</Link>
                  </div>
                </Reveal>
                <Reveal className="grid gap-10 sm:grid-cols-2">
                  <div data-reveal>
                    <h3 className="eyebrow mb-5 text-gold-deep">Features</h3>
                    <ul className="space-y-3 text-[0.95rem]">
                      {v.features.map((f) => (
                        <li key={f} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden /> {f}</li>
                      ))}
                    </ul>
                  </div>
                  <div data-reveal>
                    <h3 className="eyebrow mb-5 text-gold-deep">Set-ups photographed</h3>
                    <ul className="space-y-3 text-[0.95rem]">
                      {v.layoutsSeen.map((f) => (
                        <li key={f} className="flex gap-3"><Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden /> {f}</li>
                      ))}
                    </ul>
                    <p className="mt-6 text-sm text-charcoal/65">
                      Capacity {v.capacity ?? "and seating plans are shared on enquiry"}.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ))}
      </div>

      <HorizontalGallery
        eyebrow="Rivazz Hall"
        title="Beneath the crystal ceiling"
        ids={venues[0].gallery.slice(1)}
        href="/gallery"
        cta="See every photograph"
      />

      {/* Horizon gallery */}
      <section className="py-24 lg:py-32">
        <div className="container-luxe">
          <SectionHeading eyebrow="Horizon Hall" title="Set for dinner, set for business" className="mb-14" />
          <GalleryGrid images={venues[1].gallery.map(img)} />
        </div>
      </section>

      {/* Occasions & catering */}
      <section className="bg-forest py-24 text-ivory lg:py-32">
        <div className="container-luxe grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              tone="light"
              eyebrow="Occasions"
              title="Tell us what you’re celebrating"
              lede="Our halls are designed for weddings, receptions and corporate events. Share your plans and our team will advise on what’s possible for your date."
            />
            <Reveal as="ul" className="mt-10 flex flex-wrap gap-3" stagger={0.05}>
              {eventTypes.filter((t) => t !== "Other").map((t) => (
                <li key={t} data-reveal className="rounded-full border border-ivory/25 px-4 py-2 text-sm">{t}</li>
              ))}
            </Reveal>
          </div>
          <div className="space-y-10">
            <Reveal className="rounded-sm border border-ivory/15 p-8">
              <Utensils data-reveal className="h-7 w-7 text-gold" strokeWidth={1.3} aria-hidden />
              <h3 data-reveal className="mt-5 font-display text-3xl">Catering &amp; dining</h3>
              <p data-reveal className="mt-4 leading-relaxed text-ivory/75">
                Both halls have built-in buffet counters, and the hotel has its own in-house restaurant. Ask our team
                about menus and catering options for your event.
              </p>
            </Reveal>
            <Reveal className="rounded-sm border border-ivory/15 p-8">
              <LayoutGrid data-reveal className="h-7 w-7 text-gold" strokeWidth={1.3} aria-hidden />
              <h3 data-reveal className="mt-5 font-display text-3xl">Set-ups &amp; décor</h3>
              <p data-reveal className="mt-4 leading-relaxed text-ivory/75">
                Our halls have been photographed in theatre-style, round-table banquet and meeting layouts. Let us know
                the arrangement and décor you have in mind.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Enquiry */}
      <section id="enquire" className="scroll-mt-20 py-24 lg:py-32" aria-labelledby="banquet-form-title">
        <div className="container-luxe grid gap-16 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading
              eyebrow="Plan your event"
              title={<span id="banquet-form-title">Enquire about banquets</span>}
              lede="Share a few details and our events team will get back to you about availability, layouts and catering."
            />
            <Reveal className="mt-12 space-y-4 text-[0.95rem]">
              <p data-reveal className="eyebrow text-gold-deep">Talk to our team</p>
              {hotel.phones.map((p) => (
                <a data-reveal key={p.href} href={p.href} className="flex items-center gap-3 hover:text-forest"><Phone className="h-4 w-4 text-gold-deep" aria-hidden /> {p.label}</a>
              ))}
              <a data-reveal href={hotel.whatsapp.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-forest"><MessageCircle className="h-4 w-4 text-gold-deep" aria-hidden /> WhatsApp {hotel.whatsapp.label}</a>
              <a data-reveal href={`mailto:${hotel.email}`} className="flex items-center gap-3 break-all hover:text-forest"><Mail className="h-4 w-4 shrink-0 text-gold-deep" aria-hidden /> {hotel.email}</a>
            </Reveal>
          </div>
          <div className="rounded-sm bg-ivory-deep p-6 sm:p-10">
            <BanquetEnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
