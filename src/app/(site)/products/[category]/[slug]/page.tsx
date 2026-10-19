import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import CompareToggle from "@/components/compare/CompareToggle";
import Applications from "@/components/product/Applications";
import Gallery from "@/components/product/Gallery";
import KpiStrip from "@/components/product/KpiStrip";
import ProductCard from "@/components/product/ProductCard";
import SpecSheet from "@/components/product/SpecSheet";
import { Breadcrumbs } from "@/components/ui/Primitives";
import Reveal from "@/components/motion/Reveal";
import {
  getBrand,
  getCategory,
  getIndustries,
  getParts,
  getProduct,
  getProducts,
} from "@/lib/content";
import { fa, specValue, toman } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ category: p.category, slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — ${product.model}`,
    description: product.summary,
    alternates: { canonical: `/products/${product.category}/${product.slug}` },
  };
}

const SECTIONS = [
  { id: "overview", label: "معرفی" },
  { id: "applications", label: "کاربردها" },
  { id: "specs", label: "مشخصات فنی" },
  { id: "downloads", label: "دانلودها" },
  { id: "parts", label: "قطعات و لوازم" },
  { id: "faq", label: "پرسش‌های متداول" },
];

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const brand = getBrand(product.brand);
  const related = product.related
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const parts = getParts().filter((part) => part.fitsModels.includes(product.slug));
  const industries = getIndustries().map((i) => ({
    slug: i.slug,
    name: i.name,
    blurb: i.blurb,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    model: product.model,
    description: product.summary,
    brand: { "@type": "Brand", name: brand?.name ?? product.brand },
    category: category?.name,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "IRR",
      ...(product.price ? { price: product.price * 10 } : {}),
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ═════════════════════════════════════════ باند تیره معرفی محصول */}
      <section className="section-deep grain pb-16 pt-6">
        <div
          className="glow -top-16 start-[20%] h-96 w-96 opacity-25"
          style={{ background: "rgb(var(--c-accent))" }}
        />
        <div className="absolute inset-0 blueprint opacity-70" aria-hidden />

        <div className="shell relative">
          <div className="pb-8 text-white/45 [&_a:hover]:text-white [&_span]:text-white/80">
            <Breadcrumbs
              trail={[
                { label: "خانه", href: "/" },
                { label: "محصولات", href: "/products" },
                { label: category?.name ?? "دسته", href: `/products/${product.category}` },
                { label: product.model },
              ]}
            />
          </div>

          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <Gallery product={product} />
            </Reveal>

            <Reveal delay={120} className="lg:col-span-6">
              <div className="flex flex-wrap items-center gap-2">
                {product.badges?.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-white shadow-glow"
                  >
                    {b}
                  </span>
                ))}
                {brand && (
                  <Link
                    href={`/brands/${brand.slug}`}
                    className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold text-white/70 transition-colors hover:border-white/35 hover:text-white"
                  >
                    {brand.name}
                  </Link>
                )}
                {product.subcategory && (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/50">
                    {product.subcategory}
                  </span>
                )}
              </div>

              <h1 className="mt-5 text-hero font-black text-white text-balance">{product.name}</h1>
              <p className="mt-4 text-lg leading-9 text-white/60">{product.tagline}</p>

              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl2 border border-white/10 bg-white/10">
                {product.kpis.map((spec) => (
                  <div key={spec.key} className="bg-deep-2/80 px-5 py-4">
                    <dt className="text-[11px] text-white/40">{spec.label}</dt>
                    <dd className={`mt-1 text-lg font-black text-white ${spec.text ? "" : "num"}`}>
                      {specValue(spec)}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7">
                {product.priceMode === "listed" && product.price ? (
                  <p className="text-2xl font-black text-white">{toman(product.price)}</p>
                ) : (
                  <p className="text-sm leading-7 text-white/45">
                    قیمت این دستگاه بر اساس پیکربندی، تعداد و شرایط سایت اعلام می‌شود.
                  </p>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/quote?product=${product.slug}`} className={cn(buttonVariants({ variant: "accent" }), "px-6 py-3.5")}>
                  {product.priceMode === "listed" ? "ثبت سفارش" : "درخواست پیش‌فاکتور"}
                </Link>
                <Link href="/quote" className={cn(buttonVariants({ variant: "glass" }), "px-6 py-3.5")}>
                  مشاوره تخصصی
                </Link>
                <CompareToggle slug={product.slug} tone="deep" className="px-6 py-3.5" />
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-xs text-white/40">
                {["نصب و راه‌اندازی در محل", "آموزش اپراتور", `${fa(12)} ماه گارانتی`].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-accent" aria-hidden>
                      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ناوبری بخش‌های صفحه */}
      <nav className="sticky top-16 z-20 border-b border-line bg-surface/95 backdrop-blur-xl">
        <div className="shell flex gap-1 overflow-x-auto py-2 text-sm">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-lg px-4 py-2 font-medium text-muted transition-colors hover:bg-canvas hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* چرا این دستگاه */}
      <section id="overview" className="shell scroll-mt-32 py-20">
        <Reveal>
          <h2 className="mb-10 text-section font-extrabold">چرا این دستگاه؟</h2>
          <KpiStrip kpis={product.kpis} />
        </Reveal>

        <Reveal delay={100}>
          <p className="mt-14 max-w-3xl text-xl leading-10 text-balance">{product.summary}</p>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {product.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="card card-hover h-full p-7">
                <span className="num block text-xs font-bold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-[17px] font-bold leading-7">{f.title}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* کاربردها */}
      <section id="applications" className="border-y border-line bg-surface py-20">
        <div className="shell scroll-mt-32">
          <Reveal>
            <h2 className="mb-3 text-section font-extrabold">
              این دستگاه برای چه محیط‌هایی مناسب است؟
            </h2>
            <p className="mb-9 text-muted">روی هر محیط بزنید تا کاربرد مشخص همان محیط را ببینید.</p>
          </Reveal>
          <Applications applications={product.applications} industries={industries} />
        </div>
      </section>

      {/* مشخصات فنی */}
      <section id="specs" className="shell scroll-mt-32 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="mb-9 text-section font-extrabold">مشخصات فنی</h2>
            <SpecSheet groups={product.specGroups} />
          </div>

          <aside className="lg:col-span-5">
            <div className="section-deep grain sticky top-32 rounded-xl2 p-8">
              <div
                className="glow -top-8 start-4 h-32 w-32 opacity-30"
                style={{ background: "rgb(var(--c-accent))" }}
              />
              <div className="relative">
                <p className="text-lg font-bold text-white">
                  مطمئن نیستید این مدل اندازه سایت شماست؟
                </p>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  متراژ و نوع آلودگی را بگویید تا بین این مدل و مدل‌های نزدیک، گزینه درست را با
                  برآورد زمان نظافت پیشنهاد کنیم.
                </p>
                <Link href="/advisor" className={cn(buttonVariants({ variant: "accent" }), "mt-6 w-full")}>
                  مقایسه با شرایط سایت من
                </Link>
                <Link href="/compare" className={cn(buttonVariants({ variant: "glass" }), "mt-2 w-full")}>
                  جدول مقایسه دستگاه‌ها
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* دانلودها */}
      <section id="downloads" className="border-y border-line bg-surface py-20">
        <div className="shell scroll-mt-32">
          <h2 className="mb-9 text-section font-extrabold">دانلودها</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.downloads.map((d, i) => (
              <Reveal key={d.title} delay={i * 60} as="li">
                <a href={d.href} className="card card-hover group flex items-center gap-4 p-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-[11px] font-black text-accent">
                    PDF
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{d.title}</span>
                    <span className="block text-xs text-muted">{d.size}</span>
                  </span>
                  <span className="text-muted transition-transform duration-300 group-hover:-translate-x-1">←</span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* لوازم جانبی و قطعات */}
      <section id="parts" className="shell scroll-mt-32 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-7 text-section font-extrabold">لوازم جانبی</h2>
            <ul className="divide-y divide-line border-y border-line">
              {product.accessories.map((a) => (
                <li key={a} className="flex items-center gap-3 py-3.5 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-7 text-section font-extrabold">قطعات یدکی این مدل</h2>
            {parts.length ? (
              <ul className="divide-y divide-line border-y border-line">
                {parts.map((p) => (
                  <li key={p.partNo} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                    <span>
                      <span className="block font-medium">{p.title}</span>
                      <span className="num block text-xs text-muted">{p.partNo}</span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        p.inStock ? "bg-accent-soft text-accent" : "bg-ink/[0.05] text-muted"
                      }`}
                    >
                      {p.inStock ? "موجود" : "استعلامی"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">قطعات این مدل با استعلام تأمین می‌شود.</p>
            )}
            <Link href="/spare-parts" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-6")}>
              جستجوی کامل قطعات ←
            </Link>
          </div>
        </div>
      </section>

      {/* پرسش‌های متداول */}
      <section id="faq" className="border-y border-line bg-surface py-20">
        <div className="shell max-w-3xl scroll-mt-32">
          <h2 className="mb-9 text-section font-extrabold">پرسش‌های متداول</h2>
          <div className="divide-y divide-line border-y border-line">
            {product.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-open:rotate-45 group-open:border-accent group-open:text-accent">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-8 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* محصولات مرتبط */}
      {related.length > 0 && (
        <section className="shell py-20">
          <h2 className="mb-9 text-section font-extrabold">دستگاه‌های مرتبط</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
