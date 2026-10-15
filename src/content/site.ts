/**
 * Single source of truth for every business fact shown on the site.
 *
 * Sources used (October 2026):
 *  [SIGN]  The hotel's own signage, legible in the supplied reception photographs
 *          (_BHS13861.jpg: check-in / check-out / visitor-time card and the
 *          management-policies card on the reception desk).
 *  [SITE]  The hotel's current official website, hotelpanorama.co.in.
 *  [PHOTO] Directly visible in the supplied photographs.
 *
 * Anything set to `null` is unknown and is hidden on the site (an enquiry
 * prompt is shown instead). Fill these in only with confirmed information.
 * See CONTENT-CHECKLIST.md for the full list awaiting confirmation.
 */

export const hotel = {
  name: "Hotel Panorama",
  tagline: "Rooms · Conference · Banquet", // [SIGN] policies card footer
  locality: "Satellite",
  city: "Ahmedabad",
  address: {
    // [SITE] + [SIGN]
    street: "Nr. Madhur Hall, Anandnagar Cross Road",
    locality: "Satellite",
    city: "Ahmedabad",
    region: "Gujarat",
    postalCode: "380015",
    country: "IN",
    full: "Nr. Madhur Hall, Anandnagar Cross Road, Satellite, Ahmedabad – 380015, Gujarat, India",
  },
  /** [SITE] Google Maps destination used by the official website. */
  geo: { lat: 23.01292, lng: 72.51591 },
  phones: [
    // [SITE] (both numbers also printed on the [SIGN] policies card)
    { label: "+91 98241 08440", href: "tel:+919824108440" },
    { label: "+91 98241 07440", href: "tel:+919824107440" },
  ],
  whatsapp: { label: "+91 98241 08440", href: "https://wa.me/919824108440" }, // [SITE]
  email: "thepanorama.ahmedabad@gmail.com", // [SITE] + [SIGN]
  social: {
    instagram: "https://www.instagram.com/hotelthepanorama/", // [SITE]
    facebook: "https://www.facebook.com/people/Hotel-Panorama/61590857531580/", // [SITE]
  },
  /** [SIGN] Card on the reception desk. */
  checkIn: "11:00 AM",
  checkOut: "10:00 AM",
  visitorHours: "9:00 AM – 9:00 PM",
  /** [SITE] "Reception open 24 hours, 7 days a week". */
  receptionHours: "Open 24 hours, 7 days a week",
} as const;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hotel.geo.lat}%2C${hotel.geo.lng}`;
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${hotel.geo.lat},${hotel.geo.lng}&z=16&output=embed`;

/* ────────────────────────────── Rooms ────────────────────────────── */

export type Room = {
  slug: string;
  name: string;
  /** [SITE] description, lightly edited for tone. */
  summary: string;
  description: string[];
  bed: string;
  /** Unknown until confirmed by the hotel → shown as "On enquiry". */
  occupancy: string | null;
  size: string | null;
  price: string | null;
  /** Amenities stated for this room on the official website [SITE]. */
  amenities: string[];
  /** Features visible in this room's photographs [PHOTO]. */
  seenInPhotos: string[];
  hero: string;
  gallery: string[];
};

