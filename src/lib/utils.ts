import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ادغام کلاس‌های Tailwind.
 * clsx شرط‌ها را حل می‌کند و tailwind-merge تعارض‌ها را: در
 * cn("px-4", "px-6") خروجی "px-6" است، نه هر دو. بدون این، override کردن
 * استایل یک کامپوننت از بیرون به ترتیب تصادفی کلاس‌ها در CSS وابسته می‌شد.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
