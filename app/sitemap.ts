import type { MetadataRoute } from "next";

/**
 * Карта сайта. Домен берём из NEXT_PUBLIC_SITE_URL: пока он не задан,
 * используется адрес разработки, чтобы ссылки в карте оставались валидными.
 */
const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: `${ORIGIN}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${ORIGIN}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${ORIGIN}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${ORIGIN}/cookies`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${ORIGIN}/refund`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
