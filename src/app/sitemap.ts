import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://motherlandcafe.in";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/menu`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/reservations`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
