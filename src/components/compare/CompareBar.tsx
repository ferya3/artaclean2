"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { COMPARE_MAX, useCompare } from "@/store/compare";
import { compareAction } from "@/lib/actions/catalog";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** نوار شناور مقایسه — تا وقتی چیزی انتخاب نشده، اصلاً وجود ندارد. */
export default function CompareBar() {
  const { items, remove, clear, ready } = useCompare();
  const pathname = usePathname();

  // فهرست در localStorage است و کاتالوگ در دیتابیس؛ نام و مدل هر انتخاب را
  // از سرور می‌گیریم تا کل کاتالوگ در باندل کلاینت نباشد.
  const [labels, setLabels] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) {
      setLabels({});
      return;
    }
    let active = true;
    compareAction(items)
      .then(({ products }) => {
        if (!active) return;
        setLabels(Object.fromEntries(products.map((p) => [p.slug, p.model || p.name])));
      })
      .catch(() => {
        // شکست شبکه نباید نوار را بیندازد؛ شناسه به‌جای مدل نشان داده می‌شود.
      });
    return () => {
      active = false;
    };
  }, [items]);

  if (!ready || items.length === 0 || pathname === "/compare") return null;

  return (
    <div className="section-deep sticky bottom-0 z-30 border-t border-white/10">
      <div className="shell relative flex flex-wrap items-center gap-3 py-3.5">
        <span className="text-xs text-white/45">
          مقایسه ({fa(items.length)} از {fa(COMPARE_MAX)})
        </span>

        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((slug) => {
            const label = labels[slug] ?? slug;
            return (
              <span
                key={slug}
                className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-xs text-white/80"
              >
                <span className="num font-semibold">{label}</span>
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  className="text-white/40 transition-colors hover:text-white"
                  aria-label={`حذف ${label} از مقایسه`}
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
        <Link href="/compare" className={buttonVariants({ variant: "accent", size: "sm" })}>
          مقایسه کن ←
        </Link>
      </div>
    </div>
  );
}
