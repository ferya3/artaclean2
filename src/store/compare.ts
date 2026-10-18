"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 4;

interface CompareState {
  items: string[];
  /** تا وقتی localStorage خوانده نشده، UI نباید فهرست خالی را قطعی فرض کند. */
  hydrated: boolean;
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
      hydrated: false,
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
      // در حالت ناشناس یا با storage مسدود، persist خطا می‌دهد؛ UI نباید بشکند.
      onRehydrateStorage: () => (state) => {
        useCompareStore.setState({ hydrated: true });
        void state;
      },
    },
  ),
);

export const COMPARE_MAX = MAX;

/** همان API قبلی، تا مصرف‌کننده‌ها دست‌نخورده بمانند. */
export function useCompare() {
  const items = useCompareStore((s) => s.items);
  const hydrated = useCompareStore((s) => s.hydrated);
  const toggle = useCompareStore((s) => s.toggle);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

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
