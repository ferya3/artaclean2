"use client";

import Link from "next/link";

import { useCompare } from "@/components/compare/CompareProvider";
import { Badge, ProductImage } from "@/components/ui/Primitives";
import { industries } from "@/lib/data/industries";
import { specValue, toman } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * کارت محصول صنعتی: عکس + نام + قیمت کافی نیست.
 * خریدار صنعتی بر اساس راندمان، عرض کار، ظرفیت مخزن و «مناسب برای چه محیطی»
 * تصمیم می‌گیرد — پس همان‌ها روی کارت می‌آیند.
 */
export default function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { has, toggle, full } = useCompare();
  const inCompare = has(product.slug);
  const href = `/products/${product.category}/${product.slug}`;

  const industryNames = product.applications
    .slice(0, 3)
    .map((a) => industries.find((i) => i.slug === a.industry)?.name)
    .filter(Boolean);

  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-card">
      <Link href={href} className="block overflow-hidden">
        <ProductImage
          label={product.model}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.badges?.map((b) => (
            <Badge key={b} tone="accent">
              {b}
            </Badge>
          ))}
          {product.subcategory && <Badge>{product.subcategory}</Badge>}
        </div>

        <h3 className="mt-2 text-base font-semibold leading-6">
          <Link href={href} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted">{product.tagline}</p>

        {!compact && (
          <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
            {product.kpis.slice(0, 4).map((spec) => (
              <div key={spec.key} className="flex items-baseline justify-between py-1.5">
                <dt className="text-muted">{spec.label}</dt>
                <dd className={spec.text ? "font-medium" : "num font-medium"}>{specValue(spec)}</dd>
              </div>
            ))}
          </dl>
        )}

        {industryNames.length > 0 && (
          <p className="mt-3 text-xs text-muted">
            <span className="text-ink/70">مناسب برای: </span>
            {industryNames.join(" • ")}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 pt-1">
          {product.priceMode === "listed" && product.price ? (
            <span className="text-sm font-semibold">{toman(product.price)}</span>
          ) : (
            <span className="text-xs text-muted">قیمت با استعلام</span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <Link href={href} className="btn-primary flex-1">
            مشاهده
          </Link>
          <button
            type="button"
            onClick={() => toggle(product.slug)}
            disabled={!inCompare && full}
            className={`btn ${
              inCompare ? "bg-accent-soft text-accent" : "border border-line bg-surface text-muted hover:text-ink"
            }`}
            aria-pressed={inCompare}
            title={!inCompare && full ? "حداکثر ۴ دستگاه قابل مقایسه است" : "افزودن به مقایسه"}
          >
            {inCompare ? "در مقایسه ✓" : "مقایسه"}
          </button>
        </div>
      </div>
    </article>
  );
}
