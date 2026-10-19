import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  moveContentAction,
  togglePublishedAction,
} from "@/app/(admin)/admin/actions";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getSchema } from "@/lib/admin/schemas";
import { listRows } from "@/lib/db/content";
import { fa } from "@/lib/format";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ collection: string }> };

export default async function CollectionListPage({ params }: Params) {
  const { collection } = await params;
  const schema = getSchema(collection);
  if (!schema) notFound();

  const rows = listRows(collection, true);

  const textOf = (data: unknown, key?: string): string => {
    if (!key) return "";
    const value = (data as Record<string, unknown>)?.[key];
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    return "";
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">{schema.title}</h1>
          {schema.blurb && (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{schema.blurb}</p>
          )}
        </div>
        <Link
          href={`/admin/c/${collection}/new`}
          className={buttonVariants({ variant: "accent", size: "sm" })}
        >
          <Plus className="size-4" aria-hidden />
          افزودن {schema.singular}
        </Link>
      </div>

      {rows.length === 0 ? (
        <Card className="mt-8 px-6 py-16 text-center">
          <p className="font-semibold">هنوز موردی ثبت نشده است</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
            با دکمه «افزودن {schema.singular}» نخستین مورد را بسازید.
          </p>
        </Card>
      ) : (
        <Card className="mt-8 overflow-hidden p-0">
          <ul className="divide-y divide-line">
            {rows.map((row, index) => {
              const editHref = `/admin/c/${collection}/${encodeURIComponent(row.slug)}`;
              return (
                <li
                  key={row.slug}
                  className={cn(
                    "flex flex-wrap items-center gap-3 px-5 py-3.5",
                    !row.published && "bg-canvas",
                  )}
                >
                  {schema.orderable && (
                    <div className="flex shrink-0 flex-col">
                      <OrderButton
                        collection={collection}
                        slug={row.slug}
                        direction={-1}
                        disabled={index === 0}
                      />
                      <OrderButton
                        collection={collection}
                        slug={row.slug}
                        direction={1}
                        disabled={index === rows.length - 1}
                      />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <Link href={editHref} className="block truncate font-medium hover:text-accent">
                      {textOf(row.data, schema.titleField) || row.slug}
                    </Link>
                    <span className="num mt-0.5 block truncate text-[11px] text-muted" dir="ltr">
                      {schema.subtitleField
                        ? `${row.slug} · ${textOf(row.data, schema.subtitleField)}`
                        : row.slug}
                    </span>
                  </div>

                  {schema.publishable && !row.published && (
                    <span className="shrink-0 rounded-full bg-ink/8 px-2.5 py-1 text-[11px] text-muted">
                      پیش‌نویس
                    </span>
                  )}

                  <div className="flex shrink-0 items-center gap-1.5">
                    {schema.publishable && (
                      <form action={togglePublishedAction}>
                        <input type="hidden" name="collection" value={collection} />
                        <input type="hidden" name="slug" value={row.slug} />
                        <button
                          type="submit"
                          title={row.published ? "تبدیل به پیش‌نویس" : "انتشار"}
                          aria-label={row.published ? "تبدیل به پیش‌نویس" : "انتشار"}
                          className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-ink/30 hover:text-ink"
                        >
                          {row.published ? (
                            <Eye className="size-4" aria-hidden />
                          ) : (
                            <EyeOff className="size-4" aria-hidden />
                          )}
                        </button>
                      </form>
                    )}
                    <Link
                      href={editHref}
                      className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-ink/30 hover:text-ink"
                      aria-label="ویرایش"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <p className="mt-4 text-xs text-muted">
        <span className="num">{fa(rows.length)}</span> مورد
        {schema.orderable && " — ترتیب این فهرست، همان ترتیب نمایش در سایت است."}
      </p>
    </>
  );
}

function OrderButton({
  collection,
  slug,
  direction,
  disabled,
}: {
  collection: string;
  slug: string;
  direction: -1 | 1;
  disabled: boolean;
}) {
  const Icon = direction === -1 ? ChevronUp : ChevronDown;
  return (
    <form action={moveContentAction}>
      <input type="hidden" name="collection" value={collection} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={direction === -1 ? "انتقال به بالا" : "انتقال به پایین"}
        className="block text-muted transition-colors hover:text-ink disabled:opacity-25"
      >
        <Icon className="size-4" aria-hidden />
      </button>
    </form>
  );
}
