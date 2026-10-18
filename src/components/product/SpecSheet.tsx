"use client";

import { useState } from "react";

import { specValue } from "@/lib/format";
import type { SpecGroup } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * مشخصات فنی نباید یک جدول عظیم و وحشتناک باشد.
 * ابتدا خلاصه اسکن‌شدنی (گروه اول)، بعد «مشخصات کامل» با یک کلیک.
 */
export default function SpecSheet({ groups }: { groups: SpecGroup[] }) {
  const [expanded, setExpanded] = useState(false);
  const [first, ...rest] = groups;
  if (!first) return null;

  return (
    <div>
      <SpecTable group={first} />

      {rest.length > 0 && (
        <>
          {expanded && (
            <div className="mt-6 space-y-6 animate-fade-up">
              {rest.map((group) => (
                <SpecTable key={group.title} group={group} />
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={cn(buttonVariants({ variant: "outline" }), "mt-5 w-full sm:w-auto")}
            aria-expanded={expanded}
          >
            {expanded ? "بستن مشخصات کامل" : "مشخصات کامل"}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              className={`transition-transform ${expanded ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

function SpecTable({ group }: { group: SpecGroup }) {
  return (
    <section>
      <h3 className="eyebrow mb-3">{group.title}</h3>
      <dl className="divide-y divide-line border-y border-line">
        {group.specs.map((spec) => (
          <div key={spec.key} className="flex items-baseline justify-between gap-6 py-2.5 text-sm">
            <dt className="text-muted">{spec.label}</dt>
            <dd className={spec.text ? "text-end font-medium" : "num text-end font-medium"}>
              {specValue(spec)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
