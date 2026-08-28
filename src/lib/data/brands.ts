import type { Brand } from "@/lib/types";

/**
 * برندهای کاتالوگ نمونه.
 * این‌ها داده seed هستند و هنگام اتصال به کاتالوگ واقعی جایگزین می‌شوند؛
 * ساختار صفحه برند و فیلتر برند مستقل از این مقادیر کار می‌کند.
 */
export const brands: Brand[] = [
  {
    slug: "arta",
    name: "ARTA",
    country: "ایران / مونتاژ اروپا",
    since: 1996,
    blurb:
      "خط اصلی کاتالوگ: دستگاه‌های کف‌شور، سویپر و مکنده با تمرکز بر در دسترس بودن قطعه و سرویس در داخل کشور.",
  },
  {
    slug: "vertex",
    name: "VERTEX",
    country: "ایتالیا",
    since: 1981,
    blurb:
      "دستگاه‌های سرنشین‌دار، خودران و آب‌گرم؛ انتخاب رایج برای متراژ بالا و شیفت‌های پیوسته.",
  },
  {
    slug: "nordline",
    name: "NORDLINE",
    country: "دانمارک",
    since: 1974,
    blurb:
      "تجهیزات سنگین و تخصصی — سویپر دیزلی، مکنده سه‌فاز و مدل‌های ضدانفجار برای محیط‌های پرخطر.",
  },
];

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
