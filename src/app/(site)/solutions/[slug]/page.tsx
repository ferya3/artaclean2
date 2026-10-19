import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/product/ProductCard";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import {
  getCategories,
  getIndustries,
  getIndustry,
  getProjects,
  productsByIndustry,
  toCardData,
} from "@/lib/content";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { chipVariants } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getIndustries().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return {
    title: `راهکار نظافت ${industry.name}`,
    description: industry.blurb,
    alternates: { canonical: `/solutions/${industry.slug}` },
  };
}

export default async function SolutionPage({ params }: Params) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const recommended = productsByIndustry(industry.slug).map(toCardData);
  const cases = getProjects().filter((p) => p.industry === industry.slug);
  const categories = getCategories();
  const cats = industry.recommendedCategories
    .map((c) => categories.find((cat) => cat.slug === c))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <>
      <PageHeader eyebrow={industry.latin} title={`راهکار نظافت ${industry.name}`} lead={industry.blurb}>
        <div className="flex flex-wrap gap-3">
          <Link href="/advisor" className={buttonVariants({ variant: "accent" })}>
            پیشنهاد دستگاه برای سایت من
          </Link>
          <Link href="/quote" className={buttonVariants({ variant: "outline" })}>
            درخواست بازدید و مشاوره
          </Link>
        </div>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs
          trail={[
            { label: "خانه", href: "/" },
            { label: "راهکارها", href: "/solutions" },
            { label: industry.name },
          ]}
        />
      </div>

      <section className="shell pb-4">
        <dl className="grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-3">
          {industry.metrics.map((m) => (
            <div key={m.label} className="bg-surface px-6 py-6 text-center">
              <dt className="text-xl font-bold">{m.value}</dt>
              <dd className="mt-1 text-xs text-muted">{m.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* مسئله شما چیست؟ → مسیر Problem → Solution → Product */}
      <section className="shell py-14">
        <h2 className="mb-2 text-2xl font-bold tracking-tight">مسئله شما چیست؟</h2>
        <p className="mb-8 max-w-2xl text-muted">
          هر مسئله، راهکار و دسته تجهیزات خودش را دارد. از اینجا شروع کنید، نه از فهرست محصولات.
        </p>

        <div className="grid gap-5 lg:grid-cols-2">
          {industry.problems.map((problem) => (
            <article key={problem.key} className="card p-6">
              <h3 className="font-semibold">{problem.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{problem.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {problem.dirt.map((d) => (
                  <Link key={d} href={`/advisor?dirt=${d}`} className={cn(chipVariants({ interactive: true }), "hover:border-ink/30")}>
                    دیدن دستگاه‌های مناسب این آلودگی
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* تجهیزات پیشنهادی */}
      <section className="border-y border-line bg-surface py-14">
        <div className="shell">
          <h2 className="mb-8 text-2xl font-bold tracking-tight">دسته تجهیزات پیشنهادی</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cats.map((c) => (
              <Link key={c.slug} href={`/products/${c.slug}`} className="card card-hover group p-5">
                <p className="text-xs text-muted">{c.latin}</p>
                <p className="mt-1 font-semibold group-hover:text-accent">{c.name}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{c.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {recommended.length > 0 && (
        <section className="shell py-14">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">دستگاه‌های مناسب {industry.name}</h2>
          <p className="mb-8 text-sm text-muted">{fa(recommended.length)} مدل</p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recommended.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {cases.length > 0 && (
        <section className="border-t border-line bg-surface py-14">
          <div className="shell">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">پروژه‌های اجراشده در این صنعت</h2>
            <div className="grid gap-4 lg:grid-cols-3">
              {cases.map((c) => (
                <article key={c.slug} className="card p-6">
                  <p className="eyebrow">{c.location}</p>
                  <h3 className="mt-2 font-semibold">{c.title}</h3>
                  <p className="num mt-1 text-sm text-muted">{c.area}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{c.result}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="shell py-14">
        <div className="card flex flex-wrap items-center justify-between gap-6 bg-ink p-8 text-white">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold sm:text-2xl">بازدید رایگان از سایت شما</h2>
            <p className="mt-2 leading-8 text-white/70">
              کارشناس در محل، نوع کف، آلودگی و مسیرهای تردد را بررسی می‌کند و پیشنهاد فنی با برآورد
              زمان نظافت ارائه می‌دهد.
            </p>
          </div>
          <Link href="/quote" className={cn(buttonVariants(), "bg-white px-6 py-3 text-ink hover:bg-white/90")}>
            درخواست بازدید
          </Link>
        </div>
      </section>
    </>
  );
}
