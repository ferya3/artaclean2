"use client";

import { useCompare } from "@/components/compare/CompareProvider";

export default function CompareToggle({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle, full } = useCompare();
  const inCompare = has(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      disabled={!inCompare && full}
      aria-pressed={inCompare}
      className={`btn-ghost ${inCompare ? "border-accent text-accent" : ""} ${className}`}
      title={!inCompare && full ? "حداکثر ۴ دستگاه قابل مقایسه است" : undefined}
    >
      {inCompare ? "در فهرست مقایسه ✓" : "افزودن به مقایسه"}
    </button>
  );
}
