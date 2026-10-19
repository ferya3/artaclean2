import type { Product } from "@/lib/types";

/**
 * بیشینه هر مشخصه در کل کاتالوگ.
 * کارت محصول عدد خام را نشان می‌دهد، ولی خریدار بدون مبنا نمی‌داند «۳٬۴۰۰ متر
 * در ساعت» زیاد است یا کم. نوار نسبت، همان عدد را در مقیاس کاتالوگ قرار می‌دهد.
 *
 * چون کاتالوگ حالا در دیتابیس است، این جدول هنگام رندر سرور ساخته و از طریق
 * SpecScaleProvider به کامپوننت‌های کلاینت داده می‌شود.
 */
export type SpecMaxima = Record<string, number>;

export function buildSpecMaxima(products: Product[]): SpecMaxima {
  const maxima: SpecMaxima = {};
  for (const product of products) {
    for (const spec of [...product.kpis, ...product.specGroups.flatMap((g) => g.specs)]) {
      if (spec.value === undefined) continue;
      if (spec.value > (maxima[spec.key] ?? 0)) maxima[spec.key] = spec.value;
    }
  }
  return maxima;
}

export function specRatio(maxima: SpecMaxima, key: string, value?: number): number | null {
  if (value === undefined) return null;
  const max = maxima[key];
  if (!max || max <= 0) return null;
  return value / max;
}

/**
 * مقیاس تصویر محصول از بازه متراژ پوششی می‌آید:
 * در یک فهرست، دستگاه بزرگ‌تر باید واقعاً بزرگ‌تر دیده شود.
 */
export function visualScale(areaMax: number): number {
  const min = Math.log10(1000);
  const max = Math.log10(80000);
  const t = (Math.log10(Math.max(1000, areaMax)) - min) / (max - min);
  return 0.84 + Math.min(1, Math.max(0, t)) * 0.3;
}
