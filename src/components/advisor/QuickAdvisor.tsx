"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { areaLabels, dirtLabels, frequencyLabels, surfaceLabels } from "@/lib/data/taxonomy";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FIELDS = [
  { key: "surface", label: "چه سطحی را تمیز می‌کنید؟", options: surfaceLabels },
  { key: "area", label: "متراژ تقریبی", options: areaLabels },
  { key: "dirt", label: "نوع آلودگی", options: dirtLabels },
  { key: "frequency", label: "دفعات استفاده", options: frequencyLabels },
] as const;

/**
 * نوار مشاور — روی لبه Hero می‌نشیند.
 * همان چهار پرسش مشاور کامل، بدون ترک صفحه اصلی. هیچ فیلدی اجباری نیست؛
 * هر پاسخ فقط فهرست را دقیق‌تر می‌کند.
 */
export default function QuickAdvisor() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const answered = Object.values(values).filter(Boolean).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) if (v) params.set(k, v);
    router.push(`/advisor${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl2 border border-line bg-surface p-5 shadow-pop sm:p-7"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow-accent mb-2 flex items-center gap-2">
            <span className="h-px w-6 bg-accent" aria-hidden />
            مشاور انتخاب دستگاه
          </p>
          <p className="text-lg font-extrabold">دستگاه مورد نیازتان را پیدا کنید</p>
        </div>
        <p className="text-xs text-muted">
          لازم نیست همه را پر کنید — هر پاسخ، فهرست را دقیق‌تر می‌کند.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1.5 block text-[11px] font-medium text-muted">{field.label}</span>
            <div className="relative">
              <select
                value={values[field.key] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className={`w-full appearance-none rounded-xl border bg-canvas px-3.5 py-3 pe-9 text-sm transition-colors focus:border-accent ${
                  values[field.key] ? "border-ink/20 font-medium text-ink" : "border-line text-muted"
                }`}
              >
                <option value="">انتخاب کنید</option>
                {Object.entries(field.options).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                className="pointer-events-none absolute end-3.5 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              </svg>
            </div>
          </label>
        ))}

        <div className="flex items-end">
          <button type="submit" className={cn(buttonVariants({ variant: "accent" }), "w-full py-3")}>
            {answered > 0 ? "دیدن پیشنهادها" : "شروع کنید"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}
