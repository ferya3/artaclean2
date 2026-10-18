"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * ظاهر شدن هنگام ورود به viewport.
 * یک‌بار اجرا می‌شود (بدون پرش هنگام اسکرول به عقب) و در حالت
 * prefers-reduced-motion کاملاً غیرفعال است.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12, margin: "0px 0px -8% 0px" });
  const reduced = useReducedMotion();

  // motion.li و motion.div تایپ ref متفاوتی دارند و اتحاد آن‌ها تهی می‌شود.
  // عنصر در زمان اجرا درست است؛ کست فقط برای یکسان کردن تایپ ref است.
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      ref={ref}
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      animate={inView || reduced ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/** نسخه فهرستی: هر فرزند با فاصله زمانی کوتاه پشت سر قبلی می‌آید. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : "hidden"}
      animate={inView || reduced ? "shown" : undefined}
      variants={{ shown: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
} as const;

/** فرزند RevealGroup. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={revealItem} className={className}>
      {children}
    </motion.div>
  );
}
