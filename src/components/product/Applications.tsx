"use client";

import Link from "next/link";
import { useState } from "react";

import type { Industry, Product } from "@/lib/types";

/** «این دستگاه برای چه محیط‌هایی مناسب است؟» — تب‌های محیط با توضیح مختص همان محیط. */
export default function Applications({
  applications,
  industries,
}: {
  applications: Product["applications"];
  industries: Pick<Industry, "slug" | "name" | "blurb">[];
}) {
  const [active, setActive] = useState(0);
  if (!applications.length) return null;

  const current = applications[active];
  const industry = industries.find((i) => i.slug === current.industry);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {applications.map((app, i) => {
          const name = industries.find((ind) => ind.slug === app.industry)?.name ?? app.industry;
          const selected = i === active;
          return (
            <button
              key={app.industry}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={selected}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selected
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-muted hover:border-ink/30 hover:text-ink"
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      <div key={current.industry} className="card mt-4 animate-fade-up p-6">
        <p className="text-base leading-8">{current.note}</p>
        {industry && (
          <>
            <p className="mt-3 text-sm leading-7 text-muted">{industry.blurb}</p>
            <Link href={`/solutions/${industry.slug}`} className="mt-4 inline-block text-sm text-accent hover:underline">
              راهکار کامل نظافت {industry.name} ←
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
