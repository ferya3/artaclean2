import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductCard from "@/components/product/ProductCard";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { brands, getBrand } from "@/lib/data/brands";
import { spareParts } from "@/lib/data/parts";
import { productsByBrand } from "@/lib/data/products";
import { fa } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return {};
  return {
    title: `محصولات ${brand.name}`,
    description: brand.blurb,
    alternates: { canonical: `/brands/${brand.slug}` },
  };
}

export default async function BrandPage({ params }: Params) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const items = productsByBrand(brand.slug);
  const models = new Set(items.map((i) => i.slug));
  const parts = spareParts.filter((p) => p.fitsModels.some((m) => models.has(m)));

  return (
    <>
      <PageHeader
        eyebrow={`${brand.country} · از ${fa(brand.since)}`}
        title={brand.name}
        lead={brand.blurb}
      >
        <div className="flex flex-wrap gap-3">
          <Link href="/quote" className="btn-accent">
            استعلام قیمت محصولات {brand.name}
          </Link>
          <Link href="/spare-parts" className="btn-ghost">
            قطعات یدکی
          </Link>
        </div>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs
          trail={[
            { label: "خانه", href: "/" },
            { label: "برندها", href: "/brands" },
            { label: brand.name },
          ]}
        />
      </div>

      <section className="shell pb-16">
        <h2 className="mb-6 text-xl font-bold">
          محصولات
          <span className="ms-2 text-sm font-normal text-muted">({fa(items.length)} مدل)</span>
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {parts.length > 0 && (
          <>
            <h2 className="mb-6 mt-14 text-xl font-bold">قطعات یدکی موجود</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {parts.slice(0, 9).map((part) => (
                <li key={part.partNo} className="card p-4">
                  <p className="text-sm font-medium">{part.title}</p>
                  <p className="num mt-1 text-xs text-muted">{part.partNo}</p>
                </li>
              ))}
            </ul>
            <Link href="/spare-parts" className="btn-ghost mt-6">
              جستجوی کامل قطعات
            </Link>
          </>
        )}
      </section>
    </>
  );
}
