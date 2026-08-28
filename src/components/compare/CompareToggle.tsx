"use client";

import { useCompare } from "@/components/compare/CompareProvider";

export default function CompareToggle({
  slug,
  className = "",
  tone = "light",
}: {
  slug: string;
  className?: string;
  tone?: "light" | "deep";
}) {
  const { has, toggle, full } = useCompare();
  const inCompare = has(slug);

  const base =
    tone === "deep"
      ? inCompare
        ? "btn border border-accent text-accent"
        : "btn-glass"
      : inCompare
        ? "btn border border-accent bg-accent-soft text-accent"
        : "btn-ghost";

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={!inCompare && full}
      aria-pressed={inCompare}
      className={`${base} ${className}`}
      title={!inCompare && full ? "حداکثر ۴ دستگاه قابل مقایسه است" : undefined}
    >
      {inCompare ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          در فهرست مقایسه
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 5v14M15 5v14M4 9h10M10 15h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          افزودن به مقایسه
        </>
      )}
    </button>
  );
}
