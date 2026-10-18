import CompareBar from "@/components/compare/CompareBar";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import StickyCta from "@/components/layout/StickyCta";
import SmoothScroll from "@/components/providers/SmoothScroll";

/** پوسته سایت عمومی: هدر، فوتر و لایه‌های شناور. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareBar />
      <StickyCta />
    </div>
  );
}
