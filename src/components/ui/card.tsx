import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────── کارت */

export const cardVariants = cva("relative rounded-card", {
  variants: {
    surface: {
      light: "border border-line bg-surface",
      deep: "card-deep",
    },
    hover: {
      true: "transition-[transform,box-shadow,border-color] duration-500 ease-out-expo",
    },
  },
  defaultVariants: { surface: "light" },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType;
}

export function Card({ className, surface, hover, as: Tag = "div", ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        cardVariants({ surface, hover }),
        hover &&
          (surface === "deep"
            ? "hover:border-white/20 hover:shadow-lift"
            : "hover:-translate-y-1 hover:border-ink/14 hover:shadow-card"),
        className,
      )}
      {...props}
    />
  );
}

/* ─────────────────────────────────────────────────────────────── برچسب */

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
  {
    variants: {
      variant: {
        accent: "bg-accent text-white shadow-glow",
        neutral: "bg-ink/6 text-ink/70",
        outline: "border border-line text-muted",
        outlineOnDark: "border border-white/12 text-white/60",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/* ────────────────────────────────────────────────────────────────── چیپ */

export const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted",
  {
    variants: {
      interactive: {
        true: "transition-colors hover:border-ink/25 hover:text-ink",
      },
      onDark: {
        true: "border-white/12 bg-white/6 text-white/70",
      },
    },
  },
);

export function Chip({
  className,
  interactive,
  onDark,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipVariants>) {
  return <span className={cn(chipVariants({ interactive, onDark }), className)} {...props} />;
}
