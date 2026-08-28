import Link from "next/link";

import QuickAdvisor from "@/components/advisor/QuickAdvisor";
import ProductCard from "@/components/product/ProductCard";
import { ProductImage, SectionHeading } from "@/components/ui/Primitives";
import { brands } from "@/lib/data/brands";
import { industries } from "@/lib/data/industries";
import { articles, articleKindLabels, projects } from "@/lib/data/knowledge";
import { products } from "@/lib/data/products";
import { services } from "@/lib/data/services";
import { categories } from "@/lib/data/taxonomy";
import { fa } from "@/lib/format";

const FEATURED = ["vertex-r850", "arta-s700", "arta-w800", "vertex-ax60"];

const TRUST = [
  { title: "مشاوره فنی پیش از خرید", body: "انتخاب دستگاه بر اساس متراژ، نوع کف و آلودگی واقعی سایت — نه بر اساس موجودی انبار." },
  { title: "گارانتی مکتوب", body: "۱۲ ماه دستگاه و ۲۴ ماه باتری لیتیوم، با شرایط شفاف پیش از خرید." },
  { title: "سرویس در محل", body: "قرارداد نگهداری پیشگیرانه و اعزام تکنسین برای خرابی اضطراری." },
  { title: "قطعات تا ۱۰ سال", body: "تأمین مصرفی و قطعه یدکی برای تمام مدل‌های فروخته‌شده." },
  { title: "آموزش اپراتور", body: "دوره در محل؛ چون بیشتر خرابی‌های زودرس ریشه در استفاده نادرست دارد." },
];

