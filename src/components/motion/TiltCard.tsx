"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

import { cn } from "@/lib/utils";

/**
 * کارت با چرخش سه‌بعدی ملایم نسبت به مکان نشانگر.
 *
 * دامنه عمداً کوچک است (۶ درجه): روی کارت محصولی که باید مشخصات فنی‌اش
 * خوانده شود، چرخش زیاد متن را ناخوانا و حرکت را پر سر و صدا می‌کند.
 * روی دستگاه لمسی و در حالت reduced-motion هیچ اتفاقی نمی‌افتد.
 */
export default function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const reduced = useReducedMotion();

  const spring = { stiffness: 260, damping: 26, mass: 0.6 };
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateY.set((x - 0.5) * max * 2);
    rotateX.set((0.5 - y) * max * 2);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("[transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}
