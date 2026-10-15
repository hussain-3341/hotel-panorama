import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ScrollRefresh } from "@/components/motion/ScrollRefresh";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { StartupHomeRedirect } from "@/components/motion/StartupHomeRedirect";
import { hotel, siteUrl } from "@/content/site";
import { hotelJsonLd } from "@/lib/structured-data";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const description =
  "Hotel Panorama — rooms, conference and banquet at Anandnagar Cross Road, Satellite, Ahmedabad. Royal Crest, Elegance and Twin Elegance rooms, Rivazz Hall and Horizon Hall, and an in-house restaurant.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hotel Panorama, Satellite, Ahmedabad | Rooms & Banquets",
    template: "%s | Hotel Panorama Ahmedabad",
  },
  description,
  applicationName: hotel.name,
  keywords: [
    "Hotel Panorama Ahmedabad",
    "hotel in Satellite Ahmedabad",
    "banquet hall Satellite Ahmedabad",
    "Anandnagar Cross Road hotel",
    "conference hall Ahmedabad",
    "wedding banquet Ahmedabad",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: hotel.name,
    title: "Hotel Panorama, Satellite, Ahmedabad",
    description,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Hotel Panorama's illuminated facade at dusk" }],
  },
  twitter: { card: "summary_large_image", title: "Hotel Panorama, Ahmedabad", description, images: ["/og-image.jpg"] },
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#303D32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        {/* Hide reveal targets before hydration only when motion is welcome. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd()) }} />
      </head>
      <body className="min-h-dvh">
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <StartupHomeRedirect />
        <ScrollRefresh />
        <SmoothScroll />
      </body>
    </html>
  );
}
