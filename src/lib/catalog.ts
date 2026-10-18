import "server-only";

import { allOverrides, getOverride } from "@/lib/db/queries";
import {
  products as seedProducts,
  productsByCategory as seedByCategory,
  productsByBrand as seedByBrand,
  productsByIndustry as seedByIndustry,
} from "@/lib/data/products";
import type { Product } from "@/lib/types";

/**
 * کاتالوگ سمت سرور.
 *
 * مرز عمدی بین دو منبع:
 *
 *   کد  → مشخصات فنی عمیق (specGroups، facets، fit). موتور فیلتر، مقایسه و
 *         مشاور سمت کلاینت هم به این‌ها نیاز دارند، پس باید در باندل باشند.
 *   DB  → فیلدهای نمایشی که واحد فروش باید بدون دیپلوی عوض کند: نام، شعار،
 *         خلاصه، برچسب، قیمت و انتشار.
 *
 * این توابع همان امضای نسخه استاتیک را دارند، پس کامپوننت‌های سرور بدون
 * تغییر کار می‌کنند و فقط import عوض می‌شود.
 */

function apply(product: Product, o: ReturnType<typeof getOverride>): Product {
  if (!o) return product;
  return {
    ...product,
    name: o.name ?? product.name,
    tagline: o.tagline ?? product.tagline,
    summary: o.summary ?? product.summary,
    badges: o.badges ? o.badges.split("،").map((b) => b.trim()).filter(Boolean) : product.badges,
    priceMode: (o.price_mode as Product["priceMode"]) ?? product.priceMode,
    price: o.price ?? product.price,
    image: o.image ?? product.image,
  };
}

/** فقط محصولات منتشرشده — پیش‌فرض برای همه صفحات عمومی. */
export function catalog(): Product[] {
  const overrides = allOverrides();
  return seedProducts
    .filter((p) => (overrides.get(p.slug)?.published ?? 1) === 1)
    .map((p) => apply(p, overrides.get(p.slug)));
}

/** شامل پیش‌نویس‌ها — فقط برای پنل مدیریت. */
export function catalogIncludingDrafts(): (Product & { published: boolean })[] {
  const overrides = allOverrides();
  return seedProducts.map((p) => ({
    ...apply(p, overrides.get(p.slug)),
    published: (overrides.get(p.slug)?.published ?? 1) === 1,
  }));
}

export function getCatalogProduct(slug: string): Product | undefined {
  const base = seedProducts.find((p) => p.slug === slug);
  if (!base) return undefined;
  const o = getOverride(slug);
  if (o && o.published === 0) return undefined;
  return apply(base, o);
}

export function catalogByCategory(category: string): Product[] {
  const overrides = allOverrides();
  return seedByCategory(category)
    .filter((p) => (overrides.get(p.slug)?.published ?? 1) === 1)
    .map((p) => apply(p, overrides.get(p.slug)));
}

export function catalogByBrand(brand: string): Product[] {
  const overrides = allOverrides();
  return seedByBrand(brand)
    .filter((p) => (overrides.get(p.slug)?.published ?? 1) === 1)
    .map((p) => apply(p, overrides.get(p.slug)));
}

export function catalogByIndustry(industry: string): Product[] {
  const overrides = allOverrides();
  return seedByIndustry(industry)
    .filter((p) => (overrides.get(p.slug)?.published ?? 1) === 1)
    .map((p) => apply(p, overrides.get(p.slug)));
}
