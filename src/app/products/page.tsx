import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader, ProductImage } from "@/components/ui/Primitives";
import { productsByCategory } from "@/lib/data/products";
import { categories, categoryGroups } from "@/lib/data/taxonomy";
import { fa } from "@/lib/format";

export const metadata: Metadata = {
  title: "تجهیزات نظافت صنعتی",
  description:
    "اسکرابر، سویپر، مکنده صنعتی، واترجت، بخارشوی، موکت‌شوی، ربات نظافت و مواد شوینده — دسته‌بندی کامل تجهیزات نظافت صنعتی.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="محصولات"
        title="تجهیزات نظافت صنعتی"
        lead="دسته‌بندی بر اساس نوع کار: نظافت کف، فشار بالا، تخصصی و مصرفی. اگر نمی‌دانید کدام دسته به کار شما می‌آید، از مشاور انتخاب دستگاه شروع کنید."
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/advisor" className="btn-accent">
            پیدا کردن دستگاه مناسب
          </Link>
          <Link href="/solutions" className="btn-ghost">
            انتخاب بر اساس صنعت
          </Link>
        </div>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "محصولات" }]} />
      </div>

      <div className="shell space-y-14 pb-16">
        {categoryGroups.map((group) => {
          const list = categories.filter((c) => c.group === group.key);
          if (!list.length) return null;
          return (
            <section key={group.key}>
              <h2 className="mb-6 border-b border-line pb-3 text-lg font-bold">{group.title}</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((c) => {
                  const count = productsByCategory(c.slug).length;
                  return (
                    <Link key={c.slug} href={`/products/${c.slug}`} className="card group overflow-hidden hover:shadow-card">
                      <ProductImage label={c.latin} ratio="aspect-[16/9]" />
                      <div className="p-5">
                        <div className="flex items-baseline justify-between gap-3">
                          <h3 className="font-semibold group-hover:text-accent">{c.name}</h3>
                          <span className="shrink-0 text-xs text-muted">{fa(count)} مدل</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">{c.latin}</p>
                        <p className="mt-3 text-sm leading-7 text-muted">{c.blurb}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
