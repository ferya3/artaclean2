"use client";

import { ExternalLink, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

import FieldInput, { type RecordValue } from "@/components/admin/FieldInput";
import { saveContentAction, type ActionState } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import type { CollectionSchema, Section } from "@/lib/admin/fields";
import { cn } from "@/lib/utils";

/**
 * ویرایشگر یک رکورد محتوا.
 *
 * فرم از توصیف مجموعه ساخته می‌شود، پس همین کامپوننت هم محصول با نُه بخش و
 * چهار سطح تودرتو را می‌سازد و هم قطعه یدکی با پنج فیلد.
 *
 * کل رکورد در state می‌ماند و هنگام ذخیره به‌صورت یک JSON در فیلد `payload`
 * ارسال می‌شود. برای آرایه‌ای از اشیاء که خودش آرایه دارد (گروه مشخصات ←
 * مشخصه‌ها)، نام‌گذاری تودرتوی FormData هم نوشتنش شکننده است و هم خواندنش.
 */
export default function RecordEditor({
  schema,
  sections,
  slug,
  initial,
  published,
  isNew,
  publicPath,
}: {
  schema: Pick<
    CollectionSchema,
    "key" | "title" | "singular" | "slugLabel" | "slugHint" | "publishable"
  >;
  sections: Section[];
  slug: string;
  initial: RecordValue;
  published: boolean;
  isNew: boolean;
  publicPath?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(saveContentAction, {});
  const [record, setRecord] = useState<RecordValue>(initial);
  const [slugValue, setSlugValue] = useState(slug);
  const [isPublished, setIsPublished] = useState(published);
  const router = useRouter();

  // رکورد تازه زیر شناسه جدیدش ذخیره شده؛ ماندن روی /new یعنی ذخیره بعدی
  // یک رکورد دوم می‌سازد.
  useEffect(() => {
    if (state.ok && state.slug && state.slug !== slug) {
      router.replace(`/admin/c/${schema.key}/${encodeURIComponent(state.slug)}`);
    }
  }, [state, slug, schema.key, router]);

  const main = sections.filter((s) => !s.side);
  const side = sections.filter((s) => s.side);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-12">
      <input type="hidden" name="collection" value={schema.key} />
      <input type="hidden" name="original" value={isNew ? "" : slug} />
      <input type="hidden" name="payload" value={JSON.stringify(record)} />
      {schema.publishable && isPublished && <input type="hidden" name="published" value="on" />}

      <div className="space-y-6 lg:col-span-8">
        <Card className="space-y-5 p-6">
          <h2 className="font-bold">شناسه</h2>
          <Field label={schema.slugLabel} hint={schema.slugHint} required>
            <Input
              name="slug"
              value={slugValue}
              dir="ltr"
              className="num"
              onChange={(e) => setSlugValue(e.target.value)}
            />
          </Field>
          {!isNew && slugValue !== slug && (
            <p className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-xs leading-6 text-accent-2">
              تغییر شناسه، نشانی صفحه عمومی را عوض می‌کند و لینک‌های قبلی به آن ۴۰۴ می‌دهند.
              ارجاع‌های دیگر محتوا به این رکورد هم باید دستی به‌روز شوند.
            </p>
          )}
        </Card>

        {main.map((section) => (
          <SectionCard key={section.title} section={section} record={record} onChange={setRecord} />
        ))}
      </div>

      <div className="space-y-6 lg:col-span-4">
        {schema.publishable && (
          <Card className="space-y-4 p-6">
            <h2 className="font-bold">انتشار</h2>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="size-4 shrink-0 accent-accent"
              />
              در سایت نمایش داده شود
            </label>
            <p className="text-xs leading-6 text-muted">
              رکورد پیش‌نویس از فهرست‌ها، جستجو، منو و مشاور حذف می‌شود و صفحه‌اش ۴۰۴ می‌دهد.
            </p>
            {publicPath && !isNew && (
              <Link
                href={publicPath}
                target="_blank"
                className="flex items-center gap-1.5 text-xs text-accent"
              >
                <ExternalLink className="size-3.5" aria-hidden />
                دیدن در سایت
              </Link>
            )}
          </Card>
        )}

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
            {pending ? "در حال ذخیره…" : isNew ? `ساخت ${schema.singular}` : "ذخیره تغییرات"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function SectionCard({
  section,
  record,
  onChange,
}: {
  section: Section;
  record: RecordValue;
  onChange: (next: RecordValue) => void;
}) {
  return (
    <Card className="p-6">
      <h2 className="font-bold">{section.title}</h2>
      {section.hint && <p className="mt-2 text-xs leading-6 text-muted">{section.hint}</p>}

      <div className={cn("mt-5 grid gap-5", !section.side && "sm:grid-cols-2")}>
        {section.fields.map((field) => (
          <div
            key={field.name}
            className={
              !section.side && (field.wide || field.kind === "repeater")
                ? "sm:col-span-2"
                : undefined
            }
          >
            <FieldInput field={field} record={record} onChange={onChange} />
          </div>
        ))}
      </div>
    </Card>
  );
}
