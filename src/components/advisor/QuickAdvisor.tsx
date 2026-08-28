"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { areaLabels, dirtLabels, frequencyLabels, surfaceLabels } from "@/lib/data/taxonomy";

const FIELDS = [
  { key: "surface", label: "چه سطحی را تمیز می‌کنید؟", options: surfaceLabels },
  { key: "area", label: "متراژ تقریبی", options: areaLabels },
  { key: "dirt", label: "نوع آلودگی", options: dirtLabels },
  { key: "frequency", label: "دفعات استفاده", options: frequencyLabels },
] as const;

/** نسخه فشرده مشاور برای Hero — همان پرسش‌ها، بدون ترک صفحه اصلی. */
export default function QuickAdvisor() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) if (v) params.set(k, v);
    router.push(`/advisor${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form onSubmit={submit} className="card p-5 shadow-card sm:p-6">
      <p className="text-sm font-semibold">دستگاه مورد نیازتان را پیدا کنید</p>
      <p className="mt-1 text-xs text-muted">لازم نیست همه را پر کنید — هر پاسخ، فهرست را دقیق‌تر می‌کند.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="mb-1.5 block text-xs text-muted">{field.label}</span>
            <select
              value={values[field.key] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm"
            >
              <option value="">انتخاب کنید</option>
              {Object.entries(field.options).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <button type="submit" className="btn-accent mt-4 w-full">
        پیدا کردن دستگاه
      </button>
    </form>
  );
}
