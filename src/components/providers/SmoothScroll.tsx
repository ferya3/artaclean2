"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * اسکرول نرم.
 *
 * سه نکته که اگر رعایت نشوند، اسکرول نرم به‌جای بهتر کردن سایت خرابش می‌کند:
 *
 * ۱) Lenis و ScrollTrigger باید یک حلقه زمانی مشترک داشته باشند. اگر هرکدام
 *    requestAnimationFrame خودش را بزند، انیمیشن‌های اسکرول یک فریم عقب
 *    می‌افتند و لرزش دیده می‌شود. پس ticker خود GSAP، lenis.raf را صدا می‌زند.
 *
 * ۲) در prefers-reduced-motion اصلاً فعال نمی‌شود. اسکرول نرم برای کسی که
 *    حساسیت حرکتی دارد یک مانع دسترسی‌پذیری است، نه یک جلوه.
 *
 * ۳) لینک‌های لنگردار (#specs در صفحه محصول) باید از خود Lenis عبور کنند،
 *    وگرنه پرش ناگهانی می‌کنند در حالی که بقیه صفحه نرم است.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // روی موبایل، اسکرول بومی حس بهتری دارد و با نوار آدرس مرورگر درگیر نمی‌شود.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // آفست = ارتفاع هدر چسبان + زیرمنوی صفحه محصول
      lenis.scrollTo(target as HTMLElement, { offset: -120 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
