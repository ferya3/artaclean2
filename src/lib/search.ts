import { articles } from "@/lib/data/knowledge";
import { brands } from "@/lib/data/brands";
import { industries } from "@/lib/data/industries";
import { spareParts } from "@/lib/data/parts";
import { products } from "@/lib/data/products";
import { services } from "@/lib/data/services";
import { categories } from "@/lib/data/taxonomy";
import type { AreaBand, DirtKind, SurfaceKind } from "@/lib/types";

/**
 * جست‌وجوی نیت‌محور.
 *
 * کاربر صنعتی «Tennant T600e» تایپ نمی‌کند؛ می‌نویسد «دستگاه مناسب روغن روی کف»
 * یا «جارو برای سیمان». این ماژول دو کار هم‌زمان می‌کند:
 *   ۱) تطبیق واژگانی روی همه موجودیت‌ها (محصول، راهکار، مقاله، قطعه، خدمت)
 *   ۲) استخراج «نیت» — سطح، آلودگی و متراژ — از متن فارسی، تا بتوان کاربر را
 *      مستقیم به Product Advisor با پاسخ‌های از پیش پرشده فرستاد.
 *
 * پیاده‌سازی فعلی روی مترادف‌های دستی کار می‌کند و کاملاً سمت سرور اجرا می‌شود.
 * نقطه اتصال آینده: جایگزینی scoreText با یک ایندکس برداری/معنایی، بدون تغییر
 * در امضای توابع.
 */

export type SearchGroup = "products" | "solutions" | "knowledge" | "parts" | "services" | "brands";

export interface SearchHit {
  group: SearchGroup;
  title: string;
  subtitle: string;
  href: string;
  score: number;
}

export interface SearchIntent {
  surface?: SurfaceKind;
  dirt?: DirtKind;
  area?: AreaBand;
}

const SURFACE_HINTS: Record<SurfaceKind, string[]> = {
  "factory-floor": [
    "کف کارخانه",
    "سالن تولید",
    "کف بتن",
    "بتن",
    "سیمان",
    "اپوکسی",
    "کف سالن",
    "تعمیرگاه",
    "کارگاه",
    "فروشگاه",
    "مرکز خرید",
    "هایپر",
    "بیمارستان",
    "هتل",
    "لابی",
    "راهرو",
  ],
  warehouse: ["انبار", "لجستیک", "قفسه", "بارانداز", "دپو"],
  parking: ["پارکینگ", "محوطه", "رمپ", "خیابان", "پارکینگ طبقاتی"],
  "production-line": ["خط تولید", "خط بسته‌بندی", "نوار نقاله", "لاین"],
  machinery: ["ماشین‌آلات", "دستگاه", "قطعات", "موتور", "تجهیزات"],
  vertical: ["دیوار", "سطوح عمودی", "نما", "سقف"],
  carpet: ["فرش", "موکت", "مبل", "مبلمان", "قالی"],
};

const DIRT_HINTS: Record<DirtKind, string[]> = {
  dust: ["گرد", "خاک", "غبار", "پودر", "براده", "گرد و خاک"],
  oil: ["روغن", "روغنی", "نفت"],
  grease: ["گریس", "چرب", "چربی"],
  mud: ["گل", "لجن", "شن", "نخاله", "دوغاب"],
  food: ["مواد غذایی", "غذا", "آرد", "لبنیات", "آشپزخانه"],
  chemical: ["شیمیایی", "اسید", "حلال", "رنگ", "قابل اشتعال", "atex", "ضدانفجار"],
};

const AREA_HINTS: { band: AreaBand; test: (n: number) => boolean }[] = [
  { band: "lt500", test: (n) => n < 500 },
  { band: "500-2000", test: (n) => n >= 500 && n < 2000 },
  { band: "2000-10000", test: (n) => n >= 2000 && n < 10000 },
  { band: "gt10000", test: (n) => n >= 10000 },
];

const faDigitMap: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[۰-۹]/g, (d) => faDigitMap[d] ?? d)
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[‌ً-ْ]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** طولانی‌ترین نشانه منطبق در متن، کلید مربوط به آن را برمی‌گرداند. */
function bestMatch<K extends string>(q: string, table: Record<K, string[]>): K | undefined {
  let bestKey: K | undefined;
  let bestLen = 0;
  for (const key of Object.keys(table) as K[]) {
    for (const hint of table[key]) {
      const h = normalize(hint);
      if (h.length > bestLen && q.includes(h)) {
        bestLen = h.length;
        bestKey = key;
      }
    }
  }
  return bestKey;
}

/** استخراج نیت از جمله فارسی — ورودی مستقیم Product Advisor. */
export function extractIntent(query: string): SearchIntent {
  const q = normalize(query);
  const intent: SearchIntent = {};

  // مشخص‌ترین نشانه برنده است، نه اولین نشانه: در «کف انبار»، «انبار» باید
  // بر «کف» بچربد، وگرنه ترتیب تعریف دیکشنری نتیجه را تعیین می‌کند.
  intent.surface = bestMatch(q, SURFACE_HINTS);
  intent.dirt = bestMatch(q, DIRT_HINTS);

  // «کارخانه ۵۰۰۰ متر» یا «5000 متری» → بازه متراژ
  const areaMatch = q.match(/(\d[\d,]*)\s*(متر|m2|m²|متری)/);
  if (areaMatch) {
    const value = Number(areaMatch[1].replace(/,/g, ""));
    const band = AREA_HINTS.find((a) => a.test(value));
    if (band) intent.area = band.band;
  }

  return intent;
}

