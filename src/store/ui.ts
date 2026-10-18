"use client";

import { create } from "zustand";

interface UiState {
  mobileNavOpen: boolean;
  searchOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  openSearch: () => void;
  closeSearch: () => void;
}

/**
 * وضعیت لایه‌های روی صفحه (منوی موبایل و دیالوگ جستجو).
 *
 * بیرون از کامپوننت هدر نگهداری می‌شود چون چند جای دیگر هم باید آن را باز
 * کنند — نوار CTA موبایل، دکمه خالی‌بودن نتایج، میان‌بر ⌘K. با state محلی،
 * هر کدام نیاز به prop drilling از هدر داشتند.
 */
export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  searchOpen: false,
  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  openSearch: () => set({ searchOpen: true, mobileNavOpen: false }),
  closeSearch: () => set({ searchOpen: false }),
}));
