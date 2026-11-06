"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * کاروسل فقط-دسکتاپ.
 *
 * زیر lg همان گرید معمولی است و هیچ رفتار کاروسلی ندارد: روی موبایل، گرید
 * دوستونه همه دسته‌ها را با یک نگاه نشان می‌دهد و کاروسل فقط یک لایه پنهان‌کاری
 * اضافه می‌کرد. از lg به بالا، همان فرزندان در یک ردیف افقی با scroll-snap
 * می‌نشینند.
 *
 * عمداً روی اسکرول بومی ساخته شده، نه transform: ترک‌پد، کلید Tab روی
 * لینک‌ها و صفحه‌خوان بدون هیچ کد اضافه کار می‌کنند، و هر کارت یک لینک
 * واقعی می‌ماند.
 *
 * `data-lenis-prevent-horizontal`: اسکرول نرم Lenis رویداد چرخ را می‌گیرد؛
 * بدون این، کشیدن افقی ترک‌پد روی کاروسل به اسکرول عمودی صفحه تبدیل می‌شد.
 * اسکرول عمودی همچنان به Lenis می‌رسد.
 */
export default function Carousel({
  label,
  perView = 4,
  children,
  className,
}: {
  label: string;
  /** تعداد کارت در هر نما، روی دسکتاپ. */
  perView?: 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ atStart: true, atEnd: false, progress: 0, scrollable: false });

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    // در RTL مقدار scrollLeft از صفر به سمت منفی می‌رود؛ قدرمطلق برای هر دو جهت درست است.
    const pos = Math.abs(el.scrollLeft);
    setState({
      atStart: pos <= 2,
      atEnd: pos >= max - 2,
      progress: max > 0 ? pos / max : 0,
      scrollable: max > 2,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    // تغییر اندازه پنجره (و عبور از مرز lg) پهنای ردیف را عوض می‌کند.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const go = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    // «بعدی» یعنی رفتن به سمت پایان ردیف — در RTL یعنی به چپ، پس scrollLeft منفی‌تر.
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: direction * (rtl ? -1 : 1) * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className={className}>
      <div
        ref={trackRef}
        data-lenis-prevent-horizontal
        className={cn(
          "grid gap-5 sm:grid-cols-2",
          // دسکتاپ: یک ردیف افقی. پهنای هر کارت از تعداد در هر نما و فاصله‌ها
          // حساب می‌شود تا لبه آخرین کارت دقیقاً روی لبه ردیف بنشیند.
          "lg:flex lg:snap-x lg:snap-mandatory lg:overflow-x-auto lg:overscroll-x-contain",
          "lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden",
          "lg:[&>*]:shrink-0 lg:[&>*]:snap-start",
          perView === 3 && "lg:[&>*]:w-[calc((100%-2.5rem)/3)]",
          perView === 4 && "lg:[&>*]:w-[calc((100%-3.75rem)/4)]",
          perView === 5 && "lg:[&>*]:w-[calc((100%-5rem)/5)]",
          // سایه و چرخش کارت‌ها هنگام hover از لبه ردیف بیرون می‌زند و
          // overflow آن را می‌بُرد؛ کمی فضای عمودی جبران می‌کند.
          "lg:-my-4 lg:py-4",
        )}
      >
        {children}
      </div>

      {state.scrollable && (
        <div className="mt-6 hidden items-center gap-5 lg:flex">
          {/* نوار پیشرفت: جایگاه نمای فعلی در کل ردیف. */}
          <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-line" aria-hidden>
            <div
              className="h-full rounded-full bg-accent transition-transform duration-300 ease-out-expo ltr:origin-left rtl:origin-right"
              style={{ transform: `scaleX(${Math.max(0.08, state.progress)})` }}
            />
          </div>

          <div className="flex gap-2">
            <ArrowButton
              label="قبلی"
              disabled={state.atStart}
              onClick={() => go(-1)}
              icon={<ChevronRight className="size-5" aria-hidden />}
            />
            <ArrowButton
              label="بعدی"
              disabled={state.atEnd}
              onClick={() => go(1)}
              icon={<ChevronLeft className="size-5" aria-hidden />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowButton({
  label,
  disabled,
  onClick,
  icon,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-11 place-items-center rounded-full border border-line bg-surface text-ink transition-[color,background-color,border-color,opacity] duration-200 hover:border-accent hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-35"
    >
      {icon}
    </button>
  );
}
