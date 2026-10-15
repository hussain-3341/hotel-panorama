import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { hotel } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Hotel Panorama website and submitting room or banquet enquiries.",
  alternates: { canonical: "/terms" },
};

// NOTE: Add the hotel's confirmed booking, payment, cancellation and banquet
// policies here (they are not published on this website yet) and have the
// page reviewed before publishing.
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 2026">
      <p>
        These terms apply to your use of the {hotel.name} website. By using the site you agree to them.
      </p>

      <h2>Enquiries are not bookings</h2>
      <p>
        Forms on this website send an <strong>enquiry</strong> to our team. Submitting a form does not create a room
        reservation or a banquet booking, and does not guarantee availability or a rate. A booking is confirmed only
        when our team confirms it to you directly, on the terms communicated at that time.
      </p>

      <h2>Stays at the hotel</h2>
      <ul>
        <li>Check-in time is {hotel.checkIn} and check-out time is {hotel.checkOut}.</li>
        <li>Visitor hours are {hotel.visitorHours}.</li>
        <li>Guests are required to present valid government-issued photo identification at check-in.</li>
        <li>Stays are subject to the hotel’s management policies, available at reception.</li>
      </ul>
      <p>
        Room rates, payment, cancellation and banquet terms are provided by our team with your quotation or
        confirmation.
      </p>

      <h2>Website content</h2>
      <p>
        We work to keep information on this website accurate, but facilities, services, layouts and timings may change.
        Please confirm anything important with us before you travel or plan an event. Photographs show the hotel’s
        actual spaces; furnishings and set-ups may vary.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Photographs, text and design on this website belong to {hotel.name} or are used with permission, and may not be
        reproduced without our written consent.
      </p>

      <h2>Acceptable use</h2>
      <p>Please do not misuse our forms — for example by sending spam, false information or automated submissions.</p>

      <h2>Privacy</h2>
      <p>
        Our <Link href="/privacy">privacy policy</Link> explains how we handle the information you send us.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India, and the courts of Ahmedabad, Gujarat have jurisdiction.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${hotel.email}`}>{hotel.email}</a> or call{" "}
        <a href={hotel.phones[0].href}>{hotel.phones[0].label}</a>.
      </p>
    </LegalPage>
  );
}