export const rooms: Room[] = [
  {
    slug: "royal-crest",
    name: "Royal Crest",
    summary:
      "Our signature room — a king-sized bed, plush furnishings and space to unwind, crafted for the discerning traveller.",
    description: [
      "Royal Crest is the most generous of our rooms. A king-sized bed sits against a padded terracotta headboard, framed by warm timber and soft, full-height drapery.",
      "A sofa, work desk and tea station make it as comfortable for a working trip as for a longer stay, and the bathroom features a glass-enclosed shower and a vessel basin beneath a backlit mirror.",
    ],
    bed: "King bed",
    occupancy: null,
    size: null,
    price: null,
    amenities: ["King bed", "Minibar", "City view", "Premium décor"],
    seenInPhotos: [
      "Sofa seating",
      "Work desk",
      "Tea & coffee station",
      "Wall-mounted TV",
      "Air conditioning",
      "Glass-enclosed shower",
      "Electronic key-card lock",
    ],
    hero: "royal-crest-suite",
    gallery: [
      "royal-crest-suite",
      "royal-crest-swans",
      "royal-crest-window",
      "royal-crest-lounge",
      "royal-crest-sofa",
      "royal-crest-windows",
      "royal-crest-tv",
      "royal-crest-mirror",
      "royal-crest-bath",
      "royal-crest-bath-2",
    ],
  },
  {
    slug: "elegance",
    name: "Elegance",
    summary:
      "A perfect blend of comfort and style — elegant interiors, a queen-sized bed and every essential for a restful stay.",
    description: [
      "Elegance rooms pair a queen-sized bed with a calm palette of ivory, timber and either terracotta or sage accents, finished with framed contemporary art.",
      "Each room has a tea station, a wall-mounted TV and an en-suite bathroom with a glass shower — everything you need for a comfortable night in Satellite.",
    ],
    bed: "Queen bed",
    occupancy: null,
    size: null,
    price: null,
    amenities: ["Queen bed", "Air conditioning", "Free Wi-Fi", "Elegant interiors"],
    seenInPhotos: [
      "Tea & coffee station",
      "Refrigerator",
      "Wall-mounted TV",
      "Mirrored wardrobe",
      "Glass-enclosed shower",
      "Electronic key-card lock",
    ],
    hero: "elegance-sage",
    gallery: [
      "elegance-sage",
      "elegance-terracotta",
      "elegance-sage-bed",
      "elegance-sage-minibar",
      "elegance-terracotta-window",
      "elegance-sage-tv",
      "elegance-terracotta-door",
      "elegance-sage-wide",
      "elegance-bath",
    ],
  },
  {
    slug: "twin-elegance",
    name: "Twin Elegance",
    summary:
      "Two comfortable single beds and thoughtful furnishings — ideal for friends, family or colleagues travelling together.",
    description: [
      "Twin Elegance rooms offer two single beds side by side, each with its own reading light, beneath framed artwork and soft drapery.",
      "Some rooms add a sofa by the window. All share the same warm timber finishes, wall-mounted TV and an en-suite bathroom with a backlit mirror.",
    ],
    bed: "Two single beds",
    occupancy: null,
    size: null,
    price: null,
    amenities: ["Two single beds", "Air conditioning", "Free Wi-Fi", "24/7 room service"],
    seenInPhotos: [
      "Individual reading lights",
      "Wall-mounted TV",
      "Tea & coffee station",
      "Wardrobe",
      "Vessel basin & lit mirror",
    ],
    hero: "twin-sage",
    gallery: [
      "twin-sage",
      "twin-terracotta",
      "twin-sage-beds",
      "twin-terracotta-window",
      "twin-sage-front",
      "twin-terracotta-art",
      "twin-sage-curtain",
      "twin-terracotta-wide",
      "twin-bath",
    ],
  },
];

/* ───────────────────────────── Venues ────────────────────────────── */

export type Venue = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** Layouts actually shown in the supplied photographs [PHOTO]. */
  layoutsSeen: string[];
  features: string[];
  capacity: string | null;
  area: string | null;
  hero: string;
  gallery: string[];
};

export const venues: Venue[] = [
  {
    slug: "rivazz-hall",
    name: "Rivazz Hall",
    summary: "Our grand banquet hall, crowned by a cascading crystal ceiling.",
    description:
      "A long, column-free hall finished in polished marble and warm timber, with a dramatic crystal installation running the length of the ceiling. A dedicated buffet counter lines one side of the room.",
    layoutsSeen: ["Theatre-style seating", "Centre aisle", "Buffet service"],
    features: ["Crystal ceiling feature", "Marble flooring", "Built-in buffet counter", "Dressed chairs", "Wall sconces & drapery"],
    capacity: null,
    area: null,
    hero: "rivazz-symmetry",
    gallery: [
      "rivazz-symmetry",
      "rivazz-aisle",
      "rivazz-buffet-wide",
      "rivazz-crystal-ceiling",
      "rivazz-theatre",
      "rivazz-length",
      "rivazz-buffet",
      "rivazz-side",
      "rivazz-front",
      "rivazz-buffet-long",
      "rivazz-chandelier-rows",
      "rivazz-open-floor",
    ],
  },
  {
    slug: "horizon-hall",
    name: "Horizon Hall",
    summary: "A warm, timber-panelled hall for meetings, conferences and intimate gatherings.",
    description:
      "Horizon Hall combines timber panelling, lit arches and chandeliers with a flexible floor. It is shown set both with dressed round tables for dining and with rectangular tables, notepads and a lectern for meetings.",
    layoutsSeen: ["Round-table banquet", "Meeting / classroom tables", "Lectern", "Buffet service"],
    features: ["Lectern", "Buffet counter", "Chandeliers", "Ceiling air-conditioning", "Timber panelling"],
    capacity: null,
    area: null,
    hero: "horizon-overview",
    gallery: [
      "horizon-overview",
      "horizon-podium",
      "horizon-arch",
      "horizon-classroom",
      "horizon-rounds",
      "horizon-buffet",
      "horizon-table-setting",
      "horizon-rounds-wide",
      "horizon-classroom-2",
      "horizon-buffet-counter",
    ],
  },
];

