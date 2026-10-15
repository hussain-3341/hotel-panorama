import type { Metadata } from "next";
import { EnquiryTabs } from "./EnquiryTabs";
import { Photo } from "@/components/ui/Photo";
import { ContactDetails } from "@/components/sections/LocationSection";

export const metadata: Metadata = {
  title: "Booking & Enquiries",
  description: "Send a room or banquet enquiry to Hotel Panorama, Satellite, Ahmedabad. Our team will respond with availability.",
  alternates: { canonical: "/enquire" },
};

type Search = { type?: string; room?: string; venue?: string };

export default async function EnquirePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const type = sp.type === "banquet" ? "banquet" : "room";

  return (
    <>
      <section className="bg-forest pb-16 pt-36 text-ivory lg:pb-20 lg:pt-44">
        <div className="container-luxe">
          <p className="eyebrow text-gold">Booking &amp; enquiries</p>
          <h1 className="display-lg mt-5 max-w-3xl">How can we host you?</h1>
          <p className="lede mt-6 max-w-2xl text-ivory/80">
            Tell us about your stay or event. Our team will check availability and reply personally — your booking is
            confirmed only once we confirm it with you.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-luxe grid gap-14 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-sm bg-ivory-deep p-6 sm:p-10">
            <EnquiryTabs initial={type} room={sp.room} venue={sp.venue} />
          </div>
          <aside className="space-y-10" aria-label="Contact details">
            <Photo id="lobby-reception-portrait" className="hidden aspect-[3/4] rounded-sm lg:block" sizes="30vw" />
            <div>
              <h2 className="font-display text-3xl">Prefer to speak to us?</h2>
              <p className="mt-3 text-charcoal/70">Our reception is open 24 hours a day.</p>
              <div className="mt-8">
                <ContactDetails tone="dark" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
