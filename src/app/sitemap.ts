import type { MetadataRoute } from "next";
import { rooms, siteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/rooms", "/banquets", "/dining", "/gallery", "/facilities", "/about", "/contact", "/enquire", "/privacy", "/terms"];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.7 })),
    ...rooms.map((r) => ({ url: `${siteUrl}/rooms/${r.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
