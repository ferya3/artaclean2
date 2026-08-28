"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { COMPARE_MAX, useCompare } from "@/components/compare/CompareProvider";
import { getProduct } from "@/lib/data/products";
import { fa } from "@/lib/format";

/** نوار شناور مقایسه — تا وقتی چیزی انتخاب نشده، اصلاً وجود ندارد. */
export default function CompareBar() {
  const { items, remove, clear, ready } = useCompare();
  const pathname = usePathname();

  if (!ready || items.length === 0 || pathname === "/compare") return null;

  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur">
      <div className="shell flex flex-wrap items-center gap-3 py-3">
        <span className="text-sm text-muted">
          مقایسه ({fa(items.length)} از {fa(COMPARE_MAX)})
        </span>

        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((slug) => {
            const product = getProduct(slug);
            if (!product) return null;
            return (
              <span key={slug} className="chip bg-canvas">
                {product.model}
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  className="text-muted hover:text-ink"
                  aria-label={`حذف ${product.model} از مقایسه`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        <button type="button" onClick={clear} className="btn-quiet text-xs">
          پاک کردن
        </button>
        <Link href="/compare" className="btn-accent text-sm">
          مقایسه کن
        </Link>
      </div>
    </div>
  );
}
