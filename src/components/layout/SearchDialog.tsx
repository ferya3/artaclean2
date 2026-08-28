"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { extractIntent, groupHits, groupLabels, search } from "@/lib/search";
import { areaLabels, dirtLabels, surfaceLabels } from "@/lib/data/taxonomy";

const SUGGESTIONS = [
  "روغن روی کف کارخانه",
  "دستگاه مناسب انبار ۵۰۰۰ متر",
  "جارو برای محوطه و سیمان",
  "BR-510-PPL",
  "اجاره اسکرابر",
];

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hits = useMemo(() => (query.trim().length > 1 ? groupHits(search(query)) : []), [query]);
  const intent = useMemo(() => (query.trim().length > 2 ? extractIntent(query) : {}), [query]);
  const hasIntent = Boolean(intent.surface || intent.dirt || intent.area);

  const advisorHref = useMemo(() => {
    const params = new URLSearchParams();
    if (intent.surface) params.set("surface", intent.surface);
    if (intent.dirt) params.set("dirt", intent.dirt);
    if (intent.area) params.set("area", intent.area);
    return `/advisor?${params.toString()}`;
  }, [intent]);

  if (!open) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal aria-label="جستجو">
      <div className="absolute inset-0 bg-ink/45" onClick={onClose} aria-hidden />
      <div className="absolute inset-x-0 top-0 mx-auto max-w-2xl px-4 pt-[8vh]">
        <div className="overflow-hidden rounded-card bg-surface shadow-pop">
          <form onSubmit={submit} className="flex items-center gap-3 border-b border-line px-4">
            <SearchIcon />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام دستگاه، شماره فنی قطعه، یا مسئله‌تان را بنویسید…"
              className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
            />
            <button type="button" onClick={onClose} className="btn-quiet px-2 text-xs">
              ESC
            </button>
          </form>

          <div className="max-h-[60vh] overflow-y-auto">
            {hasIntent && (
              <div className="border-b border-line bg-accent-soft/60 px-4 py-3">
                <p className="text-xs text-muted">از جمله شما این را فهمیدیم:</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {intent.surface && <span className="chip bg-surface">{surfaceLabels[intent.surface]}</span>}
                  {intent.dirt && <span className="chip bg-surface">{dirtLabels[intent.dirt]}</span>}
                  {intent.area && <span className="chip bg-surface">{areaLabels[intent.area]}</span>}
                </div>
                <Link href={advisorHref} onClick={onClose} className="btn-accent mt-3 w-full text-sm">
                  دیدن دستگاه‌های پیشنهادی برای این شرایط
                </Link>
              </div>
            )}

            {query.trim().length <= 1 && (
              <div className="px-4 py-5">
                <p className="eyebrow mb-3">نمونه جستجو</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} type="button" onClick={() => setQuery(s)} className="chip hover:border-ink/30">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim().length > 1 && hits.length === 0 && (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-medium">نتیجه‌ای پیدا نشد</p>
                <p className="mt-1 text-sm text-muted">
                  مسئله‌تان را با جمله ساده بنویسید — مثلاً «گریس روی کف تعمیرگاه».
                </p>
              </div>
            )}

            {hits.map((group) => (
              <div key={group.group} className="border-b border-line px-2 py-3 last:border-0">
                <p className="eyebrow px-2 pb-2">{groupLabels[group.group]}</p>
                <ul>
                  {group.items.map((hit) => (
                    <li key={hit.href + hit.title}>
                      <Link
                        href={hit.href}
                        onClick={onClose}
                        className="block rounded-lg px-2 py-2 hover:bg-canvas"
                      >
                        <span className="block text-sm font-medium">{hit.title}</span>
                        <span className="block truncate text-xs text-muted">{hit.subtitle}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="text-muted"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}
