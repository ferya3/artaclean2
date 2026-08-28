"use client";

import { useState } from "react";

import ProductVisual from "@/components/ui/ProductVisual";
import { visualScale } from "@/lib/scale";
import type { Product } from "@/lib/types";

const VIEWS = [
  { key: "photo", label: "تصویر" },
  { key: "360", label: "۳۶۰°" },
  { key: "video", label: "ویدیو" },
  { key: "application", label: "در محیط کار" },
] as const;

/** گالری محصول: تصویر ← ۳۶۰ ← ویدیو ← محیط واقعی. */
export default function Gallery({ product }: { product: Product }) {
  const [view, setView] = useState<(typeof VIEWS)[number]["key"]>("photo");
  const label = VIEWS.find((v) => v.key === view)?.label ?? "";

  return (
    <div>
      <div className="relative overflow-hidden rounded-xl2 border border-white/10">
        <ProductVisual
          key={view}
          kind={product.category}
          variant={product.facets.machineType}
          brush={product.facets.brushType}
          scale={visualScale(product.facets.areaMax)}
          tone="deep"
          ratio="aspect-[4/3]"
          label={`${product.model} — ${label}`}
          className="animate-float-soft"
        />

        {view === "video" && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-accent shadow-glow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden>
                <path d="M9 6.5v11l9-5.5z" />
              </svg>
            </span>
          </span>
        )}

        {view === "360" && (
          <span className="pointer-events-none absolute bottom-4 start-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-deep/80 px-4 py-1.5 text-[11px] text-white/70 backdrop-blur">
            برای چرخاندن بکشید
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        {VIEWS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => setView(v.key)}
            aria-pressed={view === v.key}
            className={`rounded-xl border px-2 py-2.5 text-xs font-medium transition-all duration-300 ${
              view === v.key
                ? "border-accent bg-accent/10 text-accent"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}