function scoreText(query: string, haystacks: { text: string; weight: number }[]): number {
  const terms = query.split(" ").filter((t) => t.length > 1);
  if (!terms.length) return 0;

  let score = 0;
  for (const { text, weight } of haystacks) {
    const hay = normalize(text);
    for (const term of terms) {
      if (hay.includes(term)) score += weight;
      // تطبیق پیشوندی برای صرف‌های فارسی: «اسکرابرها» → «اسکرابر»
      else if (term.length > 3 && hay.includes(term.slice(0, -1))) score += weight * 0.6;
    }
  }
  return score;
}

export function search(query: string): SearchHit[] {
  const q = normalize(query);
  if (q.length < 2) return [];
  const intent = extractIntent(query);
  const hits: SearchHit[] = [];

  for (const p of products) {
    let score = scoreText(q, [
      { text: p.name, weight: 6 },
      { text: p.model, weight: 8 },
      { text: p.tagline, weight: 3 },
      { text: p.summary, weight: 1.5 },
      { text: p.subcategory ?? "", weight: 2 },
      { text: p.brand, weight: 3 },
      { text: categories.find((c) => c.slug === p.category)?.name ?? "", weight: 4 },
    ]);

    // امتیاز نیت: جمله‌ای مثل «روغن روی کف» بدون هیچ واژه مشترکی با نام محصول،
    // باز هم باید اسکرابر مناسب را بالا بیاورد.
    if (intent.dirt && p.fit.dirt.includes(intent.dirt)) score += 5;
    if (intent.surface && p.fit.surfaces.includes(intent.surface)) score += 5;

    if (score > 0) {
      hits.push({
        group: "products",
        title: p.name,
        subtitle: p.tagline,
        href: `/products/${p.category}/${p.slug}`,
        score,
      });
    }
  }

  for (const c of categories) {
    const score = scoreText(q, [
      { text: c.name, weight: 7 },
      { text: c.latin, weight: 5 },
      { text: c.blurb, weight: 1.5 },
    ]);
    if (score > 0) {
      hits.push({
        group: "products",
        title: c.name,
        subtitle: "دسته‌بندی محصولات",
        href: `/products/${c.slug}`,
        score: score + 1,
      });
    }
  }

  for (const i of industries) {
    let score = scoreText(q, [
      { text: i.name, weight: 7 },
      { text: i.latin, weight: 4 },
      { text: i.blurb, weight: 1.5 },
      { text: i.problems.map((p) => `${p.title} ${p.body}`).join(" "), weight: 1 },
    ]);
    if (intent.dirt && i.problems.some((p) => p.dirt.includes(intent.dirt!))) score += 3;
    if (score > 0) {
      hits.push({
        group: "solutions",
        title: `راهکار نظافت ${i.name}`,
        subtitle: i.blurb,
        href: `/solutions/${i.slug}`,
        score,
      });
    }
  }

  for (const a of articles) {
    const score = scoreText(q, [
      { text: a.title, weight: 6 },
      { text: a.excerpt, weight: 2 },
      { text: a.body.join(" "), weight: 0.5 },
    ]);
    if (score > 0) {
      hits.push({
        group: "knowledge",
        title: a.title,
        subtitle: a.excerpt,
        href: `/knowledge/${a.slug}`,
        score,
      });
    }
  }

  for (const part of spareParts) {
    const score = scoreText(q, [
      { text: part.partNo, weight: 9 },
      { text: part.title, weight: 5 },
      { text: part.category, weight: 3 },
      { text: part.fitsModels.join(" "), weight: 4 },
    ]);
    if (score > 0) {
      hits.push({
        group: "parts",
        title: part.title,
        subtitle: `شماره فنی ${part.partNo}`,
        href: `/spare-parts?q=${encodeURIComponent(part.partNo)}`,
        score,
      });
    }
  }

  for (const s of services) {
    const score = scoreText(q, [
      { text: s.name, weight: 6 },
      { text: s.latin, weight: 4 },
      { text: s.blurb, weight: 2 },
    ]);
    if (score > 0) {
      hits.push({
        group: "services",
        title: s.name,
        subtitle: s.blurb,
        href: `/services/${s.slug}`,
        score,
      });
    }
  }

  for (const b of brands) {
    const score = scoreText(q, [
      { text: b.name, weight: 7 },
      { text: b.blurb, weight: 1 },
    ]);
    if (score > 0) {
      hits.push({
        group: "brands",
        title: b.name,
        subtitle: b.blurb,
        href: `/brands/${b.slug}`,
        score,
      });
    }
  }

  return hits.sort((a, b) => b.score - a.score);
}

export const groupLabels: Record<SearchGroup, string> = {
  products: "محصولات",
  solutions: "راهکارها",
  knowledge: "راهنما و مقالات",
  parts: "قطعات یدکی",
  services: "خدمات",
  brands: "برندها",
};

export function groupHits(hits: SearchHit[]): { group: SearchGroup; items: SearchHit[] }[] {
  const order: SearchGroup[] = ["products", "solutions", "parts", "knowledge", "services", "brands"];
  return order
    .map((group) => ({ group, items: hits.filter((h) => h.group === group).slice(0, 6) }))
    .filter((g) => g.items.length > 0);
}
