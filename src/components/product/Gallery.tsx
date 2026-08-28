"use client";

import { useState } from "react";

import { ProductImage } from "@/components/ui/Primitives";

const VIEWS = [
  { key: "photo", label: "تصویر" },
  { key: "360", label: "۳۶۰°" },
  { key: "video", label: "ویدیو" },
  { key: "application", label: "در محیط کار" },
] as const;

/** گالری محصول: تصویر ← ۳۶۰ ← ویدیو ← محیط واقعی. */
export default function Gallery({ model }: { model: string }) {
  const [view, setView] = useState<(typeof VIEWS)[number]["key"]>("photo");
  const label = VIEWS.find((v) => v.key === view)?.label ?? "";

  return (
    <div>
      <div className="card overflow-hidden p-2">
        <ProductImage key={view} label={`${model} — ${label}`} ratio="aspect-[4/3]" className="animate-fade-up" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            aria-pressed={view === v.key}
            className={`rounded-lg border px-2 py-2 text-xs transition-colors ${
              view === v.key ? "border-ink text-ink" : "border-line text-muted hover:border-ink/30"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