/**
 * Occasions offered in the enquiry form. The official website describes the
 * halls as suited to "weddings, receptions, and corporate events" [SITE];
 * the remaining options simply let guests describe their own occasion.
 */
export const eventTypes = [
  "Wedding",
  "Reception",
  "Engagement",
  "Birthday",
  "Anniversary",
  "Corporate meeting / conference",
  "Social gathering",
  "Other",
] as const;

export const roomPreferences = ["No preference", ...rooms.map((r) => r.name)] as const;

/* ──────────────────────────── Facilities ─────────────────────────── */

export type Facility = { icon: string; title: string; text: string; source: "SITE" | "PHOTO" | "SIGN" };

export const facilities: Facility[] = [
  { icon: "BedDouble", title: "Three room categories", text: "Royal Crest, Elegance and Twin Elegance — king, queen or twin beds.", source: "SITE" },
  { icon: "Sparkles", title: "Two event halls", text: "Rivazz Hall and Horizon Hall for celebrations, conferences and meetings.", source: "SITE" },
  { icon: "UtensilsCrossed", title: "In-house restaurant", text: "Hotel Panorama Restaurant, with table service and a buffet counter.", source: "PHOTO" },
  { icon: "ConciergeBell", title: "24-hour reception", text: "Our front desk is open around the clock, every day of the week.", source: "SITE" },
  { icon: "Wifi", title: "Free Wi-Fi", text: "Complimentary wireless internet for guests.", source: "SITE" },
  { icon: "BellRing", title: "24/7 room service", text: "Order to your room at any hour.", source: "SITE" },
  { icon: "Snowflake", title: "Air-conditioned throughout", text: "Climate control in every room, hall and the restaurant.", source: "PHOTO" },
  { icon: "Presentation", title: "Meeting set-ups", text: "Lectern, meeting tables and banquet rounds in Horizon Hall.", source: "PHOTO" },
  { icon: "Sofa", title: "Lobby lounge", text: "A timber-panelled lounge and waiting area beside reception.", source: "PHOTO" },
  { icon: "Sparkle", title: "Housekeeping", text: "Rooms prepared daily by our housekeeping team.", source: "PHOTO" },
  { icon: "KeyRound", title: "Key-card access", text: "Electronic key-card locks on guest-room doors.", source: "PHOTO" },
  { icon: "MapPin", title: "Central Satellite address", text: "At Anandnagar Cross Road, near Madhur Hall.", source: "SITE" },
];

/* ───────────────────────────── Dining ────────────────────────────── */

export const dining = {
  name: "Hotel Panorama Restaurant", // [SITE]
  intro:
    "A warm dining room of terracotta walls, timber and glowing lamplight — from a hearty breakfast to an unhurried dinner.", // adapted from [SITE]
  cuisine: null as string | null,
  hours: null as string | null,
  breakfastIncluded: null as boolean | null,
};

/* ──────────────────────────── Navigation ─────────────────────────── */

export const nav = [
  { href: "/rooms", label: "Rooms" },
  { href: "/banquets", label: "Banquets" },
  { href: "/dining", label: "Dining" },
  { href: "/gallery", label: "Gallery" },
  { href: "/facilities", label: "Facilities" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hotelpanorama.co.in").replace(/\/$/, "");
