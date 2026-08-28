"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * نوار CTA چسبان موبایل.
 * برای دستگاه چند صد میلیونی، «تماس» و «درخواست قیمت» بسیار مهم‌تر از
 * یک دکمه بزرگ افزودن به سبد است.
 */
export default function StickyCta() {
  const pathname = usePathname();
  if (pathname.startsWith("/quote")) return null;

  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-[1fr_1fr_auto] items-stretch divide-x divide-x-reverse divide-line">
        <Link href="/advisor" className="px-3 py-3 text-center text-sm font-medium">
          مشاوره خرید
        </Link>
        <Link href="/quote" className="px-3 py-3 text-center text-sm font-medium text-accent">
          درخواست قیمت
        </Link>
        <a href="tel:+982100000000" className="grid w-14 place-items-center" aria-label="تماس تلفنی">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path
              d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2.2 2A16 16 0 013 6.2 2 2 0 015 4z"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