export default function HomePage() {
  const featured = FEATURED.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <>
      {/* 01 — HERO */}
      <section className="border-b border-line bg-surface">
        <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <p className="eyebrow">تجهیزات نظافت صنعتی</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
              تجهیزات حرفه‌ای برای نظافت
              <br />
              سریع‌تر، ارزان‌تر و دقیق‌تر
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
              از کارخانه و انبار تا بیمارستان و مجتمع تجاری. ما اول شرایط سایت شما را می‌سنجیم، بعد
              دستگاه پیشنهاد می‌دهیم.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary px-5 py-3">
                مشاهده تجهیزات
              </Link>
              <Link href="/advisor" className="btn-ghost px-5 py-3">
                مشاوره انتخاب دستگاه
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-card border border-line bg-line">
              {[
                { v: "۲۸", l: "سال سابقه" },
                { v: "۱۲۰۰+", l: "دستگاه نصب‌شده" },
                { v: "۹۶٪", l: "تمدید قرارداد سرویس" },
              ].map((stat) => (
                <div key={stat.l} className="bg-surface px-4 py-5 text-center">
                  <dt className="text-2xl font-bold">{stat.v}</dt>
                  <dd className="mt-1 text-xs text-muted">{stat.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 02 — PRODUCT ADVISOR در همان Hero */}
          <div className="lg:col-span-5">
            <QuickAdvisor />
          </div>
        </div>
      </section>

      {/* 03 — دسته‌بندی محصولات */}
      <section className="shell py-16">
        <SectionHeading
          eyebrow="محصولات"
          title="دسته‌بندی تجهیزات"
          lead="اگر می‌دانید دنبال چه نوع دستگاهی هستید، از اینجا شروع کنید."
          action={
            <Link href="/products" className="btn-ghost">
              همه دسته‌ها
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((c) => (
            <Link key={c.slug} href={`/products/${c.slug}`} className="card group overflow-hidden">
              <ProductImage label={c.latin} ratio="aspect-[16/10]" />
              <div className="p-4">
                <p className="font-semibold group-hover:text-accent">{c.name}</p>
                <p className="mt-1 text-xs text-muted">{c.latin}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 04 — محصولات منتخب */}
      <section className="border-y border-line bg-surface py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="منتخب"
            title="پرکاربردترین دستگاه‌ها"
            lead="مدل‌هایی که بیشترین تناسب را با سایت‌های صنعتی ایران داشته‌اند."
            action={
              <Link href="/products" className="btn-ghost">
                همه محصولات
              </Link>
            }
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 05 — راهکار بر اساس صنعت */}
      <section className="shell py-16">
        <SectionHeading
          eyebrow="راهکارها"
          title="اگر مدل دستگاه را نمی‌دانید، از مسئله شروع کنید"
          lead="هر صنعت، ترکیب آلودگی و محدودیت خودش را دارد. راهکار را از همان‌جا می‌بندیم."
          action={
            <Link href="/solutions" className="btn-ghost">
              همه راهکارها
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {industries.slice(0, 6).map((i) => (
            <Link key={i.slug} href={`/solutions/${i.slug}`} className="card group p-6 hover:shadow-card">
              <p className="eyebrow">{i.latin}</p>
              <p className="mt-2 text-lg font-semibold group-hover:text-accent">{i.name}</p>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">{i.blurb}</p>
              <p className="mt-4 text-xs text-muted">
                {i.problems.length} مسئله رایج · {i.recommendedCategories.length} دسته پیشنهادی
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 06 — چرا ما */}
      <section className="border-y border-line bg-primary py-16 text-white">
        <div className="shell">
          <p className="eyebrow text-white/50">چرا ما</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-bold sm:text-3xl">
            خرید دستگاه صنعتی، نقطه پایان معامله نیست؛ نقطه شروع رابطه است
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-card bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {TRUST.map((item) => (
              <div key={item.title} className="bg-primary p-6">
                <p className="font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — برندها */}
      <section className="shell py-16">
        <SectionHeading eyebrow="برندها" title="برندهای موجود در کاتالوگ" />
        <div className="grid gap-4 sm:grid-cols-3">
          {brands.map((b) => (
            <Link key={b.slug} href={`/brands/${b.slug}`} className="card group p-6 hover:shadow-card">
              <p className="text-xl font-bold tracking-tight group-hover:text-accent">{b.name}</p>
              <p className="mt-1 text-xs text-muted">
                {b.country} · از {fa(b.since)}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{b.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 08 — پروژه‌ها */}
      <section className="border-y border-line bg-surface py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="پروژه‌ها"
            title="پروژه‌های اجراشده"
            lead="مشخصات سایت، دستگاه انتخاب‌شده و نتیجه — به‌جای شعار."
            action={
              <Link href="/company/projects" className="btn-ghost">
                همه پروژه‌ها
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {projects.slice(0, 3).map((p) => (
              <article key={p.slug} className="card p-6">
                <p className="eyebrow">{p.location}</p>
                <h3 className="mt-2 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted">{p.area}</p>
                <p className="mt-3 text-sm leading-7 text-muted">{p.result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 09 — خدمات */}
      <section className="shell py-16">
        <SectionHeading
          eyebrow="خدمات"
          title="نصب، سرویس، تعمیر، قطعات، آموزش، اجاره"
          lead="برای تجهیزات صنعتی، خدمات پس از فروش بخشی از فروش است، نه یک صفحه فرعی."
          action={
            <Link href="/services" className="btn-ghost">
              همه خدمات
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="card group p-5 hover:shadow-card">
              <p className="text-xs text-muted">{s.latin}</p>
              <p className="mt-1 font-semibold group-hover:text-accent">{s.name}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 10 — دانش */}
      <section className="border-y border-line bg-surface py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="راهنما"
            title="پیش از خرید، این‌ها را بخوانید"
            action={
              <Link href="/knowledge" className="btn-ghost">
                همه مقالات
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {articles.slice(0, 3).map((a) => (
              <Link key={a.slug} href={`/knowledge/${a.slug}`} className="card group p-6 hover:shadow-card">
                <p className="eyebrow">{articleKindLabels[a.kind]}</p>
                <h3 className="mt-2 font-semibold leading-7 group-hover:text-accent">{a.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{a.excerpt}</p>
                <p className="mt-4 text-xs text-muted">{fa(a.readingTime)} دقیقه مطالعه</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — CTA */}
      <section className="shell py-16">
        <div className="card flex flex-wrap items-center justify-between gap-6 bg-ink p-8 text-white sm:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">برای پروژه خودتان دستگاه مناسب پیدا کنید</h2>
            <p className="mt-3 leading-8 text-white/70">
              متراژ، نوع کف و آلودگی را بگویید؛ فهرست کوتاه دستگاه‌های مناسب به‌همراه برآورد زمان نظافت
              را دریافت کنید.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/advisor" className="btn bg-white px-6 py-3 text-ink hover:bg-white/90">
              شروع مشاور انتخاب
            </Link>
            <Link href="/quote" className="btn border border-white/25 px-6 py-3 text-white hover:bg-white/10">
              درخواست پیش‌فاکتور
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
