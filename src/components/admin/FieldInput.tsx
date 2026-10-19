"use client";

import { ChevronDown, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import ImagePicker from "@/components/admin/ImagePicker";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import type { Field as FieldDef } from "@/lib/admin/fields";
import { cn } from "@/lib/utils";

/**
 * رندر یک فیلد از توصیف.
 *
 * بازگشتی است چون repeater خودش فیلد دارد و می‌تواند repeater داخلی داشته
 * باشد — «گروه مشخصات ← مشخصه‌ها» دو سطح است و ستون‌های فوتر هم.
 *
 * هر فیلد کنترل‌شده است و مقدار را با onChange بالا می‌فرستد؛ کل رکورد در
 * بالاترین کامپوننت نگه داشته می‌شود و هنگام ذخیره به‌صورت یک JSON ارسال
 * می‌شود. دلیلش شکل داده است: اسم‌های تودرتوی FormData برای آرایه‌ای از
 * اشیاء که خودش آرایه دارد، هم نوشتنش شکننده است و هم خواندنش.
 */

export type RecordValue = Record<string, unknown>;

const asString = (v: unknown): string => (typeof v === "string" ? v : "");
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const asStrings = (v: unknown): string[] =>
  asArray(v).filter((x): x is string => typeof x === "string");

/** خواندن و نوشتن مسیر نقطه‌دار مثل `facets.areaMax`. */
export function readPath(record: RecordValue, path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => {
    if (!node || typeof node !== "object") return undefined;
    return (node as Record<string, unknown>)[key];
  }, record);
}

export function writePath(record: RecordValue, path: string, value: unknown): RecordValue {
  const keys = path.split(".");
  if (keys.length === 1) return { ...record, [keys[0]]: value };

  const [head, ...rest] = keys;
  const current = record[head];
  const child = current && typeof current === "object" && !Array.isArray(current)
    ? (current as RecordValue)
    : {};
  return { ...record, [head]: writePath(child, rest.join("."), value) };
}

export default function FieldInput({
  field,
  record,
  onChange,
}: {
  field: FieldDef;
  record: RecordValue;
  onChange: (next: RecordValue) => void;
}) {
  const value = readPath(record, field.name);
  const set = (next: unknown) => onChange(writePath(record, field.name, next));

  switch (field.kind) {
    case "text":
      return (
        <Field label={field.label} hint={field.hint} required={field.required}>
          <Input
            value={asString(value)}
            dir={field.dir}
            placeholder={field.placeholder}
            className={field.dir === "ltr" ? "num" : undefined}
            onChange={(e) => set(e.target.value)}
          />
        </Field>
      );

    case "textarea":
      return (
        <Field label={field.label} hint={field.hint}>
          <Textarea
            value={asString(value)}
            rows={field.rows ?? 4}
            placeholder={field.placeholder}
            onChange={(e) => set(e.target.value)}
          />
        </Field>
      );

    case "number":
      return (
        <Field
          label={field.unit ? `${field.label} (${field.unit})` : field.label}
          hint={field.hint}
        >
          <Input
            value={typeof value === "number" ? String(value) : ""}
            inputMode="decimal"
            dir="ltr"
            className="num"
            onChange={(e) => {
              // خالی یعنی «مقدار ندارد»، نه صفر — صفر برای عرض کار معنای
              // دیگری دارد و در مقایسه هم متفاوت دیده می‌شود.
              const raw = e.target.value.trim();
              if (raw === "") return set(undefined);
              const parsed = Number(raw.replace(/[^\d.-]/g, ""));
              set(Number.isFinite(parsed) ? parsed : undefined);
            }}
          />
        </Field>
      );

    case "boolean":
      return (
        <label className="flex cursor-pointer items-start gap-2.5 py-1.5">
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => set(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-accent"
          />
          <span>
            <span className="block text-sm">{field.label}</span>
            {field.hint && <span className="mt-1 block text-[11px] text-muted">{field.hint}</span>}
          </span>
        </label>
      );

    case "select":
      return (
        <Field label={field.label} hint={field.hint}>
          <Select filled value={asString(value)} onChange={(e) => set(e.target.value)}>
            {(field.allowEmpty || !asString(value)) && <option value="">— انتخاب نشده —</option>}
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Field>
      );

    case "multiselect":
      return (
        <Choices
          label={field.label}
          hint={field.hint}
          options={field.options ?? []}
          selected={asStrings(value)}
          onToggle={(v) => {
            const current = asStrings(value);
            set(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
          }}
        />
      );

    case "refs":
      return (
        <RefPicker
          label={field.label}
          hint={field.hint}
          options={field.options ?? []}
          selected={asStrings(value)}
          onChange={set}
        />
      );

    case "lines":
      return (
        <Field label={field.label} hint={field.hint}>
          <Textarea
            value={asStrings(value).join("\n")}
            rows={field.rows ?? 4}
            placeholder={field.placeholder}
            onChange={(e) =>
              set(
                e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      );

    case "image":
      return (
        <ImagePicker
          label={field.label}
          hint={field.hint}
          value={asString(value)}
          onChange={set}
        />
      );

    case "repeater":
      return (
        <Repeater field={field} items={asArray(value) as RecordValue[]} onChange={set} />
      );
  }
}

/* ────────────────────────────────────────── انتخاب چندگانه */

function Choices({
  label,
  hint,
  options,
  selected,
  onToggle,
}: {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium text-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const on = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onToggle(opt.value)}
              aria-pressed={on}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                on
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-surface text-muted hover:border-ink/30 hover:text-ink",
              )}
            >
              {opt.label}
            </button>
          );
        })}
        {options.length === 0 && <span className="text-xs text-muted">گزینه‌ای موجود نیست.</span>}
      </div>
      {hint && <span className="mt-2 block text-[11px] text-muted">{hint}</span>}
    </div>
  );
}

