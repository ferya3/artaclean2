"use client";

import { createContext, useContext, useMemo } from "react";

import { specRatio, type SpecMaxima } from "@/lib/scale";

/**
 * داده‌ی کوچکِ مشترکی که کامپوننت‌های کلاینت سایت لازم دارند.
 *
 * تا پیش از این، کارت محصول برای نام صنعت و نوار نسبت، کل کاتالوگ را
 * import می‌کرد — یعنی ۱۸ محصول با همه مشخصات فنی در باندل کلاینت بود، و
 * با ۴۰۰ محصول اصلاً قابل دفاع نیست. حالا کاتالوگ در دیتابیس است و سرور
 * فقط همین دو جدول کوچک را پایین می‌فرستد:
 *
 *   maxima        → بیشینه هر مشخصه، برای نوار نسبت (چند ده عدد)
 *   industryNames → نگاشت شناسه صنعت به نام فارسی (چند ده رشته)
 *
 * هرچه بزرگ‌تر از این باشد (خودِ محصولات، قطعات، نتایج جست‌وجو) با
 * Server Action گرفته می‌شود، نه با prop.
 */
export interface SiteData {
  maxima: SpecMaxima;
  industryNames: Record<string, string>;
}

const SiteDataContext = createContext<SiteData>({ maxima: {}, industryNames: {} });

export function SiteDataProvider({
  value,
  children,
}: {
  value: SiteData;
  children: React.ReactNode;
}) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSpecRatio() {
  const { maxima } = useContext(SiteDataContext);
  return useMemo(() => (key: string, value?: number) => specRatio(maxima, key, value), [maxima]);
}

export function useIndustryNames() {
  return useContext(SiteDataContext).industryNames;
}
