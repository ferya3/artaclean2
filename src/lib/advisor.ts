import { areaBandRange } from "@/lib/data/taxonomy";
import type {
  AreaBand,
  DirtKind,
  FrequencyBand,
  ProductCardData,
  SurfaceKind,
} from "@/lib/types";

/**
 * موتور Product Advisor.
 *
 * مسیر Problem → Solution → Product: کاربر نمی‌گوید «اسکرابر سرنشین‌دار ۸۵۰»،
 * می‌گوید «کف کارخانه‌ام ۵٬۰۰۰ متر است و روغن ریخته». این ماژول همان جمله را
 * به فهرست رتبه‌بندی‌شده دستگاه ترجمه می‌کند و — مهم‌تر — دلیل هر پیشنهاد را
 * برمی‌گرداند تا کاربر بتواند پیشنهاد را قضاوت کند، نه اینکه فقط قبولش کند.
 *
 * فهرست دستگاه‌ها به‌صورت پارامتر می‌آید: کاتالوگ در دیتابیس است و این ماژول
 * از کامپوننت کلاینت هم صدا زده می‌شود، پس حق خواندن مستقیم ندارد.
 */

export interface AdvisorAnswers {
  surface?: SurfaceKind;
  dirt?: DirtKind;
  area?: AreaBand;
  frequency?: FrequencyBand;
}

export interface AdvisorResult {
  product: ProductCardData;
  score: number;
  /** درصد تناسب برای نمایش. */
  match: number;
  reasons: string[];
  caveats: string[];
}

const WEIGHTS = {
  surface: 30,
  dirt: 30,
  area: 28,
  frequency: 12,
} as const;

/** هم‌پوشانی بازه متراژ کاربر با بازه پوششی دستگاه، به‌صورت نسبت ۰ تا ۱. */
function areaOverlap(band: AreaBand, p: ProductCardData): number {
  const [uMin, uMax] = areaBandRange[band];
  const { areaMin, areaMax } = p.facets;
  const overlap = Math.min(uMax, areaMax) - Math.max(uMin, areaMin);
  if (overlap <= 0) return 0;
  return overlap / (uMax - uMin);
}

function scoreAll(answers: AdvisorAnswers, pool: ProductCardData[]): AdvisorResult[] {
  return pool.map<AdvisorResult>((product) => {
    let score = 0;
    let possible = 0;
    const reasons: string[] = [];
    const caveats: string[] = [];

    if (answers.surface) {
      possible += WEIGHTS.surface;
      if (product.fit.surfaces.includes(answers.surface)) {
        score += WEIGHTS.surface;
        reasons.push("برای سطح انتخابی شما طراحی شده");
      } else {
        caveats.push("سطح انتخابی، کاربرد اصلی این دستگاه نیست");
      }
    }

    if (answers.dirt) {
      possible += WEIGHTS.dirt;
      if (product.fit.dirt.includes(answers.dirt)) {
        score += WEIGHTS.dirt;
        reasons.push("با نوع آلودگی شما سازگار است");
      } else {
        caveats.push("برای این نوع آلودگی گزینه بهتری هم هست");
      }
    }

    if (answers.area) {
      possible += WEIGHTS.area;
      const overlap = areaOverlap(answers.area, product);
      score += WEIGHTS.area * overlap;
      if (overlap >= 0.6) {
        reasons.push("اندازه دستگاه با متراژ شما هم‌خوان است");
      } else if (overlap > 0) {
        caveats.push("متراژ شما در لبه بازه کاری این دستگاه است");
      } else if (product.facets.areaMax < areaBandRange[answers.area][0]) {
        caveats.push("برای این متراژ کوچک است؛ زمان نظافت طولانی می‌شود");
      } else {
        caveats.push("برای این متراژ بزرگ‌تر از نیاز است");
      }
    }

    if (answers.frequency) {
      possible += WEIGHTS.frequency;
      if (product.fit.frequency.includes(answers.frequency)) {
        score += WEIGHTS.frequency;
        reasons.push("برای این تناوب استفاده مناسب است");
      } else if (answers.frequency === "daily") {
        caveats.push("برای کار روزانه و پیوسته کلاس بالاتری پیشنهاد می‌شود");
      }
    }

    return {
      product,
      score,
      match: possible === 0 ? 0 : Math.round((score / possible) * 100),
      reasons,
      caveats,
    };
  });
}

function rank(results: AdvisorResult[], threshold: number, limit: number): AdvisorResult[] {
  return results
    .filter((r) => r.match >= threshold)
    .sort((a, b) => b.match - a.match || a.product.facets.areaMax - b.product.facets.areaMax)
    .slice(0, limit);
}

/**
 * دستگاه‌های پیشنهادی — پاسخ پرسش اصلی کاربر.
 *
 * `machines` باید بدون مصرفی باشد. مصرفی‌ها (شوینده، پد، لوازم جانبی) بازه
 * متراژ نامحدود دارند و با هر آلودگی سازگارند، پس در امتیازدهی خام همیشه
 * بالای دستگاه‌ها می‌نشینند — در حالی که پرسش کاربر «چه دستگاهی نیاز دارم»
 * است. تقسیم کاتالوگ به دو فهرست، کار فراخوان است (گروه دسته `consumable`).
 */
export function recommend(
  answers: AdvisorAnswers,
  machines: ProductCardData[],
  limit = 6,
): AdvisorResult[] {
  if (Object.values(answers).filter(Boolean).length === 0) return [];
  return rank(scoreAll(answers, machines), 35, limit);
}

/** مصرفی‌ها و لوازم مکمل — کنار دستگاه پیشنهاد می‌شوند، نه به‌جای آن. */
export function recommendComplements(
  answers: AdvisorAnswers,
  consumables: ProductCardData[],
  limit = 3,
): AdvisorResult[] {
  if (!answers.dirt && !answers.surface) return [];
  return rank(scoreAll(answers, consumables), 60, limit);
}

/**
 * توصیه انتخاب در جدول مقایسه: بین چند دستگاه، کدام برای متراژ اعلامی مناسب‌تر است.
 * عمداً ساده و قابل توضیح نگه داشته شده — کاربر باید بتواند با آن بحث کند.
 */
export function recommendAmong(
  slugs: string[],
  pool: ProductCardData[],
  band?: AreaBand,
): { slug: string; why: string } | null {
  const picked = pool.filter((p) => slugs.includes(p.slug));
  if (picked.length < 2) return null;

  if (!band) {
    const best = picked.reduce((a, b) => (a.facets.areaMax > b.facets.areaMax ? a : b));
    return {
      slug: best.slug,
      why: "با اعلام متراژ سایت، پیشنهاد دقیق‌تری می‌دهیم. فعلاً بزرگ‌ترین بازه کاری را این مدل پوشش می‌دهد.",
    };
  }

  const scored = picked
    .map((p) => ({ p, overlap: areaOverlap(band, p) }))
    .sort((a, b) => b.overlap - a.overlap);

  const winner = scored[0];
  if (winner.overlap === 0) {
    return {
      slug: winner.p.slug,
      why: "هیچ‌کدام از این مدل‌ها دقیقاً برای متراژ اعلامی ساخته نشده‌اند؛ نزدیک‌ترین گزینه این است.",
    };
  }

  return {
    slug: winner.p.slug,
    why: `برای متراژ اعلامی، بازه کاری ${winner.p.model} بیشترین هم‌پوشانی را دارد و زمان نظافت را نزدیک به بهینه نگه می‌دارد.`,
  };
}
