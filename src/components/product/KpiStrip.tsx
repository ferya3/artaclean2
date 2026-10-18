"use client";

import Counter from "@/components/motion/Counter";
import { specRatio } from "@/lib/scale";
import type { Spec } from "@/lib/types";

/**
 * نوار KPI صفحه محصول.
 * Motion اینجا کارکرد دارد نه تزئین: شمارش عدد از صفر، نگاه را روی همان چهار
 * عددی نگه می‌دارد که تصمیم خرید صنعتی را می‌سازند؛ و نوار زیر هر عدد، جایگاه
 * آن را در مقیاس کل کاتالوگ نشان می‌دهد.
 */
export default function KpiStrip({ kpis }: { kpis: Spec[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl2 border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((spec) => {
        const ratio = specRatio(spec.key, spec.value);
        return (
          <div key={spec.key} className="group bg-surface px-6 py-9 transition-colors hover:bg-canvas">
            {spec.value !== undefined ? (
              <p className="text-4xl font-black tracking-tight sm:text-5xl">
                <Counter
                  to={spec.value}
                  className="num bg-linear-to-bl from-ink to-ink/55 bg-clip-text text-transparent"
                />
                {spec.unit && <span className="ms-1.5 text-base font-bold text-accent">{spec.unit}</span>}
              </p>
            ) : (
              <p className="text-2xl font-black tracking-tight">{spec.text}</p>
            )}

            <p className="mt-3 text-xs text-muted">{spec.label}</p>

            {ratio !== null && (
              <div className="spec-bar mt-4">
                <span style={{ width: `${Math.max(8, Math.min(100, ratio * 100))}%` }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
