"use server";

import { recommendAmong } from "@/lib/advisor";
import { getProducts } from "@/lib/content";
import type { AreaBand, Product } from "@/lib/types";

/**
 * داده فهرست مقایسه.
 *
 * فهرست مقایسه در localStorage مرورگر است، پس سرور نمی‌داند کاربر چه چیزی
 * انتخاب کرده و نمی‌تواند از پیش رندر کند. گزینه دیگر فرستادن کل کاتالوگ به
 * کلاینت بود تا هر چهار محصول را خودش پیدا کند — همان کاری که نسخه قبلی
 * می‌کرد و با کاتالوگ واقعی (چند صد دستگاه، هرکدام ۷۰ مشخصه) از دسترس خارج
 * می‌شود. این اکشن فقط همان چند دستگاه انتخاب‌شده را برمی‌گرداند.
 */
export async function compareAction(
  slugs: string[],
  band?: AreaBand,
): Promise<{ products: Product[]; suggestion: { slug: string; why: string } | null }> {
  const clean = slugs.filter((s) => typeof s === "string").slice(0, 8);
  if (clean.length === 0) return { products: [], suggestion: null };

  const all = getProducts();
  // ترتیب انتخاب کاربر حفظ می‌شود، نه ترتیب کاتالوگ.
  const products = clean
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));

  return {
    products,
    suggestion:
      products.length >= 2
        ? recommendAmong(
            products.map((p) => p.slug),
            all,
            band,
          )
        : null,
  };
}