/* ───────────────────────── انتخاب چند رکورد، با حفظ ترتیب */

function RefPicker({
  label,
  hint,
  options,
  selected,
  onChange,
}: {
  label: string;
  hint?: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [adding, setAdding] = useState("");
  const labelOf = (slug: string) => options.find((o) => o.value === slug)?.label ?? slug;
  const available = options.filter((o) => !selected.includes(o.value));

  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium text-muted">{label}</span>

      {selected.length > 0 && (
        <ul className="mb-2.5 space-y-1.5">
          {selected.map((slug, i) => (
            <li
              key={slug}
              className="flex items-center gap-2 rounded-lg border border-line bg-canvas px-2.5 py-2 text-xs"
            >
              <span className="flex-1 truncate">{labelOf(slug)}</span>
              <button
                type="button"
                onClick={() => {
                  if (i === 0) return;
                  const next = [...selected];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  onChange(next);
                }}
                disabled={i === 0}
                className="text-muted disabled:opacity-25"
                aria-label="بالا"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => {
                  if (i === selected.length - 1) return;
                  const next = [...selected];
                  [next[i], next[i + 1]] = [next[i + 1], next[i]];
                  onChange(next);
                }}
                disabled={i === selected.length - 1}
                className="text-muted disabled:opacity-25"
                aria-label="پایین"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(selected.filter((s) => s !== slug))}
                className="text-muted hover:text-accent"
                aria-label="حذف"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Select
        value={adding}
        onChange={(e) => {
          const v = e.target.value;
          if (v) onChange([...selected, v]);
          setAdding("");
        }}
      >
        <option value="">— افزودن —</option>
        {available.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>

      {hint && <span className="mt-2 block text-[11px] text-muted">{hint}</span>}
    </div>
  );
}

/* ──────────────────────────────────── فهرست اشیاء هم‌شکل */

function Repeater({
  field,
  items,
  onChange,
}: {
  field: Extract<FieldDef, { kind: "repeater" }>;
  items: RecordValue[];
  onChange: (next: RecordValue[]) => void;
}) {
  // موردِ تازه باز می‌شود و بقیه بسته می‌مانند؛ با ۱۲ مشخصه فنی، فهرست باز
  // دیگر قابل پیمایش نیست.
  const [open, setOpen] = useState<number | null>(items.length === 1 ? 0 : null);

  const update = (index: number, next: RecordValue) =>
    onChange(items.map((item, i) => (i === index ? next : item)));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpen(open === index ? target : open === target ? index : open);
  };

  const titleOf = (item: RecordValue, index: number) => {
    const raw = field.titleField ? item[field.titleField] : undefined;
    if (typeof raw === "string" && raw.trim()) return raw;
    if (typeof raw === "number") return String(raw);
    return `${field.itemLabel} ${index + 1}`;
  };

  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted">{field.label}</span>
        <button
          type="button"
          onClick={() => {
            onChange([...items, {}]);
            setOpen(items.length);
          }}
          className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-[11px] text-muted transition-colors hover:border-ink/30 hover:text-ink"
        >
          <Plus className="size-3.5" aria-hidden />
          افزودن {field.itemLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-xs text-muted">
          موردی اضافه نشده است.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item, index) => {
            const expanded = open === index;
            return (
              <li key={index} className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="flex items-center gap-1 bg-canvas px-2 py-1.5">
                  <GripVertical className="size-3.5 shrink-0 text-muted/50" aria-hidden />
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : index)}
                    aria-expanded={expanded}
                    className="flex flex-1 items-center gap-1.5 truncate px-1 py-1 text-start text-xs font-medium"
                  >
                    <ChevronDown
                      className={cn(
                        "size-3.5 shrink-0 text-muted transition-transform",
                        expanded && "rotate-180",
                      )}
                      aria-hidden
                    />
                    <span className="truncate">{titleOf(item, index)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="px-1.5 text-xs text-muted disabled:opacity-25"
                    aria-label="انتقال به بالا"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="px-1.5 text-xs text-muted disabled:opacity-25"
                    aria-label="انتقال به پایین"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(items.filter((_, i) => i !== index));
                      setOpen(null);
                    }}
                    className="px-1.5 text-muted transition-colors hover:text-accent"
                    aria-label={`حذف ${field.itemLabel}`}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                  </button>
                </div>

                {expanded && (
                  <div className="grid gap-4 p-4 sm:grid-cols-2">
                    {field.fields.map((sub) => (
                      <div
                        key={sub.name}
                        className={
                          sub.wide || sub.kind === "repeater" ? "sm:col-span-2" : undefined
                        }
                      >
                        <FieldInput
                          field={sub}
                          record={item}
                          onChange={(next) => update(index, next)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {field.hint && <p className="mt-2 text-[11px] leading-5 text-muted">{field.hint}</p>}
    </div>
  );
}
