"use client";

import { ImageOff, Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import { uploadImageAction } from "@/app/(admin)/admin/actions";

/**
 * انتخاب تصویر.
 *
 * آپلود جدا از ذخیره فرم انجام می‌شود و بلافاصله یک نشانی برمی‌گرداند که در
 * رکورد می‌نشیند. دلیلش این است که بدنه رکورد به‌صورت JSON ارسال می‌شود و
 * فایل در JSON جا نمی‌شود؛ مزیت جانبی‌اش این است که پیش‌نمایش واقعی (نسخه
 * WebP ساخته‌شده) را می‌بینید، نه فایل محلی.
 */
export default function ImagePicker({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const upload = (file: File) => {
    setError(null);
    const form = new FormData();
    form.set("file", file);
    startTransition(async () => {
      const result = await uploadImageAction(form);
      if (result.error) setError(result.error);
      else if (result.url) onChange(result.url);
    });
  };

  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium text-muted">{label}</span>

      <div className="relative overflow-hidden rounded-xl border border-line bg-canvas">
        {value ? (
          // تصویر آپلودی ابعاد از پیش معلومی ندارد؛ next/image اینجا سود
          // چندانی ندارد و فقط پیکربندی اضافه می‌خواهد.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="پیش‌نمایش" className="aspect-4/3 w-full object-cover" />
        ) : (
          <div className="grid aspect-4/3 place-items-center gap-2 text-xs text-muted">
            <ImageOff className="size-5" aria-hidden />
            بدون تصویر — تصویر برداری دستگاه نمایش داده می‌شود
          </div>
        )}

        {pending && (
          <span className="absolute inset-0 grid place-items-center bg-surface/70">
            <Loader2 className="size-5 animate-spin text-accent" aria-hidden />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          disabled={pending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
          className="min-w-0 flex-1 text-xs text-muted file:me-3 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:py-2 file:text-xs file:text-white"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 rounded-lg border border-line p-2 text-muted transition-colors hover:border-accent/40 hover:text-accent"
            aria-label="حذف تصویر"
          >
            <Trash2 className="size-4" aria-hidden />
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-[11px] text-accent-2">{error}</p>}
      {hint && <p className="mt-2 text-[11px] leading-5 text-muted">{hint}</p>}
      <p className="mt-2 text-[11px] leading-5 text-muted">
        هر تصویری که آپلود شود به WebP تبدیل و تا ۱۶۰۰ پیکسل کوچک می‌شود.
      </p>
    </div>
  );
}
