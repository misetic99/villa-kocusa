import type { MetadataRoute } from "next";
import { rooms } from "@/lib/rooms";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/sobe`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/galerija`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const roomRoutes: MetadataRoute.Sitemap = rooms.map((room) => ({
    url: `${SITE_URL}/sobe/${room.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...roomRoutes];
}
