import manifest from "./images.json";

export type HotelImage = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  category: GalleryCategory;
  room?: string;
  /** Focal point for cropped frames (CSS object-position). */
  position: string;
  blurDataURL: string;
  original: string;
};

export type GalleryCategory = "exterior" | "lobby" | "rooms" | "rivazz" | "horizon" | "restaurant";

export const galleryCategories: { key: GalleryCategory; label: string }[] = [
  { key: "rooms", label: "Rooms" },
  { key: "rivazz", label: "Rivazz Hall" },
  { key: "horizon", label: "Horizon Hall" },
  { key: "restaurant", label: "Dining" },
  { key: "lobby", label: "Lobby & Interiors" },
  { key: "exterior", label: "Exterior & Views" },
];

const images = manifest as Record<string, HotelImage>;

export function img(id: string): HotelImage {
  const found = images[id];
  if (!found) throw new Error(`Unknown image id "${id}" — run \`npm run images\``);
  return found;
}

export const allImages: HotelImage[] = Object.values(images);

export function byCategory(category: GalleryCategory): HotelImage[] {
  return allImages.filter((i) => i.category === category);
}
