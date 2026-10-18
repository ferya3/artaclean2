"use client";

import Link from "next/link";

import { useCompare } from "@/store/compare";
import { Badge } from "@/components/ui/card";
import { SpecBar } from "@/components/ui/Primitives";
import ProductVisual from "@/components/ui/ProductVisual";
import { industries } from "@/lib/data/industries";
import { specValue, toman } from "@/lib/format";
import { specRatio, visualScale } from "@/lib/scale";
import type { Product } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * کارت محصول صنعتی.
 * عکس + نام + قیمت کافی نیست: خریدار صنعتی بر اساس راندمان، عرض کار و ظرفیت
 * تصمیم می‌گیرد — پس همان‌ها روی کارت می‌آیند، هرکدام با نوار نسبت تا عدد در
 * مقیاس کاتالوگ معنا پیدا کند.
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
    <article className="card card-hover group flex flex-col overflow-hidden">
      {/* خط لهجه بالای کارت — فقط هنگام hover */}
      <span
        className="absolute inset-x-0 top-0 z-10 h-0.5 origin-[inline-start] scale-x-0 bg-gradient-to-l from-accent to-accent-2 transition-transform duration-500 ease-out group-hover:scale-x-100"
        aria-hidden
      />

      <Link href={href} className="relative block overflow-hidden">
        <ProductVisual
          kind={product.category}
          variant={product.facets.machineType}
          label={product.model}
          scale={visualScale(product.facets.areaMax)}
          brush={product.facets.brushType}
          src={product.image}
          ratio="aspect-[5/4]"
          className="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />

        {/* محو شدن به سمت بدنه کارت */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />

        <span className="absolute start-3 top-3 flex flex-wrap gap-1.5">
          {product.badges?.map((b) => (
            <Badge key={b} variant="accent">
              {b}
            </Badge>
          ))}
        </span>

        {/* عمداً num روی span بیرونی نیست: .num مقدار direction را ltr می‌کند و
            آن‌وقت end-3 به‌جای چپ، سمت راست محاسبه می‌شود و با برچسب‌ها تداخل می‌کند. */}
        <span className="absolute end-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
          <span className="num">{product.model}</span>
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {product.subcategory && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
            {product.subcategory}
          </p>
        )}

        <h3 className="text-[17px] font-bold leading-7">
          <Link href={href} className="transition-colors hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-muted">{product.tagline}</p>

        {!compact && (
          <dl className="mt-5 space-y-3">
            {product.kpis.slice(0, 3).map((spec) => {
              const ratio = specRatio(spec.key, spec.value);
              return (
                <div key={spec.key}>
                  <div className="flex items-baseline justify-between gap-3 text-[13px]">
                    <dt className="text-muted">{spec.label}</dt>
                    <dd className={`font-bold ${spec.text ? "" : "num"}`}>{specValue(spec)}</dd>
                  </div>
                  {ratio !== null && <SpecBar ratio={ratio} />}
                </div>
              );
            })}
          </dl>
        )}

        {industryNames.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {industryNames.map((name) => (
              <span key={name} className="rounded-md bg-ink/[0.04] px-2 py-1 text-[11px] text-muted">
                {name}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-baseline justify-between">
            {product.priceMode === "listed" && product.price ? (
              <span className="text-base font-extrabold">{toman(product.price)}</span>
            ) : (
              <span className="text-xs text-muted">قیمت با استعلام کارشناس</span>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={href} className={cn(buttonVariants({ variant: "primary", size: "sm" }), "flex-1")}>
              مشاهده دستگاه
            </Link>
            <button
              type="button"
              onClick={() => toggle(product.slug)}
              disabled={!inCompare && full}
              aria-pressed={inCompare}
              aria-label={inCompare ? "حذف از مقایسه" : "افزودن به مقایسه"}
              title={!inCompare && full ? "حداکثر ۴ دستگاه قابل مقایسه است" : "مقایسه"}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-9",
                inCompare && "border-accent bg-accent-soft text-accent",
              )}
            >
              {inCompare ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 5v14M15 5v14M4 9h10M10 15h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
