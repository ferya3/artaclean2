import type { MetadataRoute } from "next";

import {
  getArticles,
  getBrands,
  getCategories,
  getIndustries,
  getProducts,
  getServices,
} from "@/lib/content";

const BASE = process.env.SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = [
    "/",
    "/products",
    "/solutions",
    "/advisor",
    "/brands",
    "/services",
    "/knowledge",
    "/spare-parts",
    "/compare",
    "/quote",
    "/company/about",
    "/company/projects",
    "/company/representatives",
    "/company/certifications",
    "/company/contact",
  ];

  return [
    ...statics.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...getCategories().map((c) => ({
      url: `${BASE}/products/${c.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...getProducts().map((p) => ({
      url: `${BASE}/products/${p.category}/${p.slug}`,
      lastModified: now,
      priority: 0.9,
    })),
    ...getIndustries().map((i) => ({
      url: `${BASE}/solutions/${i.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
    ...getBrands().map((b) => ({
      url: `${BASE}/brands/${b.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...getServices().map((s) => ({
      url: `${BASE}/services/${s.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
    ...getArticles().map((a) => ({
      url: `${BASE}/knowledge/${a.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
