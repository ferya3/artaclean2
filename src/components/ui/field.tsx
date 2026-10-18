"use client";

import { ChevronDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * عناصر فرم.
 * هیچ‌کدام state داخلی ندارند — کنترل با والد است تا هم در Server Action و
 * هم در فرم‌های کنترل‌شده بدون تغییر کار کنند.
 */

const fieldBase =
  "w-full rounded-xl border bg-surface px-3.5 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent disabled:opacity-50";

export function Label({
  className,
  required,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn("block", className)} {...props}>
      <span className="mb-1.5 block text-[11px] font-medium text-muted">
        {children}
        {required && <span className="text-accent"> *</span>}
      </span>
    </label>
  );
}

export function Field({
  label,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[11px] font-medium text-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "border-line", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "border-line resize-y", className)} {...props} />;
}

export function Select({
  className,
  filled,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { filled?: boolean }) {
  return (
    <div className="relative">
      <select
        className={cn(
          fieldBase,
          "appearance-none bg-canvas pe-9",
          filled ? "border-ink/20 font-medium text-ink" : "border-line text-muted",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted"
        aria-hidden
      />
    </div>
  );
}

export function Checkbox({
  className,
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted transition-colors hover:text-ink">
      <input
        type="checkbox"
        className={cn("size-4 shrink-0 accent-accent", className)}
        {...props}
      />
      {label}
    </label>
  );
}
