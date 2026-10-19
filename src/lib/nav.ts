import "server-only";

import { cache } from "react";

import { getCategories, getIndustries, getServices } from "@/lib/content";
import { navSettings } from "@/lib/site";

/**
 * معماری اطلاعات سایت در یک‌جا — هدر، فوتر و sitemap همه از همین می‌خوانند.
 *
 * سه ستون اول فوتر و مگامنوی محصولات عمداً **ساخته می‌شوند**، نه دستی: وقتی
 * واحد فروش یک دسته یا صنعت تازه اضافه می‌کند، باید بدون کار اضافه در منو
 * ظاهر شود. چیزی که دستی می‌ماند، ترتیب و عنوان گروه‌هاست (تنظیمات «منو»).
 */

export type MegaKey = "products" | "solutions" | "services";

export interface MegaItem {
  label: string;
  href: string;
  latin: string;
}

export interface MegaGroup {
  title: string;
  items: MegaItem[];
}

export interface NavLink {
  label: string;
  href: string;
  mega: MegaKey | null;
}

export interface SiteNav {
  primary: NavLink[];
  mega: Record<MegaKey, MegaGroup[]>;
  footer: { title: string; links: { label: string; href: string }[] }[];
}

const MEGA_KEYS: MegaKey[] = ["products", "solutions", "services"];

export const siteNav = cache((): SiteNav => {
  const nav = navSettings();
  const categories = getCategories();
  const industries = getIndustries();
  const services = getServices();

  const megaProducts: MegaGroup[] = nav.categoryGroups
    .map((group) => ({
      title: group.title,
      items: categories
        .filter((c) => c.group === group.key)
        .map((c) => ({ label: c.name, href: `/products/${c.slug}`, latin: c.latin })),
    }))
    .filter((g) => g.items.length > 0);

  // دسته‌ای که گروهش در تنظیمات نیست، نباید از منو بیفتد — ته فهرست می‌آید.
  const grouped = new Set(nav.categoryGroups.map((g) => g.key));
  const orphans = categories.filter((c) => !grouped.has(c.group));
  if (orphans.length) {
    megaProducts.push({
      title: "سایر",
      items: orphans.map((c) => ({ label: c.name, href: `/products/${c.slug}`, latin: c.latin })),
    });
  }

  const megaSolutions: MegaGroup[] = nav.solutionGroups
    .map((group) => ({
      title: group.title,
      items: group.items
        .map((slug) => industries.find((i) => i.slug === slug))
        .filter((i): i is NonNullable<typeof i> => Boolean(i))
        .map((i) => ({ label: i.name, href: `/solutions/${i.slug}`, latin: i.latin })),
    }))
    .filter((g) => g.items.length > 0);

  const megaServices: MegaGroup[] = nav.serviceGroups
    .map((group) => ({
      title: group.title,
      items: group.items
        .map((slug) => services.find((s) => s.slug === slug))
        .filter((s): s is NonNullable<typeof s> => Boolean(s))
        .map((s) => ({ label: s.name, href: `/services/${s.slug}`, latin: s.latin })),
    }))
    .filter((g) => g.items.length > 0);

  const primary: NavLink[] = nav.primary.map((item) => ({
    label: item.label,
    href: item.href,
    mega: MEGA_KEYS.includes(item.mega as MegaKey) ? (item.mega as MegaKey) : null,
  }));

  const footer = [
    {
      title: "محصولات",
      links: categories.slice(0, 7).map((c) => ({ label: c.name, href: `/products/${c.slug}` })),
    },
    {
      title: "راهکارها",
      links: industries.slice(0, 7).map((i) => ({ label: i.name, href: `/solutions/${i.slug}` })),
    },
    {
      title: "خدمات",
      links: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
    },
    ...nav.footer,
  ].filter((column) => column.links.length > 0);

  return {
    primary,
    mega: { products: megaProducts, solutions: megaSolutions, services: megaServices },
    footer,
  };
});
