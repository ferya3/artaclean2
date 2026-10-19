"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 4;

interface CompareState {
  items: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

/**
 * فهرست مقایسه.
 *
 * قبلاً یک Context دست‌ساز بود؛ Zustand همان کار را بدون Provider و بدون
 * رندر مجدد کل درخت انجام می‌دهد — هر کامپوننت فقط به همان تکه‌ای که
 * می‌خواند subscribe می‌شود، که در شبکه‌ای با ۲۰ کارت محصول محسوس است.
 */
export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (slug) =>
        set((s) => {
          if (s.items.includes(slug)) return { items: s.items.filter((x) => x !== slug) };
          if (s.items.length >= MAX) return s;
          return { items: [...s.items, slug] };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((x) => x !== slug) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "artaclean.compare",
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

export const COMPARE_MAX = MAX;

/**
 * آمادگی فهرست.
 *
 * تا وقتی localStorage خوانده نشده، UI نباید فهرست خالی را قطعی فرض کند —
 * وگرنه نوار مقایسه یک لحظه ناپدید می‌شود و جدول مقایسه «چیزی انتخاب
 * نکرده‌اید» نشان می‌دهد.
 *
 * این وضعیت از API خود persist خوانده می‌شود، نه از یک فیلد داخل state:
 * localStorage هم‌زمان با ساخت store خوانده می‌شود و اگر callback بخواهد
 * همان لحظه `useCompareStore.setState` را صدا بزند، به متغیری اشاره می‌کند
 * که هنوز مقدار نگرفته است (TDZ) — خطا داخل persist خورده می‌شود و پرچم
 * برای همیشه false می‌ماند.
 *
 * مقدار اولیه عمداً false است و نه `hasHydrated()`: رندر سرور و نخستین رندر
 * کلاینت باید یکی باشند.
 */
function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = useCompareStore.persist.onFinishHydration(() => setHydrated(true));
    // ممکن است hydration پیش از اجرای این effect تمام شده باشد.
    if (useCompareStore.persist.hasHydrated()) setHydrated(true);
    return unsubscribe;
  }, []);

  return hydrated;
}

/** همان API قبلی، تا مصرف‌کننده‌ها دست‌نخورده بمانند. */
export function useCompare() {
  const items = useCompareStore((s) => s.items);
  const toggle = useCompareStore((s) => s.toggle);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);
  const hydrated = useHydrated();

  return {
    items,
    ready: hydrated,
    full: items.length >= MAX,
    has: (slug: string) => items.includes(slug),
    toggle,
    remove,
    clear,
  };
}
