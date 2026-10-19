import type { Metadata } from "next";

// فونت لوکال از node_modules سرو می‌شود، نه از CDN — سایت دیگر به دسترسی
// مرورگر کاربر به jsDelivr وابسته نیست.
import "@fontsource-variable/vazirmatn";
import "./globals.css";

import { getPage } from "@/lib/content";
import { siteSettings } from "@/lib/site";

export function generateMetadata(): Metadata {
  const site = siteSettings();
  const home = getPage("home");

  return {
    metadataBase: new URL(process.env.SITE_URL ?? "https://example.com"),
    title: {
      default: home.metaTitle || `${site.brandName} — ${site.description.slice(0, 60)}`,
      template: `%s | ${site.brandName}`,
    },
    description: home.metaDescription || site.description,
    openGraph: { type: "website", locale: "fa_IR", siteName: site.brandName },
  };
}

/**
 * لایه ریشه عمداً خالی از «پوسته» است.
 *
 * هدر، فوتر، اسکرول نرم و نوار CTA به گروه (site) منتقل شده‌اند تا پنل
 * مدیریت آن‌ها را به ارث نبرد — وگرنه هر صفحه ادمین هم باندل صحنه سه‌بعدی،
 * Lenis و نوار «درخواست قیمت» را حمل می‌کرد.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
