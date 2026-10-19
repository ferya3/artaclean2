import CompareBar from "@/components/compare/CompareBar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import StickyCta from "@/components/layout/StickyCta";
import { SiteDataProvider } from "@/components/providers/SiteData";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { getIndustries, getProducts } from "@/lib/content";
import { siteNav } from "@/lib/nav";
import { buildSpecMaxima } from "@/lib/scale";
import { siteSettings } from "@/lib/site";

/** پوسته سایت عمومی: هدر، فوتر و لایه‌های شناور. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = siteSettings();
  const nav = siteNav();

  // دو جدول کوچکی که کامپوننت‌های کلاینت لازم دارند؛ بقیه داده با
  // Server Action گرفته می‌شود، نه از طریق باندل.
  const siteData = {
    maxima: buildSpecMaxima(getProducts()),
    industryNames: Object.fromEntries(getIndustries().map((i) => [i.slug, i.name])),
  };

  return (
    <SiteDataProvider value={siteData}>
      <div className="flex min-h-screen flex-col">
        <SmoothScroll />
        <Header
          nav={nav}
          site={{
            brandName: site.brandName,
            brandShort: site.brandShort,
            phone: site.phone,
            phoneDisplay: site.phoneDisplay,
            topbar: site.topbar,
          }}
        />
        <main className="flex-1">{children}</main>
        <Footer nav={nav} site={site} />
        <CompareBar />
        <StickyCta />
      </div>
    </SiteDataProvider>
  );
}
