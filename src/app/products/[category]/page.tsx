import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import CategoryBrowser from "@/components/catalog/CategoryBrowser";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getArticle } from "@/lib/data/knowledge";
import { productsByCategory } from "@/lib/data/products";
import { categories, getCategory } from "@/lib/data/taxonomy";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.blurb,
    alternates: { canonical: `/products/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const items = productsByCategory(cat.slug);
  const guide = cat.buyingGuide ? getArticle(cat.buyingGuide) : undefined;

  return (
    <>
      <PageHeader eyebrow={cat.latin} title={cat.name} lead={cat.blurb}>
        <div className="flex flex-wrap gap-3">
          {guide && (
            <Link href={`/knowledge/${guide.slug}`} className={buttonVariants({ variant: "outline" })}>
              راهنمای خرید {cat.name}
            </Link>
          )}
          <Link href="/advisor" className={buttonVariants({ variant: "accent" })}>
            پیشنهاد بر اساس شرایط سایت من
          </Link>
        </div>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs
          trail={[
            { label: "خانه", href: "/" },
            { label: "محصولات", href: "/products" },
            { label: cat.name },
          ]}
        />
      </div>

      <div className="shell pb-16">
        <Suspense fallback={<div className="py-20 text-center text-sm text-muted">در حال بارگذاری…</div>}>
          <CategoryBrowser category={cat} items={items} />
        </Suspense>
      </div>
    </>
  );
}
