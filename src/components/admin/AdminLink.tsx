"use client";

import Link, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * لینک داخل پنل.
 *
 * دو تفاوت با next/link دارد، هر دو به‌خاطر اینکه همه مسیرهای پنل
 * `force-dynamic` هستند:
 *
 * ۱) prefetch ندارد. وقتی یک `<Link>` به مسیر پویا prefetch می‌کند، سرور
 *    همان لحظه **کل آن صفحه را رندر می‌کند**. هر صفحه پنل حدود ۲۵ لینک
 *    دارد (منوی کناری + کارت‌های داشبورد + دکمه‌های افزودن)، پس یک بار باز
 *    کردن داشبورد حدود ۴۵ رندر کامل سمت سرور راه می‌انداخت، نه یکی. روی
 *    لوکال این فقط «۸۵۰ میلی‌ثانیه» دیده می‌شد؛ روی یک VPS تک‌هسته‌ای همان
 *    ۴۵ رندر صف می‌کشند و کلیک بعدی کاربر هم پشت همین صف می‌ماند.
 *
 *    prefetch برای کاتالوگ عمومی که کاربر در آن پرسه می‌زند ارزش دارد؛ برای
 *    منوی کناری پنل که دقیقاً روی یک مورد کلیک می‌شود، فقط هزینه است.
 *
 * ۲) هنگام ناوبری، خودِ لینک کم‌رنگ می‌شود. چون هر کلیک منتظر یک رندر سرور
 *    می‌ماند، بدون این نشانه کاربر فکر می‌کند کلیکش ثبت نشده و دوباره کلیک
 *    می‌کند — که همان رندر را دو بار راه می‌اندازد.
 *
 *    عمداً به‌جای `loading.tsx` از این استفاده شده: با loading.tsx، Next
 *    پاسخ را زودتر flush می‌کند و دیگر `notFound()` نمی‌تواند وضعیت ۴۰۴
 *    بدهد — رکورد حذف‌شده با وضعیت ۲۰۰ برمی‌گشت.
 */
export default function AdminLink({ children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link prefetch={false} {...props}>
      <Pending>{children}</Pending>
    </Link>
  );
}

function Pending({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span
      className={cn(
        "contents",
        pending && "opacity-50 transition-opacity duration-200",
      )}
      aria-busy={pending || undefined}
    >
      {children}
    </span>
  );
}
