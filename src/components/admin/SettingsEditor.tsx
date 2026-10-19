"use client";

import { Save } from "lucide-react";
import { useActionState, useState } from "react";

import { SectionCard } from "@/components/admin/RecordEditor";
import type { RecordValue } from "@/components/admin/FieldInput";
import { saveSettingsAction, type ActionState } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import type { Section } from "@/lib/admin/fields";

/**
 * ویرایشگر یک سند تنظیمات.
 *
 * همان ویرایشگر محتوا، منهای شناسه و وضعیت انتشار — سند تنظیمات یکی است و
 * همیشه منتشر.
 */
export default function SettingsEditor({
  settingsKey,
  sections,
  initial,
}: {
  settingsKey: string;
  sections: Section[];
  initial: RecordValue;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveSettingsAction, {});
  const [record, setRecord] = useState<RecordValue>(initial);

  const main = sections.filter((s) => !s.side);
  const side = sections.filter((s) => s.side);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-12">
      <input type="hidden" name="settings" value={settingsKey} />
      <input type="hidden" name="payload" value={JSON.stringify(record)} />

      <div className="space-y-6 lg:col-span-8">
        {main.map((section) => (
          <SectionCard key={section.title} section={section} record={record} onChange={setRecord} />
        ))}
      </div>

      <div className="space-y-6 lg:col-span-4">
        {side.map((section) => (
          <SectionCard key={section.title} section={section} record={record} onChange={setRecord} />
        ))}

        <div className="sticky bottom-4 space-y-3">
          {state.error && (
            <p
              role="alert"
              className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-2"
            >
              {state.error}
            </p>
          )}
          {state.ok && (
            <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
              {state.message}
            </p>
          )}

          <Button type="submit" variant="accent" block disabled={pending}>
            <Save className="size-4" aria-hidden />
            {pending ? "در حال ذخیره…" : "ذخیره تنظیمات"}
          </Button>
        </div>
      </div>
    </form>
  );
}
