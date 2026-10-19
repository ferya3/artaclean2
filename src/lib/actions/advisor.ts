"use server";

import { recommend, recommendComplements, type AdvisorAnswers, type AdvisorResult } from "@/lib/advisor";
import { consumableCategorySlugs, getProducts, toCardData } from "@/lib/content";
import type { AreaBand, DirtKind, FrequencyBand, SurfaceKind } from "@/lib/types";

/**
 * امتیازدهی مشاور، سمت سرور.
 *
 * نسخه قبلی کل کاتالوگ را به کامپوننت کلاینت می‌داد تا همان‌جا امتیاز بدهد.
 * با ۱۸ محصول نامحسوس بود؛ با ۴۰۰ دستگاهِ کاتالوگ واقعی یعنی صدها کیلوبایت
 * که کاربر موبایل پیش از دیدن نخستین پرسش دانلود می‌کند — در حالی که فقط
 * شش نتیجه را خواهد دید.
 *
 * حالا پاسخ‌ها بالا می‌روند و فقط همان چند نتیجه برمی‌گردد. هزینه‌اش یک
 * رفت‌وبرگشت به ازای هر پاسخ است (چهار بار در کل مسیر).
 */
export interface AdviceResponse {
  results: AdvisorResult[];
  complements: AdvisorResult[];
}

const SURFACES: SurfaceKind[] = [
  "factory-floor",
  "warehouse",
  "parking",
  "production-line",
  "machinery",
  "vertical",
  "carpet",
];
const DIRTS: DirtKind[] = ["dust", "oil", "grease", "mud", "food", "chemical"];
const AREAS: AreaBand[] = ["lt500", "500-2000", "2000-10000", "gt10000"];
const FREQUENCIES: FrequencyBand[] = ["daily", "weekly", "monthly", "seasonal"];

const pick = <T extends string>(value: unknown, allowed: T[]): T | undefined =>
  typeof value === "string" && (allowed as string[]).includes(value) ? (value as T) : undefined;

/** پاسخ‌ها از کلاینت می‌آیند، پس پیش از استفاده به واژگان معتبر محدود می‌شوند. */
export async function adviseAction(input: AdvisorAnswers): Promise<AdviceResponse> {
  const answers: AdvisorAnswers = {
    surface: pick(input?.surface, SURFACES),
    dirt: pick(input?.dirt, DIRTS),
    area: pick(input?.area, AREAS),
    frequency: pick(input?.frequency, FREQUENCIES),
  };

  return advise(answers);
}

/** همان محاسبه، برای فراخوانی مستقیم از صفحه سرور (نخستین رندر). */
export async function advise(answers: AdvisorAnswers): Promise<AdviceResponse> {
  if (Object.values(answers).every((v) => !v)) return { results: [], complements: [] };

  const consumables = new Set(consumableCategorySlugs());
  const all = getProducts().map(toCardData);

  return {
    results: recommend(
      answers,
      all.filter((p) => !consumables.has(p.category)),
    ),
    complements: recommendComplements(
      answers,
      all.filter((p) => consumables.has(p.category)),
    ),
  };
}
