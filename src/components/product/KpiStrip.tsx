"use client";

import { useEffect, useRef, useState } from "react";

import { num } from "@/lib/format";
import type { Spec } from "@/lib/types";

/**
 * نوار KPI صفحه محصول.
 * Motion اینجا کارکرد دارد نه تزئین: شمارش عدد از صفر، نگاه را روی همان چهار
 * عددی نگه می‌دارد که تصمیم خرید صنعتی را می‌سازند.
 */
export default function KpiStrip({ kpis }: { kpis: Spec[] }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-line md:grid-cols-4">
      {kpis.map((spec) => (
        <div key={spec.key} className="bg-surface px-5 py-7 text-center">
          {spec.value !== undefined ? (
            <p className="num text-3xl font-bold tracking-tight sm:text-4xl">
              <CountUp to={spec.value} />
              {spec.unit && <span className="ms-1 text-base font-medium text-muted">{spec.unit}</span>}
            </p>
          ) : (
            <p className="text-2xl font-bold tracking-tight">{spec.text}</p>
          )}
          <p className="mt-2 text-xs text-muted">{spec.label}</p>
        </div>
      ))}
    </div>
  );
}

function CountUp({ to, duration = 900 }: { to: number; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
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
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(to * eased);
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
