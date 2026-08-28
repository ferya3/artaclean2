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
    <div className="sticky bottom-0 z-30 border-t border-line bg-surface/95 px-3 pb-[env(safe-area-inset-bottom)] pt-3 shadow-[0_-10px_30px_-24px_rgb(13_15_18/0.6)] backdrop-blur-xl lg:hidden">
      <div className="flex items-center gap-2">
        <a
          href="tel:+982100000000"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line text-ink"
          aria-label="تماس تلفنی"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden>
            <path
              d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2.2 2A16 16 0 013 6.2 2 2 0 015 4z"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <Link href="/advisor" className="btn-ghost btn-sm h-11 flex-1">
          مشاوره خرید
        </Link>
        <Link href="/quote" className="btn-accent btn-sm h-11 flex-1">
          درخواست قیمت
        </Link>
      </div>
    </div>
  );
}
