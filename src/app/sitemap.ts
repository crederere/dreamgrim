import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dreamgrim.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/dream`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  // SEO pages (in production: fetch from Supabase)
  const seoSlugs = [
    "snake", "pig", "teeth", "water", "death", "fire", "money",
    "tiger", "cat", "pregnancy", "sea", "flying", "exam", "poop",
    "dog", "fish", "dragon", "spider", "frog", "rabbit",
  ];

  const seoPages: MetadataRoute.Sitemap = seoSlugs.map((slug) => ({
    url: `${baseUrl}/dream/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...seoPages];
}
