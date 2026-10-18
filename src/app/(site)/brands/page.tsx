import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { brands } from "@/lib/data/brands";
import { catalogByBrand } from "@/lib/catalog";
import { fa } from "@/lib/format";

export const metadata: Metadata = {
  title: "برندها",
  description: "برندهای تجهیزات نظافت صنعتی موجود در کاتالوگ، به‌همراه محصولات و قطعات هر برند.",
};

export default function BrandsPage() {
  return (
    <>
      <PageHeader
        eyebrow="برندها"
        title="برندهای موجود در کاتالوگ"
        lead="برای هر برند، تأمین قطعه و خدمات پس از فروش هم تعریف شده است — برند بدون پشتیبانی قطعه، ریسک خرید است."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "برندها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const count = catalogByBrand(b.slug).length;
          return (
            <Link key={b.slug} href={`/brands/${b.slug}`} className="card card-hover group p-6">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-2xl font-bold tracking-tight group-hover:text-accent">{b.name}</p>
                <span className="text-xs text-muted">{fa(count)} مدل</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {b.country} · از {fa(b.since)}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted">{b.blurb}</p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
