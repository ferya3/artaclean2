"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "artaclean.compare";
const MAX = 4;

interface CompareApi {
  items: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  full: boolean;
  ready: boolean;
}

const CompareContext = createContext<CompareApi | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((v): v is string => typeof v === "string"));
      }
    } catch {
      // حالت خصوصی مرورگر یا مسدود بودن storage — لیست مقایسه صرفاً در همین نشست می‌ماند.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* بی‌صدا رد می‌شویم؛ نبود persistence نباید UI را بشکند. */
    }
  }, [items, ready]);

  const toggle = useCallback((slug: string) => {
    setItems((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX) return prev;
      return [...prev, slug];
    });
  }, []);

  const value = useMemo<CompareApi>(
    () => ({
      items,
      ready,
      full: items.length >= MAX,
      has: (slug) => items.includes(slug),
      toggle,
      remove: (slug) => setItems((prev) => prev.filter((s) => s !== slug)),
      clear: () => setItems([]),
    }),
    [items, ready, toggle],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareApi {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare باید داخل CompareProvider استفاده شود");
  return ctx;
}

export const COMPARE_MAX = MAX;
