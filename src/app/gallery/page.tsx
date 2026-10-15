import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { galleryCategories, img } from "@/content/images";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs of Hotel Panorama, Ahmedabad — rooms, Rivazz Hall, Horizon Hall, the restaurant, lobby and exterior.",
  alternates: { canonical: "/gallery" },
};

/** The 50 strongest photographs, hand-picked across every space. */
const BEST = [
  // Rooms (14)
  "royal-crest-windows", "royal-crest-suite", "royal-crest-swans", "royal-crest-lounge", "royal-crest-bath",
  "elegance-sage", "elegance-terracotta", "elegance-sage-wide", "elegance-sage-bed",
  "twin-sage", "twin-terracotta", "twin-sage-curtain", "twin-sage-front", "room-guest",
  // Rivazz Hall (9)
  "rivazz-symmetry", "rivazz-aisle", "rivazz-theatre", "rivazz-crystal-ceiling", "rivazz-length",
  "rivazz-full", "rivazz-buffet-wide", "rivazz-buffet", "rivazz-open-floor",
  // Horizon Hall (6)
  "horizon-overview", "horizon-arch", "horizon-rounds-3", "horizon-round-table", "horizon-buffet", "horizon-podium",
  // Restaurant (7)
  "restaurant-dining-room", "restaurant-ceiling", "restaurant-wide", "restaurant-buffet-view",
  "restaurant-tables", "restaurant-buffet", "restaurant-banquette",
  // Lobby & interiors (6)
  "lobby-reception", "lobby-lounge", "lobby-lounge-reception", "lobby-lounge-detail", "lobby-lounge-wide", "lobby-seating",
  // Exterior & views (8)
  "ext-facade-dusk", "ext-facade-upward", "ext-night-aerial", "ext-entrance-aerial",
  "ext-street-portrait", "ext-street-aerial", "ext-topdown", "ext-neighbourhood-wide",
];

export default function GalleryPage() {
  const images = BEST.map(img);
  const ordered = galleryCategories.flatMap((c) => images.filter((i) => i.category === c.key));
  return (
    <>
      <HeroSection
        size="page"
        image="lobby-lounge-wide"
        eyebrow="Gallery"
        lines={["A closer look"]}
        lede={<p>{ordered.length} of our favourite photographs of the rooms, halls, restaurant and spaces. Select any image to view it full screen.</p>}
      />
      <section className="py-20 lg:py-28">
        <div className="container-luxe">
          <GalleryGrid images={ordered} categories={galleryCategories} />
        </div>
      </section>
    </>
  );
}
