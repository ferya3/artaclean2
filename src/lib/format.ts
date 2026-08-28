import type { Spec } from "@/lib/types";

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** اعداد فارسی برای متن روان. */
export function fa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => faDigits[Number(d)]);
}

/**
 * اعداد مشخصات فنی لاتین و با جداکننده هزارگان می‌مانند
 * تا در جدول مقایسه tabular-nums درست بنشینند.
 */
export function num(n: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
}

export function specValue(spec: Spec): string {
  if (spec.text) return spec.text;
  if (spec.value === undefined) return "—";
  return spec.unit ? `${num(spec.value)} ${spec.unit}` : num(spec.value);
}

export function toman(amount: number): string {
  return `${fa(new Intl.NumberFormat("en-US").format(amount))} تومان`;
}

/** m² با اعداد فارسی، برای متن‌های توضیحی. */
export function area(n: number): string {
  return `${fa(new Intl.NumberFormat("en-US").format(n))} متر مربع`;
}
