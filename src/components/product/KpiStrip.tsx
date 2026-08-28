"use client";

import { useEffect, useRef, useState } from "react";

import { num } from "@/lib/format";
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
                <span className="num bg-gradient-to-bl from-ink to-ink/55 bg-clip-text text-transparent">
                  <CountUp to={spec.value} />
                </span>
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

function CountUp({ to, duration = 1100 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          // easeOutCubic — سریع شروع می‌شود، نرم می‌ایستد.
          setValue(to * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
          else setValue(to);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  const display = Number.isInteger(to) ? Math.round(value) : Number(value.toFixed(1));
  return <span ref={ref}>{num(display)}</span>;
}
