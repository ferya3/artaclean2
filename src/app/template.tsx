"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * گذار بین صفحات.
 *
 * template.tsx (نه layout.tsx) چون باید در هر پیمایش دوباره mount شود.
 *
 * گذار عمداً فقط «ورود» دارد و خیلی کوتاه است. گذار خروج یعنی کاربر باید
 * منتظر محو شدن صفحه قبل بماند تا صفحه بعد بیاید؛ روی سایتی که کارش رساندن
 * سریع کاربر به مشخصات فنی است، این تأخیر هزینه است نه جلوه.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
