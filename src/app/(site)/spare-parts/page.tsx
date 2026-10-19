import type { Metadata } from "next";
import { Suspense } from "react";

import PartsFinder from "@/components/parts/PartsFinder";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getPage, getParts, getProducts } from "@/lib/content";

export function generateMetadata(): Metadata {
  const page = getPage("spare-parts");
  return { title: page.metaTitle, description: page.metaDescription };
}

type Search = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SparePartsPage({ searchParams }: Search) {
  const sp = await searchParams;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const page = getPage("spare-parts");
  const products = getProducts().map((p) => ({ slug: p.slug, model: p.model, name: p.name }));

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "قطعات یدکی" }]} />
      </div>

      <div className="shell pb-16">
        <Suspense fallback={<div className="py-20 text-center text-sm text-muted">در حال بارگذاری…</div>}>
          <PartsFinder initialQuery={q ?? ""} parts={getParts()} products={products} />
        </Suspense>
      </div>
    </>
  );
}
