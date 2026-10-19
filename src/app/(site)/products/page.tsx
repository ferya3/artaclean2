import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import ProductVisual from "@/components/ui/ProductVisual";
import { getCategories, getPage, getProducts } from "@/lib/content";
import { navSettings } from "@/lib/site";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";

export function generateMetadata(): Metadata {
  const page = getPage("products");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function ProductsPage() {
  const page = getPage("products");
  const categories = getCategories();
  const groups = navSettings().categoryGroups;
  const products = getProducts();

  // یک بار شمردن، به‌جای یک پرس‌وجو به ازای هر دسته.
  const counts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  const ordered = [
    ...groups.map((g) => ({ title: g.title, list: categories.filter((c) => c.group === g.key) })),
    {
      title: "سایر",
      list: categories.filter((c) => !groups.some((g) => g.key === c.group)),
    },
  ].filter((section) => section.list.length > 0);

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
        <div className="flex flex-wrap gap-3">
          <Link href="/advisor" className={buttonVariants({ variant: "accent" })}>
            پیدا کردن دستگاه مناسب
          </Link>
          <Link href="/solutions" className={buttonVariants({ variant: "outline" })}>
            انتخاب بر اساس صنعت
          </Link>
        </div>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "محصولات" }]} />
      </div>

      <div className="shell space-y-14 pb-16">
        {ordered.map((section) => (
          <section key={section.title}>
            <h2 className="mb-6 border-b border-line pb-3 text-lg font-bold">{section.title}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {section.list.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${c.slug}`}
                  className="card card-hover group block overflow-hidden"
                >
                  <ProductVisual
                    kind={c.slug}
                    ratio="aspect-[16/9]"
                    label={c.name}
                    className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                  />
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-semibold group-hover:text-accent">{c.name}</h3>
                      <span className="shrink-0 text-xs text-muted">
                        {fa(counts[c.slug] ?? 0)} مدل
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">{c.latin}</p>
                    <p className="mt-3 text-sm leading-7 text-muted">{c.blurb}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
