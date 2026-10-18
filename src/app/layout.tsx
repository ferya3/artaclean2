import type { Metadata } from "next";

// فونت لوکال از node_modules سرو می‌شود، نه از CDN — سایت دیگر به دسترسی
// مرورگر کاربر به jsDelivr وابسته نیست.
import "@fontsource-variable/vazirmatn";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "https://example.com"),
  title: {
    default: "آرتا کلین — تجهیزات نظافت صنعتی، راهکار و خدمات",
    template: "%s | آرتا کلین",
  },
  description:
    "اسکرابر، سویپر، مکنده صنعتی، واترجت و بخارشوی؛ انتخاب دستگاه بر اساس متراژ و نوع آلودگی سایت شما، به‌همراه خدمات نصب، سرویس، قطعات و آموزش.",
  openGraph: { type: "website", locale: "fa_IR", siteName: "آرتا کلین" },
};

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
