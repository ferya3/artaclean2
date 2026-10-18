import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * دکمه، به سبک shadcn/ui.
 *
 * buttonVariants جداگانه export می‌شود چون بیشتر CTAهای این سایت در واقع
 * <Link> هستند، نه <button>. برای آن‌ها className={buttonVariants({…})}
 * درست‌تر از asChild است: یک عنصر کمتر و بدون نیاز به forwardRef.
 */
export const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 overflow-hidden",
    "rounded-xl font-semibold whitespace-nowrap",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-200 ease-out-expo",
    "active:translate-y-px disabled:pointer-events-none disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        accent: [
          "text-white shadow-[0_10px_24px_-12px] shadow-accent/85",
          // درخشش عبوری به‌صورت لایه پس‌زمینه اجرا می‌شود، نه overlay روی متن:
          // overlay شفاف روی حروف فارسی، نقطه‌های زیر «پ» و «ب» را می‌شوید.
          "bg-[linear-gradient(100deg,transparent_38%,rgb(255_255_255/0.26)_50%,transparent_62%),linear-gradient(135deg,var(--color-accent)_0%,var(--color-accent-2)_100%)]",
          "[background-size:260%_100%,100%_100%] [background-position:140%_0,0_0] bg-no-repeat",
          "transition-[background-position,transform,box-shadow] duration-700",
          "hover:[background-position:-40%_0,0_0] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px] hover:shadow-accent/95",
        ],
        primary: [
          "bg-ink text-white",
          "hover:bg-deep-2 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-16px] hover:shadow-ink/60",
        ],
        outline: [
          "border border-line bg-surface text-ink",
          "hover:border-ink/28 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-18px] hover:shadow-ink/50",
        ],
        glass: [
          "glass text-white",
          "hover:bg-white/[0.13] hover:-translate-y-0.5",
        ],
        quiet: "font-medium text-muted hover:bg-ink/5 hover:text-ink",
        quietOnDark: "font-medium text-white/70 hover:bg-white/10 hover:text-white",
      },
      size: {
        sm: "px-3.5 py-2 text-[13px]",
        md: "px-5 py-3 text-sm",
        lg: "px-6 py-3.5 text-[15px]",
        icon: "size-11 shrink-0 p-0",
        iconSm: "size-9 shrink-0 p-0",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, block }), className)} {...props} />
  );
}
