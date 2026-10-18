"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import ProductVisual from "@/components/ui/ProductVisual";

// صحنه سه‌بعدی حدود ۶۰۰ کیلوبایت جاوااسکریپت است. روی سایتی که ارزشش
// رسیدن سریع به مشخصات فنی است، این حجم نباید در بارگذاری اولیه باشد.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * قاب Hero.
 *
 * صحنه سه‌بعدی فقط وقتی لود می‌شود که هر سه شرط برقرار باشد: صفحه بزرگ،
 * نبود prefers-reduced-motion، و پشتیبانی WebGL. در غیر این صورت همان
 * تصویر برداری دستگاه نشان داده می‌شود — که روی موبایل در عمل بهتر هم هست:
 * بدون مصرف باتری و بدون تأخیر.
 */
export default function HeroStage() {
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    const decide = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      if (reduced || !wide) return setUse3d(false);

      let webgl = false;
      try {
        const canvas = document.createElement("canvas");
        webgl = Boolean(
          canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
        );
      } catch {
        webgl = false;
      }
      setUse3d(webgl);
    };

    decide();
    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  if (!use3d) {
    return (
      <ProductVisual
        kind="floor-scrubbers"
        variant="ride-on"
        tone="deep"
        ratio="aspect-[4/3]"
        label="اسکرابر سرنشین‌دار"
        className="rounded-xl2 border border-white/10"
      />
    );
  }

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-xl2 border border-white/10 bg-[radial-gradient(120%_100%_at_30%_0%,#21262e_0%,#0c0e12_72%)]">
      <HeroScene />
    </div>
  );
}
