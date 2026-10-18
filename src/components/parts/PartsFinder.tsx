"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { partCategories, spareParts } from "@/lib/data/parts";
import { products } from "@/lib/data/products";
import { fa, toman } from "@/lib/format";
import { normalize } from "@/lib/search";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * قطعات یدکی مسیر خرید خودش را دارد: کاربر معمولاً از مدل دستگاه یا
 * شماره فنی شروع می‌کند، نه از مرور دسته‌بندی.
 */
export default function PartsFinder({ initialQuery = "" }: { initialQuery?: string }) {
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const q = normalize(query);
    return spareParts.filter((part) => {
      if (model && !part.fitsModels.includes(model)) return false;
      if (category && part.category !== category) return false;
      if (q.length > 1) {
        const hay = normalize(`${part.partNo} ${part.title} ${part.category} ${part.fitsModels.join(" ")}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [model, category, query]);

  return (
    <div>
      <div className="card p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block sm:col-span-3">
            <span className="mb-1.5 block text-xs text-muted">جستجوی شماره فنی یا نام قطعه</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="مثلاً BR-510-PPL یا «تیغه لاستیکی»"
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink/40"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs text-muted">مدل دستگاه</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm"
            >
              <option value="">همه مدل‌ها</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.model} — {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-muted">نوع قطعه</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm"
            >
              <option value="">همه</option>
              {partCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted">
        <span className="num font-semibold text-ink">{fa(results.length)}</span> قطعه
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-y border-line text-start text-xs text-muted">
              <th className="py-3 pe-4 text-start font-medium">شماره فنی</th>
              <th className="py-3 pe-4 text-start font-medium">قطعه</th>
              <th className="py-3 pe-4 text-start font-medium">سازگار با</th>
              <th className="py-3 pe-4 text-start font-medium">وضعیت</th>
              <th className="py-3 text-start font-medium">قیمت</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {results.map((part) => (
              <tr key={part.partNo}>
                <td className="num py-3 pe-4 font-medium">{part.partNo}</td>
                <td className="py-3 pe-4">{part.title}</td>
                <td className="py-3 pe-4 text-xs text-muted">
                  {part.fitsModels
                    .map((slug) => products.find((p) => p.slug === slug)?.model ?? slug)
                    .join("، ")}
                </td>
                <td className="py-3 pe-4">
                  {part.inStock ? (
                    <span className="text-xs text-accent">موجود</span>
                  ) : (
                    <span className="text-xs text-muted">استعلام زمان تأمین</span>
                  )}
                </td>
                <td className="py-3 text-xs">
                  {part.price ? <span>{toman(part.price)}</span> : <span className="text-muted">استعلامی</span>}
                </td>
                <td className="py-3 text-end">
                  <Link
                    href={`/quote?part=${encodeURIComponent(part.partNo)}`}
                    className="text-xs text-accent hover:underline"
                  >
                    سفارش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length === 0 && (
        <div className="card mt-4 px-6 py-12 text-center">
          <p className="font-semibold">قطعه‌ای با این مشخصات پیدا نشد</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
            شماره فنی روی پلاک دستگاه یا عکس قطعه را برای ما بفرستید؛ اگر در فهرست نباشد، زمان تأمین را
            اعلام می‌کنیم.
          </p>
          <Link href="/quote" className={cn(buttonVariants({ variant: "primary" }), "mt-5")}>
            استعلام قطعه
          </Link>
        </div>
      )}
    </div>
  );
}
