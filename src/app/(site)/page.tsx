import Link from "next/link";

import QuickAdvisor from "@/components/advisor/QuickAdvisor";
import ProcessScroll from "@/components/home/ProcessScroll";
import ProductCard from "@/components/product/ProductCard";
import HeroStage from "@/components/three/HeroStage";
import ProductVisual from "@/components/ui/ProductVisual";
import Reveal from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/Primitives";
import {
  getArticles,
  getBrands,
  getCategories,
  getIndustries,
  getProducts,
  getProjects,
  getServices,
  toCardData,
} from "@/lib/content";
import { articleKindLabels } from "@/lib/data/knowledge";
import { homeSettings } from "@/lib/site";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
  // همه متن‌های این صفحه و فهرست «منتخب» از تنظیمات می‌آید؛ ساختار و چیدمان
  // در کد می‌ماند. مرز عمدی است: واحد فروش باید متن و انتخاب را عوض کند،
  // نه گرید و انیمیشن را.
  const home = homeSettings();
  const all = getProducts();
  const brands = getBrands();
  const categories = getCategories();
  const industries = getIndustries();
  const services = getServices();
  const projects = getProjects();
  const articles = getArticles();

  const featured = home.featured
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map(toCardData);

  return (
    <>
      {/* ══════════════════════════════════════════════════ 01 — HERO */}
      <section className="section-deep grain pb-28 pt-10 sm:pt-16">
        <div
          className="glow -top-20 start-[8%] h-[26rem] w-[26rem] opacity-30"
          style={{ background: "rgb(var(--c-accent))" }}
        />
        <div
          className="glow bottom-0 end-[10%] h-80 w-80 opacity-20"
          style={{ background: "rgb(var(--c-steel))" }}
        />
        <div className="absolute inset-0 blueprint opacity-80" aria-hidden />

        <div className="shell relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow-accent flex items-center gap-3">
                <span className="h-px w-10 bg-accent" aria-hidden />
                {home.heroEyebrow}
              </p>
            </Reveal>

            <Reveal delay={80}>
              {/* هر سطر عمداً whitespace-nowrap است: شکستن خودکار خط در فارسی،
                  عبارت گرادیانی را دو تکه می‌کرد و ریتم تیتر را از بین می‌برد. */}
              <h1 className="mt-6 text-[clamp(1.9rem,4.6vw,3.5rem)] font-black leading-[1.16] tracking-tight text-white">
                <span className="block whitespace-nowrap">{home.heroTitleTop}</span>
                <span className="gradient-text block whitespace-nowrap">{home.heroTitleAccent}</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-9 text-white/60">{home.heroLead}</p>
            </Reveal>

            <Reveal delay={240}>
              {/* روی موبایل تمام‌عرض و روی هم؛ wrap ساده باعث می‌شد دکمه دوم
                  با عرض متفاوت، پله‌ای و نامرتب بنشیند. */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={home.heroPrimaryHref}
                  className={cn(buttonVariants({ variant: "accent" }), "w-full px-6 py-3.5 text-[15px] sm:w-auto")}
                >
                  {home.heroPrimaryLabel}
                </Link>
                <Link
                  href={home.heroSecondaryHref}
                  className={cn(buttonVariants({ variant: "glass" }), "w-full px-6 py-3.5 text-[15px] sm:w-auto")}
                >
                  {home.heroSecondaryLabel}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-8">
                {home.stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-3xl font-black text-white">{stat.value}</dt>
                    <dd className="mt-1.5 text-xs leading-5 text-white/45">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* دستگاه شاخص + پلاک‌های مشخصات شناور */}
          <Reveal delay={200} className="lg:col-span-6">
            <div className="relative">
              <div
                className="glow inset-x-10 top-10 h-64 opacity-25"
                style={{ background: "rgb(var(--c-accent))" }}
              />
              <HeroStage />

              {/* هر دو پلاک سمت start می‌نشینند: بدنه دستگاه به سمت end متمایل
                  است و پلاک شناور نباید روی خطوط طرح بیفتد. */}
              <div className="absolute -start-2 top-8 rounded-xl border border-white/10 bg-deep/85 px-4 py-2.5 backdrop-blur sm:start-4">
                <p className="num text-xl font-black text-white">{home.badgeOneValue}</p>
                <p className="text-[10px] text-white/45">{home.badgeOneLabel}</p>
              </div>

              <div className="absolute -start-2 top-32 rounded-xl border border-white/10 bg-deep/85 px-4 py-2.5 backdrop-blur sm:start-4">
                <p className="num text-xl font-black text-white">{home.badgeTwoValue}</p>
                <p className="text-[10px] text-white/45">{home.badgeTwoLabel}</p>
              </div>

              <div className="absolute bottom-2 start-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-deep/85 px-4 py-1.5 text-[11px] text-white/60 backdrop-blur">
                {home.heroCaption}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════ 02 — PRODUCT ADVISOR (روی لبه Hero) */}
      <div className="shell relative z-10 -mt-20">
        <Reveal>
          <QuickAdvisor />
        </Reveal>
      </div>

      {/* ══════════════════════════════════════════════════ برندها — نوار */}
      <section className="border-b border-line py-10">
        <div className="shell flex flex-wrap items-center justify-center gap-x-14 gap-y-5 opacity-60">
          <span className="text-xs text-muted">{home.brandsLabel}</span>
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/brands/${b.slug}`}
              className="text-xl font-black tracking-tight text-ink/45 transition-colors hover:text-ink"
            >
              {b.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════ 03 — دسته‌بندی محصولات */}
      <section className="shell py-20">
        <Reveal>
          <SectionHeading
            eyebrow={home.categoriesEyebrow}
            title={home.categoriesTitle}
            lead={home.categoriesLead}
            action={
              <Link href="/products" className={buttonVariants({ variant: "outline", size: "sm" })}>
                همه دسته‌ها ←
              </Link>
            }
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <Link href={`/products/${c.slug}`} className="card card-hover group block h-full overflow-hidden">
                <ProductVisual
                  kind={c.slug}
                  ratio="aspect-[16/11]"
                  label={c.name}
                  className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                />
                <div className="p-5">
                  <p className="font-bold transition-colors group-hover:text-accent">{c.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">{c.latin}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════ 04 — محصولات منتخب */}
      <section className="border-y border-line bg-surface py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow={home.featuredEyebrow}
              title={home.featuredTitle}
              lead={home.featuredLead}
              action={
                <Link href="/products" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  همه محصولات ←
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════ 05 — راهکار بر اساس صنعت */}
      <section className="section-deep grain py-20">
        <div
          className="glow -top-16 end-[15%] h-80 w-80 opacity-20"
          style={{ background: "rgb(var(--c-accent))" }}
        />
        <div className="shell relative">
          <Reveal>
            <SectionHeading
              tone="deep"
              eyebrow={home.solutionsEyebrow}
              title={home.solutionsTitle}
              lead={home.solutionsLead}
              action={
                <Link href="/solutions" className={buttonVariants({ variant: "glass", size: "sm" })}>
                  همه راهکارها ←
                </Link>
              }
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.slice(0, 6).map((industry, i) => (
              <Reveal key={industry.slug} delay={i * 60}>
                <Link
                  href={`/solutions/${industry.slug}`}
                  className="card-deep group flex h-full flex-col p-7 transition-all duration-500 hover:border-white/20 hover:shadow-lift"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-accent">{industry.latin}</p>
                  <p className="mt-3 text-xl font-bold text-white">{industry.name}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/50">{industry.blurb}</p>
                  {/* پاورقی به کف کارت سنجاق می‌شود تا خط جداکننده در کل ردیف هم‌تراز بماند */}
                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/40">
                    <span>
                      {fa(industry.problems.length)} مسئله رایج · {fa(industry.recommendedCategories.length)} دسته
                    </span>
                    <span className="text-accent transition-transform duration-300 group-hover:-translate-x-1">←</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ ۰۶ — مسیر کار (اسکرول افقی pin‌شده) */}
      <ProcessScroll />

      {/* ══════════════════════════════════════════════ 07 — چرا ما */}
      <section className="shell py-20">
        <Reveal>
          <SectionHeading
            eyebrow={home.trustEyebrow}
            title={home.trustTitle}
          />
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {home.trust.map((item, i) => (
            <div key={item.title} className="group bg-surface p-7 transition-colors hover:bg-canvas">
              <span className="num block text-xs font-bold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 font-bold leading-6">{item.title}</p>
              <p className="mt-2.5 text-sm leading-7 text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ 07 — پروژه‌ها */}
      <section className="border-y border-line bg-surface py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow={home.projectsEyebrow}
              title={home.projectsTitle}
              lead={home.projectsLead}
              action={
                <Link href="/company/projects" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  همه پروژه‌ها ←
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <article className="card card-hover h-full p-7">
                  <div className="flex items-center justify-between gap-3">
                    <p className="eyebrow">{p.location}</p>
                    <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent">
                      {p.area}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold leading-7">{p.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{p.result}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ 08 — خدمات */}
      <section className="shell py-20">
        <Reveal>
          <SectionHeading
            eyebrow={home.servicesEyebrow}
            title={home.servicesTitle}
            lead={home.servicesLead}
            action={
              <Link href="/services" className={buttonVariants({ variant: "outline", size: "sm" })}>
                همه خدمات ←
              </Link>
            }
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 50}>
              <Link href={`/services/${s.slug}`} className="card card-hover group block h-full p-6">
                <p className="text-[11px] uppercase tracking-wider text-muted">{s.latin}</p>
                <p className="mt-1.5 font-bold transition-colors group-hover:text-accent">{s.name}</p>
                <p className="mt-2.5 text-sm leading-7 text-muted">{s.blurb}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════ 09 — دانش */}
      <section className="border-t border-line bg-surface py-20">
        <div className="shell">
          <Reveal>
            <SectionHeading
              eyebrow={home.knowledgeEyebrow}
              title={home.knowledgeTitle}
              action={
                <Link href="/knowledge" className={buttonVariants({ variant: "outline", size: "sm" })}>
                  همه مقالات ←
                </Link>
              }
            />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {articles.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 70}>
                <Link href={`/knowledge/${a.slug}`} className="card card-hover group block h-full p-7">
                  <p className="eyebrow-accent">{articleKindLabels[a.kind]}</p>
                  <h3 className="mt-3 text-lg font-bold leading-8 transition-colors group-hover:text-accent">
                    {a.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{a.excerpt}</p>
                  <p className="mt-6 text-xs text-muted">{fa(a.readingTime)} دقیقه مطالعه</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════ 10 — CTA پایانی */}
      <section className="section-deep grain py-24">
        <div
          className="glow bottom-[-6rem] start-1/2 h-96 w-[36rem] -translate-x-1/2 opacity-25"
          style={{ background: "rgb(var(--c-accent))" }}
        />
        <div className="shell relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-section font-black text-white text-balance">
              {home.ctaTitle}
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-9 text-white/55">{home.ctaLead}</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={home.ctaPrimaryHref}
                className={cn(buttonVariants({ variant: "accent" }), "w-full px-7 py-3.5 text-[15px] sm:w-auto")}
              >
                {home.ctaPrimaryLabel}
              </Link>
              <Link
                href={home.ctaSecondaryHref}
                className={cn(buttonVariants({ variant: "glass" }), "w-full px-7 py-3.5 text-[15px] sm:w-auto")}
              >
                {home.ctaSecondaryLabel}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
