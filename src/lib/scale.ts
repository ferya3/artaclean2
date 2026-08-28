import { products } from "@/lib/data/products";

/**
 * بیشینه هر مشخصه در کل کاتالوگ.
 * کارت محصول عدد خام را نشان می‌دهد، ولی خریدار بدون مبنا نمی‌داند «۳٬۴۰۰ متر
 * در ساعت» زیاد است یا کم. نوار نسبت، همان عدد را در مقیاس کاتالوگ قرار می‌دهد.
 */
const maxByKey = new Map<string, number>();

for (const product of products) {
  for (const spec of [...product.kpis, ...product.specGroups.flatMap((g) => g.specs)]) {
    if (spec.value === undefined) continue;
    const current = maxByKey.get(spec.key) ?? 0;
    if (spec.value > current) maxByKey.set(spec.key, spec.value);
  }
}

export function specRatio(key: string, value?: number): number | null {
  if (value === undefined) return null;
  const max = maxByKey.get(key);
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
