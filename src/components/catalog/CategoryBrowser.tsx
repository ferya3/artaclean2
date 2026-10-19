"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import ProductCard from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/Primitives";
import {
  brushTypeLabels,
  machineTypeLabels,
  powerSourceLabels,
  areaLabels,
  workingWidthBands,
} from "@/lib/data/taxonomy";
import {
  applyFilters,
  countActive,
  facetCount,
  parseFilters,
  serializeFilters,
  toggleFilter,
  type FilterState,
} from "@/lib/filters";
import { fa } from "@/lib/format";
import type { Brand, Category, FilterKey, Product } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortKey = "relevance" | "coverage" | "width" | "area";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "relevance", label: "پیش‌فرض" },
  { key: "coverage", label: "بیشترین راندمان" },
  { key: "width", label: "بیشترین عرض کار" },
  { key: "area", label: "بزرگ‌ترین بازه متراژ" },
];

type FilterMeta = Record<FilterKey, { title: string; options: { value: string; label: string }[] }>;

/**
 * گزینه‌های هر فیلتر.
 * همه از ثابت‌های کد می‌آیند جز برند، که محتوای قابل ویرایش است و از سرور
 * می‌رسد — به همین دلیل این جدول تابع است، نه const ماژول.
 */
const filterMeta = (brands: Pick<Brand, "slug" | "name">[]): FilterMeta => ({
  machineType: {
    title: "نوع دستگاه",
    options: Object.entries(machineTypeLabels).map(([value, label]) => ({ value, label })),
  },
  powerSource: {
    title: "منبع انرژی",
    options: Object.entries(powerSourceLabels).map(([value, label]) => ({ value, label })),
  },
  area: {
    title: "متراژ سایت",
    options: Object.entries(areaLabels).map(([value, label]) => ({ value, label })),
  },
  workingWidth: {
    title: "عرض کار",
    options: workingWidthBands.map((b) => ({ value: b.key, label: b.label })),
  },
  brushType: {
    title: "نوع برس",
    options: Object.entries(brushTypeLabels).map(([value, label]) => ({ value, label })),
  },
  brand: {
    title: "برند",
    options: brands.map((b) => ({ value: b.slug, label: b.name })),
  },
});

function coverageOf(p: Product): number {
  return p.kpis.find((k) => k.key === "coverage")?.value ?? 0;
}

export default function CategoryBrowser({
  category,
  items,
  brands,
}: {
  category: Category;
  items: Product[];
  brands: Pick<Brand, "slug" | "name">[];
}) {
  const meta = useMemo(() => filterMeta(brands), [brands]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortKey>("relevance");
  const [panelOpen, setPanelOpen] = useState(false);

  const state = useMemo<FilterState>(
    () => parseFilters(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );

  const filtered = useMemo(() => {
    const list = applyFilters(items, state);
    const sorted = [...list];
    if (sort === "coverage") sorted.sort((a, b) => coverageOf(b) - coverageOf(a));
    if (sort === "width") sorted.sort((a, b) => (b.facets.workingWidth ?? 0) - (a.facets.workingWidth ?? 0));
    if (sort === "area") sorted.sort((a, b) => b.facets.areaMax - a.facets.areaMax);
    return sorted;
  }, [items, state, sort]);

  const push = (next: FilterState) => {
    router.replace(`${pathname}${serializeFilters(next)}`, { scroll: false });
  };

  const active = countActive(state);

  const panel = (
    <div className="space-y-6">
      {category.filters.map((key) => {
        const info = meta[key];
        const selected = state[key] ?? [];
        return (
          <fieldset key={key}>
            <legend className="eyebrow mb-3">{info.title}</legend>
            <div className="space-y-2">
              {info.options.map((opt) => {
                const count = facetCount(items, state, key, opt.value);
                const checked = selected.includes(opt.value);
                if (count === 0 && !checked) return null;
                return (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-ink"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => push(toggleFilter(state, key, opt.value))}
                      className="h-4 w-4 shrink-0 accent-[rgb(var(--c-accent))]"
                    />
                    <span className="flex-1">{opt.label}</span>
                    <span className="num text-xs text-muted/70">{fa(count)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      {active > 0 && (
        <button type="button" onClick={() => push({})} className={cn(buttonVariants({ variant: "outline" }), "w-full text-sm")}>
          حذف همه فیلترها ({fa(active)})
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-24">{panel}</div>
      </aside>

      <div className="lg:col-span-9">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            <span className="num font-semibold text-ink">{fa(filtered.length)}</span> دستگاه
            {active > 0 && <span> (از {fa(items.length)})</span>}
          </p>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPanelOpen(true)} className={cn(buttonVariants({ variant: "outline" }), "text-sm lg:hidden")}>
              فیلتر {active > 0 && <span className="num">({fa(active)})</span>}
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              مرتب‌سازی
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="با این فیلترها دستگاهی نیست"
            body="یک یا دو فیلتر را بردارید، یا بگذارید بر اساس شرایط سایت‌تان پیشنهاد بدهیم."
            action={
              <button type="button" onClick={() => push({})} className={buttonVariants({ variant: "primary" })}>
                حذف فیلترها
              </button>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setPanelOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col bg-surface">
            <div className="flex h-14 items-center justify-between border-b border-line px-4">
              <span className="font-semibold">فیلترها</span>
              <button type="button" onClick={() => setPanelOpen(false)} className={cn(buttonVariants({ variant: "quiet" }), "px-2")}>
                بستن
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{panel}</div>
            <div className="border-t border-line p-4">
              <button type="button" onClick={() => setPanelOpen(false)} className={cn(buttonVariants({ variant: "primary" }), "w-full")}>
                نمایش {fa(filtered.length)} دستگاه
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
