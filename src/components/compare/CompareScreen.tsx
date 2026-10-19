"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCompare } from "@/store/compare";
import { compareAction } from "@/lib/actions/catalog";
import { areaLabels, machineTypeLabels, powerSourceLabels } from "@/lib/data/taxonomy";
import { fa, specValue } from "@/lib/format";
import type { AreaBand, Product, Spec } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * موتور مقایسه.
 * برای خرید صنعتی، جدول تنها نیمی از کار است؛ نیم دیگر پاسخ به «کدام مناسب من است؟».
 * ردیف‌های متفاوت هم برجسته می‌شوند تا چشم دنبال تفاوت‌ها نگردد.
 *
 * فهرست انتخاب‌شده در localStorage است، پس سرور از پیش نمی‌داند چه چیزی باید
 * رندر شود؛ همان چند دستگاه با یک Server Action گرفته می‌شود تا کل کاتالوگ
 * به باندل کلاینت نرود.
 */
export default function CompareScreen({
  popular,
}: {
  popular: { slug: string; category: string; name: string }[];
}) {
  const { items, remove, clear, ready } = useCompare();
  const [band, setBand] = useState<AreaBand | "">("");
  const [picked, setPicked] = useState<Product[]>([]);
  const [suggestion, setSuggestion] = useState<{ slug: string; why: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setPicked([]);
      setSuggestion(null);
      return;
    }
    let active = true;
    setLoading(true);
    compareAction(items, band || undefined)
      .then((result) => {
        if (!active) return;
        setPicked(result.products);
        setSuggestion(result.suggestion);
      })
      .catch(() => {
        if (active) setPicked([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [items, band]);

  const rows = buildRows(picked);
  const suggested = suggestion ? picked.find((p) => p.slug === suggestion.slug) : undefined;

  return (
    <div className="shell pb-20">
      {items.length > 0 && (
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={clear}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            پاک کردن فهرست
          </button>
        </div>
      )}

      {!ready ? null : items.length === 0 ? (
        <div className="card px-6 py-16 text-center">
          <p className="text-lg font-semibold">هنوز دستگاهی برای مقایسه انتخاب نکرده‌اید</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
            از هر کارت محصول یا صفحه محصول، دکمه «مقایسه» را بزنید. یا بگذارید بر اساس شرایط سایت
            پیشنهاد بدهیم.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/advisor" className={buttonVariants({ variant: "accent" })}>
              پیدا کردن دستگاه مناسب
            </Link>
            <Link href="/products" className={buttonVariants({ variant: "outline" })}>
              مرور محصولات
            </Link>
          </div>

          {popular.length > 0 && (
            <div className="mx-auto mt-10 max-w-2xl border-t border-line pt-8 text-start">
              <p className="eyebrow mb-3">مقایسه‌های پرتکرار</p>
              <ul className="space-y-2 text-sm">
                {popular.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/products/${p.category}/${p.slug}`}
                      className="text-muted hover:text-ink"
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : picked.length === 0 ? (
        <div className="card px-6 py-16 text-center text-sm text-muted">
          {loading ? "در حال بارگذاری…" : "دستگاه‌های انتخاب‌شده دیگر در کاتالوگ نیستند."}
        </div>
      ) : (
        <>
          {picked.length >= 2 && (
            <div className="card mb-8 flex flex-wrap items-center justify-between gap-4 bg-canvas p-6">
              <div className="max-w-xl">
                <p className="font-semibold">کدام مناسب شماست؟</p>
                <p className="mt-1 text-sm leading-7 text-muted">
                  {suggestion ? suggestion.why : "متراژ سایت را انتخاب کنید تا پیشنهاد بدهیم."}
                </p>
                {suggested && (
                  <p className="mt-2 text-sm">
                    پیشنهاد ما: <span className="font-semibold text-accent">{suggested.name}</span>
                  </p>
                )}
              </div>
              <label className="text-sm">
                <span className="mb-1.5 block text-xs text-muted">متراژ سایت شما</span>
                <select
                  value={band}
                  onChange={(e) => setBand(e.target.value as AreaBand | "")}
                  className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm"
                >
                  <option value="">انتخاب کنید</option>
                  {Object.entries(areaLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-44 py-4 text-start align-bottom text-xs font-medium text-muted">
                    مشخصه
                  </th>
                  {picked.map((p) => (
                    <th key={p.slug} className="border-s border-line px-4 py-4 text-start align-bottom">
                      <button
                        type="button"
                        onClick={() => remove(p.slug)}
                        className="mb-2 text-xs text-muted hover:text-ink"
                      >
                        × حذف
                      </button>
                      <Link
                        href={`/products/${p.category}/${p.slug}`}
                        className="block font-semibold hover:text-accent"
                      >
                        {p.name}
                      </Link>
                      <span className="num mt-1 block text-xs text-muted">{p.model}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line border-y border-line">
                {rows.map((row) => (
                  <tr key={row.label} className={row.differs ? "bg-accent-soft/25" : ""}>
                    <th className="py-3 pe-4 text-start font-normal text-muted">{row.label}</th>
                    {row.values.map((v, i) => (
                      <td
                        key={`${row.label}-${i}`}
                        className={`border-s border-line px-4 py-3 ${v.numeric ? "num" : ""} ${
                          v.best ? "font-semibold text-accent" : ""
                        }`}
                      >
                        {v.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td />
                  {picked.map((p) => (
                    <td key={p.slug} className="border-s border-line px-4 py-5">
                      <Link
                        href={`/quote?product=${p.slug}`}
                        className={cn(buttonVariants({ variant: "accent" }), "w-full text-sm")}
                      >
                        درخواست پیش‌فاکتور
                      </Link>
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="mt-6 text-xs text-muted">
            ردیف‌های رنگی، مشخصه‌هایی هستند که بین این {fa(picked.length)} دستگاه تفاوت دارند.
          </p>
        </>
      )}
    </div>
  );
}

interface Row {
  label: string;
  differs: boolean;
  values: { text: string; numeric: boolean; best: boolean }[];
}

/**
 * ردیف‌های جدول از اجتماع همه مشخصات ساخته می‌شوند، نه از یک لیست ثابت —
 * چون دستگاه‌های مختلف مشخصات متفاوتی دارند و «—» گفتن صادقانه‌تر از حذف ردیف است.
 */
function buildRows(picked: Product[]): Row[] {
  if (!picked.length) return [];

  const base: Row[] = [
    row("نوع دستگاه", picked.map((p) => machineTypeLabels[p.facets.machineType])),
    row("منبع انرژی", picked.map((p) => powerSourceLabels[p.facets.powerSource])),
    row(
      "بازه متراژ پوششی",
      picked.map(
        (p) =>
          `${p.facets.areaMin.toLocaleString("en-US")}–${p.facets.areaMax.toLocaleString("en-US")} m²`,
      ),
      true,
    ),
  ];

  const specMap = new Map<string, { label: string; specs: (Spec | undefined)[] }>();
  picked.forEach((product, index) => {
    const all = product.specGroups.flatMap((g) => g.specs);
    for (const spec of all) {
      if (!specMap.has(spec.key)) {
        specMap.set(spec.key, { label: spec.label, specs: new Array(picked.length).fill(undefined) });
      }
      specMap.get(spec.key)!.specs[index] = spec;
    }
  });

  // «بیشتر بهتر است» برای این کلیدها؛ برای وزن و صدا برعکس.
  const higherBetter = new Set([
    "coverage",
    "coverageReal",
    "tank",
    "runtime",
    "width",
    "pressure",
    "flow",
    "airflow",
    "vacuum",
  ]);
  const lowerBetter = new Set(["weight", "noise", "charge"]);

  const specRows: Row[] = [];
  for (const [key, entry] of specMap) {
    const texts = entry.specs.map((s) => (s ? specValue(s) : "—"));
    const numbers = entry.specs.map((s) => s?.value);
    // «عددی» را سلول‌به‌سلول تعیین می‌کنیم: در یک ردیف ممکن است یک دستگاه عدد
    // بدهد و دیگری متن فارسی («لیتیوم-یون»)؛ اعمال جهت لاتین روی متن فارسی
    // ترتیب کلمات را خراب می‌کند.
    const numericCells = entry.specs.map((s) => s?.value !== undefined);

    let bestIndex = -1;
    if (higherBetter.has(key) || lowerBetter.has(key)) {
      const defined = numbers
        .map((n, i) => ({ n, i }))
        .filter((x): x is { n: number; i: number } => x.n !== undefined);
      if (defined.length > 1) {
        const winner = higherBetter.has(key)
          ? defined.reduce((a, b) => (b.n > a.n ? b : a))
          : defined.reduce((a, b) => (b.n < a.n ? b : a));
        bestIndex = winner.i;
      }
    }

    specRows.push({
      label: entry.label,
      differs: new Set(texts).size > 1,
      values: texts.map((text, i) => ({ text, numeric: numericCells[i], best: i === bestIndex })),
    });
  }

  return [...base, ...specRows];
}

function row(label: string, values: string[], numeric = false): Row {
  return {
    label,
    differs: new Set(values).size > 1,
    values: values.map((text) => ({ text, numeric, best: false })),
  };
}
