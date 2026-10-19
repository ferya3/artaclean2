import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getBrands, getPage, getProducts } from "@/lib/content";
import { fa } from "@/lib/format";

export function generateMetadata(): Metadata {
  const page = getPage("brands");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function BrandsPage() {
  const page = getPage("brands");
  const brands = getBrands();
  const counts = getProducts().reduce<Record<string, number>>((acc, p) => {
    acc[p.brand] = (acc[p.brand] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "برندها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const count = counts[b.slug] ?? 0;
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
