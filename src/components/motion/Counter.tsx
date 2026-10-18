"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  motion,
} from "framer-motion";
import { useEffect, useRef } from "react";

import { num } from "@/lib/format";

/**
 * شمارنده عدد مشخصات فنی.
 *
 * Motion اینجا کارکرد دارد نه تزئین: شمارش از صفر، نگاه را روی همان چند عددی
 * نگه می‌دارد که تصمیم خرید صنعتی را می‌سازند. با useMotionValue اجرا می‌شود،
 * پس هر فریم یک setState نیست و کل درخت را دوباره رندر نمی‌کند.
 */
export default function Counter({
  to,
  duration = 1.2,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();

  const value = useMotionValue(0);
  const decimals = Number.isInteger(to) ? 0 : 1;
  const text = useTransform(value, (v) => num(Number(v.toFixed(decimals))));

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      value.set(to);
      return;
    }
    const controls = animate(value, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, reduced, to, duration, value]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{text}</motion.span>
    </span>
  );
}
