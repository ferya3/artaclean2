import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import CompareToggle from "@/components/compare/CompareToggle";
import Applications from "@/components/product/Applications";
import Gallery from "@/components/product/Gallery";
import KpiStrip from "@/components/product/KpiStrip";
import ProductCard from "@/components/product/ProductCard";
import SpecSheet from "@/components/product/SpecSheet";
import { Badge, Breadcrumbs } from "@/components/ui/Primitives";
import { getBrand } from "@/lib/data/brands";
import { spareParts } from "@/lib/data/parts";
import { getProduct, products } from "@/lib/data/products";
import { getCategory } from "@/lib/data/taxonomy";
import { fa, specValue, toman } from "@/lib/format";

type Params = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ category: p.category, slug: p.slug }));
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
  const parts = spareParts.filter((part) => part.fitsModels.includes(product.slug));

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="shell py-6">
        <Breadcrumbs
          trail={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/products" },
            { label: category?.name ?? "دسته", href: `/products/${product.category}` },
            { label: product.model },
          ]}
        />
      </div>

      {/* هدر محصول */}
      <section className="shell grid gap-10 pb-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Gallery model={product.model} />
        </div>

        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            {product.badges?.map((b) => (
              <Badge key={b} tone="accent">
                {b}
              </Badge>
            ))}
            {brand && (
              <Link href={`/brands/${brand.slug}`} className="chip hover:border-ink/30">
                {brand.name}
              </Link>
            )}
            {product.subcategory && <Badge>{product.subcategory}</Badge>}
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg leading-8 text-muted">{product.tagline}</p>

          <dl className="mt-6 divide-y divide-line border-y border-line">
            {product.kpis.map((spec) => (
              <div key={spec.key} className="flex items-baseline justify-between py-2.5 text-sm">
                <dt className="text-muted">{spec.label}</dt>
                <dd className={spec.text ? "font-semibold" : "num font-semibold"}>{specValue(spec)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5">
            {product.priceMode === "listed" && product.price ? (
              <p className="text-2xl font-bold">{toman(product.price)}</p>
            ) : (
              <p className="text-sm text-muted">
                قیمت این دستگاه بر اساس پیکربندی، تعداد و شرایط سایت اعلام می‌شود.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/quote?product=${product.slug}`} className="btn-accent px-5 py-3">
              {product.priceMode === "listed" ? "ثبت سفارش" : "درخواست پیش‌فاکتور"}
            </Link>
            <Link href="/quote" className="btn-ghost px-5 py-3">
              مشاوره تخصصی
            </Link>
            <CompareToggle slug={product.slug} className="px-5 py-3" />
          </div>

          <p className="mt-5 text-xs leading-6 text-muted">
            شامل نصب و راه‌اندازی در محل، آموزش اپراتور و {fa(12)} ماه گارانتی.{" "}
            <Link href="/services/warranty" className="text-accent hover:underline">
              شرایط گارانتی
            </Link>
          </p>
        </div>
      </section>

      {/* ناوبری بخش‌های صفحه */}
      <nav className="sticky top-16 z-20 border-y border-line bg-surface/95 backdrop-blur">
        <div className="shell flex gap-1 overflow-x-auto py-2 text-sm">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-muted hover:bg-canvas hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* چرا این دستگاه */}
      <section id="overview" className="shell scroll-mt-32 py-14">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">چرا این دستگاه؟</h2>
        <KpiStrip kpis={product.kpis} />

        <p className="mt-10 max-w-3xl text-lg leading-9">{product.summary}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {product.features.map((f) => (
            <div key={f.title} className="card p-6">
              <p className="font-semibold">{f.title}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* کاربردها */}
      <section id="applications" className="border-y border-line bg-surface py-14">
        <div className="shell scroll-mt-32">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            این دستگاه برای چه محیط‌هایی مناسب است؟
          </h2>
          <p className="mb-8 text-muted">روی هر محیط بزنید تا کاربرد مشخص همان محیط را ببینید.</p>
          <Applications applications={product.applications} />
        </div>
      </section>

      {/* مشخصات فنی */}
      <section id="specs" className="shell scroll-mt-32 py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">مشخصات فنی</h2>
            <SpecSheet groups={product.specGroups} />
          </div>

          <aside className="lg:col-span-5">
            <div className="card bg-canvas p-6">
              <p className="font-semibold">مطمئن نیستید این مدل اندازه سایت شماست؟</p>
              <p className="mt-2 text-sm leading-7 text-muted">
                متراژ و نوع آلودگی را بگویید تا بین این مدل و مدل‌های نزدیک، گزینه درست را با برآورد
                زمان نظافت پیشنهاد کنیم.
              </p>
              <Link href="/advisor" className="btn-primary mt-4 w-full">
                مقایسه با شرایط سایت من
              </Link>
              <Link href="/compare" className="btn-ghost mt-2 w-full">
                جدول مقایسه دستگاه‌ها
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* دانلودها */}
      <section id="downloads" className="border-y border-line bg-surface py-14">
        <div className="shell scroll-mt-32">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">دانلودها</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.downloads.map((d) => (
              <li key={d.title}>
                <a href={d.href} className="card flex items-center gap-4 p-4 hover:shadow-card">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold">
                    PDF
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{d.title}</span>
                    <span className="block text-xs text-muted">{d.size}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* لوازم جانبی و قطعات */}
      <section id="parts" className="shell scroll-mt-32 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight">لوازم جانبی</h2>
            <ul className="divide-y divide-line border-y border-line">
              {product.accessories.map((a) => (
                <li key={a} className="py-3 text-sm">
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight">قطعات یدکی این مدل</h2>
            {parts.length ? (
              <ul className="divide-y divide-line border-y border-line">
                {parts.map((p) => (
                  <li key={p.partNo} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span>
                      <span className="block">{p.title}</span>
                      <span className="num block text-xs text-muted">{p.partNo}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">
                      {p.inStock ? <span className="text-accent">موجود</span> : "استعلامی"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted">قطعات این مدل با استعلام تأمین می‌شود.</p>
            )}
            <Link href="/spare-parts" className="btn-ghost mt-5">
              جستجوی کامل قطعات
            </Link>
          </div>
        </div>
      </section>

      {/* پرسش‌های متداول */}
      <section id="faq" className="border-y border-line bg-surface py-14">
        <div className="shell scroll-mt-32 max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">پرسش‌های متداول</h2>
          <div className="divide-y divide-line border-y border-line">
            {product.faqs.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium">
                  {f.q}
                  <span className="text-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* محصولات مرتبط */}
      {related.length > 0 && (
        <section className="shell py-14">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">دستگاه‌های مرتبط</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
