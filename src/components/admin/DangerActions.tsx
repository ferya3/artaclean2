"use client";

import { Copy, Trash2 } from "lucide-react";

import { deleteContentAction, duplicateContentAction } from "@/app/(admin)/admin/actions";

/**
 * کپی و حذف یک رکورد.
 *
 * کلاینت است چون حذف باید یک تأیید بگیرد و مدیری که اشتباه روی «حذف» کلیک
 * می‌کند، راه بازگشتی ندارد: رکورد از دیتابیس می‌رود.
 */
export default function DangerActions({
  collection,
  slug,
  label,
}: {
  collection: string;
  slug: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <form action={duplicateContentAction}>
        <input type="hidden" name="collection" value={collection} />
        <input type="hidden" name="slug" value={slug} />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          <Copy className="size-3.5" aria-hidden />
          کپی
        </button>
      </form>

      <form
        action={deleteContentAction}
        onSubmit={(event) => {
          if (!window.confirm(`«${label}» برای همیشه حذف شود؟ این کار بازگشت ندارد.`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="collection" value={collection} />
        <input type="hidden" name="slug" value={slug} />
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          <Trash2 className="size-3.5" aria-hidden />
          حذف
        </button>
      </form>
    </div>
  );
}
