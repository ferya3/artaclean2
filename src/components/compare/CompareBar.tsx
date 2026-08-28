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
    <div className="section-deep sticky bottom-0 z-30 border-t border-white/10">
      <div className="shell relative flex flex-wrap items-center gap-3 py-3.5">
        <span className="text-xs text-white/45">
          مقایسه ({fa(items.length)} از {fa(COMPARE_MAX)})
        </span>

        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((slug) => {
            const product = getProduct(slug);
            if (!product) return null;
            return (
              <span
                key={slug}
                className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80"
              >
                <span className="num font-semibold">{product.model}</span>
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  className="text-white/40 transition-colors hover:text-white"
                  aria-label={`حذف ${product.model} از مقایسه`}
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>

        <button
          type="button"
          onClick={clear}
          className="text-xs text-white/40 transition-colors hover:text-white"
        >
          پاک کردن
        </button>
        <Link href="/compare" className="btn-accent btn-sm">
          مقایسه کن ←
        </Link>
      </div>
    </div>
  );
}
