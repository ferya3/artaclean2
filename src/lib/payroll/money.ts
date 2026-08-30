import { fa } from "@/lib/format";

/**
 * ثابت‌ها و محاسبات به ریال‌اند (واحد بخشنامه)، ولی کاربر با تومان کار می‌کند.
 * تبدیل فقط همین‌جا انجام می‌شود تا هیچ‌جای دیگری ضرب و تقسیم بر ۱۰ نباشد.
 */

export type MoneyUnit = "toman" | "rial";

export const unitFactor: Record<MoneyUnit, number> = { toman: 10, rial: 1 };
export const unitLabel: Record<MoneyUnit, string> = { toman: "تومان", rial: "ریال" };

const group = (n: number, maxFraction = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: maxFraction }).format(n);

/** عدد لاتین با جداکننده هزارگان — برای جدول‌ها و فیلدهای ورودی. */
export function moneyPlain(rial: number, unit: MoneyUnit): string {
  return group(rial / unitFactor[unit]);
}

/** مبلغ کامل با واحد، اعداد فارسی — برای متن‌های توضیحی. */
export function money(rial: number, unit: MoneyUnit): string {
  return `${fa(moneyPlain(rial, unit))} ${unitLabel[unit]}`;
}

const digitMap: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

/** اعداد فارسی/عربی و جداکننده‌ها را می‌پذیرد و عدد لاتین می‌دهد. */
export function parseNumber(text: string): number {
  const latin = text
    .replace(/[۰-۹٠-٩]/g, (d) => digitMap[d] ?? d)
    .replace(/[٫،]/g, ".")
    .replace(/[^\d.]/g, "");
  const n = Number(latin);
  return Number.isFinite(n) ? n : 0;
}

/** متن واردشده در واحد نمایشی را به ریال تبدیل می‌کند. */
export function parseMoney(text: string, unit: MoneyUnit): number {
  return parseNumber(text) * unitFactor[unit];
}

/**
 * درصد با اعداد فارسی و بدون دنباله اعشار ممیز شناور
 * (۰.۰۷ × ۱۰۰ در جاوااسکریپت ۷.۰۰۰۰۰۰۰۰۰۰۰۰۰۰۱ می‌شود).
 */
export function pct(rate: number): string {
  return fa(String(Number((rate * 100).toFixed(2))));
}

/** ضریب یا عدد اعشاری کوتاه با اعداد فارسی — مثل ضریب ۱.۴ اضافه‌کاری. */
export function factor(n: number): string {
  return fa(String(Number(n.toFixed(2))));
}
