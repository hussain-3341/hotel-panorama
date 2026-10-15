import { hotel, rooms, siteUrl, mapsDirectionsUrl } from "@/content/site";

/** schema.org Hotel built only from verified facts in content/site.ts. */
export function hotelJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${siteUrl}/#hotel`,
    name: hotel.name,
    url: siteUrl,
    image: [`${siteUrl}/og-image.jpg`],
    description:
      "Rooms, conference and banquet hotel at Anandnagar Cross Road, Satellite, Ahmedabad, with Rivazz Hall, Horizon Hall and an in-house restaurant.",
    telephone: hotel.phones[0].href.replace("tel:", ""),
    email: hotel.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address.street,
      addressLocality: `${hotel.address.locality}, ${hotel.address.city}`,
      addressRegion: hotel.address.region,
      postalCode: hotel.address.postalCode,
      addressCountry: hotel.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: hotel.geo.lat, longitude: hotel.geo.lng },
    hasMap: mapsDirectionsUrl,
    checkinTime: "11:00",
    checkoutTime: "10:00",
    sameAs: [hotel.social.instagram, hotel.social.facebook],
    amenityFeature: ["Free Wi-Fi", "24-hour front desk", "Restaurant", "Banquet hall", "Conference hall", "Air conditioning", "Room service"].map(
      (name) => ({ "@type": "LocationFeatureSpecification", name, value: true })
    ),
    containsPlace: rooms.map((r) => ({
      "@type": "HotelRoom",
      name: r.name,
      url: `${siteUrl}/rooms/${r.slug}`,
      bed: { "@type": "BedDetails", typeOfBed: r.bed },
    })),
  };
}
