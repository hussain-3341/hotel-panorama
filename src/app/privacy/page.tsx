import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { hotel } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Hotel Panorama collects, uses and protects personal information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

// NOTE: Have this policy reviewed against the hotel's actual practices and the
// Digital Personal Data Protection Act, 2023 before publishing.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>
        This policy explains how {hotel.name} (“we”, “us”), {hotel.address.full}, handles personal information you share
        with us through this website.
      </p>

      <h2>Information we collect</h2>
      <p>When you send a room enquiry, banquet enquiry or contact message, we collect the details you provide, which may include:</p>
      <ul>
        <li>your name, phone number and email address;</li>
        <li>organisation name (for corporate events);</li>
        <li>stay or event dates, number of guests, room or hall preferences and arrangements;</li>
        <li>any additional requirements or messages you choose to include.</li>
      </ul>
      <p>
        Our servers may also record basic technical information (such as IP address and browser type) to keep the
        website secure and prevent abuse of our forms.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>to respond to your enquiry and discuss availability, rates and arrangements;</li>
        <li>to manage a stay or event that you subsequently confirm with us;</li>
        <li>to keep records of enquiries and protect against spam and misuse.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use enquiry details for unrelated marketing without your consent.</p>

      <h2>Consent</h2>
      <p>
        By ticking the consent box on our forms you agree that we may use your details to respond to your enquiry. You
        may withdraw consent at any time by contacting us; this will not affect any processing already carried out.
      </p>

      <h2>Sharing</h2>
      <p>
        Your details are shared only with hotel staff who need them to respond to you, and with service providers who
        operate this website, its email delivery and data storage on our behalf, under appropriate confidentiality
        obligations. We may disclose information where required by law, including guest-registration requirements
        applicable to hotels in India.
      </p>

      <h2>Retention</h2>
      <p>
        We keep enquiry information only as long as needed to respond and to maintain reasonable business records, after
        which it is deleted or anonymised.
      </p>

      <h2>Your rights</h2>
      <p>
        You may ask to access, correct or delete the personal information we hold about you, or raise a concern about
        how it has been handled, by contacting us using the details below.
      </p>

      <h2>Third-party services</h2>
      <p>
        Our contact page embeds a Google Maps map, which is provided by Google and subject to Google’s own privacy
        policy. Links to WhatsApp, Instagram and Facebook take you to those services, which have their own policies.
      </p>

      <h2>Contact</h2>
      <p>
        {hotel.name}, {hotel.address.full}
        <br />
        Email: <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
        <br />
        Phone: {hotel.phones.map((p, i) => (
          <span key={p.href}>{i > 0 && " / "}<a href={p.href}>{p.label}</a></span>
        ))}
      </p>
    </LegalPage>
  );
}
