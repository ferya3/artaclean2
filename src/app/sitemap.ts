import type { MetadataRoute } from "next";

import { brands } from "@/lib/data/brands";
import { industries } from "@/lib/data/industries";
import { articles } from "@/lib/data/knowledge";
import { products } from "@/lib/data/products";
import { services } from "@/lib/data/services";
import { categories } from "@/lib/data/taxonomy";

const BASE = "https://example.com";

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
    ...categories.map((c) => ({ url: `${BASE}/products/${c.slug}`, lastModified: now, priority: 0.8 })),
    ...products.map((p) => ({
      url: `${BASE}/products/${p.category}/${p.slug}`,
      lastModified: now,
      priority: 0.9,
    })),
    ...industries.map((i) => ({ url: `${BASE}/solutions/${i.slug}`, lastModified: now, priority: 0.8 })),
    ...brands.map((b) => ({ url: `${BASE}/brands/${b.slug}`, lastModified: now, priority: 0.6 })),
    ...services.map((s) => ({ url: `${BASE}/services/${s.slug}`, lastModified: now, priority: 0.6 })),
    ...articles.map((a) => ({ url: `${BASE}/knowledge/${a.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
