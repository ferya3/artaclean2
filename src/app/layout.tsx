import type { Metadata } from "next";

import CompareBar from "@/components/compare/CompareBar";
import { CompareProvider } from "@/components/compare/CompareProvider";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import StickyCta from "@/components/layout/StickyCta";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "آرتا کلین — تجهیزات نظافت صنعتی، راهکار و خدمات",
    template: "%s | آرتا کلین",
  },
  description:
    "اسکرابر، سویپر، مکنده صنعتی، واترجت و بخارشوی؛ انتخاب دستگاه بر اساس متراژ و نوع آلودگی سایت شما، به‌همراه خدمات نصب، سرویس، قطعات و آموزش.",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "آرتا کلین",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="flex min-h-screen flex-col">
        <CompareProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
          <StickyCta />
        </CompareProvider>
      </body>
    </html>
  );
}
