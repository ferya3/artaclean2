import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Plus, Search } from "lucide-react";
import { notFound } from "next/navigation";

import { moveContentAction, togglePublishedAction } from "@/app/(admin)/admin/actions";
import AdminLink from "@/components/admin/AdminLink";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getSchema } from "@/lib/admin/schemas";
import { listSummaries } from "@/lib/db/content";
import { fa } from "@/lib/format";
import { normalize } from "@/lib/search";
import { cn } from "@/lib/utils";

/** تعداد ردیف در هر صفحه — بالاتر از این، هم DOM و هم payload سنگین می‌شود. */
const PER_PAGE = 50;

type Params = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function CollectionListPage({ params, searchParams }: Params) {
  const { collection } = await params;
  const sp = await searchParams;
  const schema = getSchema(collection);
  if (!schema) notFound();

  // فهرست فقط به عنوان و زیرعنوان نیاز دارد؛ بدنه کامل رکوردها خوانده
  // نمی‌شود تا صفحه با رشد کاتالوگ کند نشود.
  const fields = [schema.titleField, schema.subtitleField].filter(
    (f): f is string => Boolean(f),
  );
  const all = listSummaries(collection, fields);

  const query = (one(sp.q) ?? "").trim();
  const needle = normalize(query);
  const filtered = needle
    ? all.filter((row) =>
        normalize([row.slug, ...row.values.filter(Boolean)].join(" ")).includes(needle),
      )
    : all;

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(one(sp.page) ?? 1) || 1));
  const rows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ترتیب دستی فقط وقتی معنا دارد که کل فهرست دیده شود؛ با فیلتر یا
  // صفحه‌بندی، «یک پله بالا» نسبت به چه چیزی؟
  const orderable = schema.orderable && !needle && pages === 1;

  const pageHref = (n: number) => {
    const qs = new URLSearchParams();
    if (query) qs.set("q", query);
    if (n > 1) qs.set("page", String(n));
    const s = qs.toString();
    return `/admin/c/${collection}${s ? `?${s}` : ""}`;
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
        <AdminLink
          href={`/admin/c/${collection}/new`}
          className={buttonVariants({ variant: "accent", size: "sm" })}
        >
          <Plus className="size-4" aria-hidden />
          افزودن {schema.singular}
        </AdminLink>
      </div>

      {all.length > 20 && (
        <form method="get" className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted"
              aria-hidden
            />
            <input
              name="q"
              defaultValue={query}
              placeholder={`جستجو در ${schema.title}…`}
              className="w-full rounded-xl border border-line bg-surface py-3 pe-3.5 ps-10 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <button type="submit" className={buttonVariants({ variant: "outline", size: "sm" })}>
            جستجو
          </button>
          {query && (
            <AdminLink
              href={`/admin/c/${collection}`}
              className={buttonVariants({ variant: "quiet", size: "sm" })}
            >
              پاک کردن
            </AdminLink>
          )}
        </form>
      )}

      {rows.length === 0 ? (
        <Card className="mt-8 px-6 py-16 text-center">
          <p className="font-semibold">{needle ? "چیزی پیدا نشد" : "هنوز موردی ثبت نشده است"}</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
            {needle
              ? "عبارت دیگری را امتحان کنید یا فیلتر را پاک کنید."
              : `با دکمه «افزودن ${schema.singular}» نخستین مورد را بسازید.`}
          </p>
        </Card>
      ) : (
        <Card className="mt-6 overflow-hidden p-0">
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
                  {orderable && (
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
                    <AdminLink href={editHref} className="block truncate font-medium hover:text-accent">
                      {row.values[0] || row.slug}
                    </AdminLink>
                    <span className="num mt-0.5 block truncate text-[11px] text-muted" dir="ltr">
                      {schema.subtitleField && row.values[1]
                        ? `${row.slug} · ${row.values[1]}`
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
                    <AdminLink
                      href={editHref}
                      className="rounded-lg border border-line p-2 text-muted transition-colors hover:border-ink/30 hover:text-ink"
                      aria-label="ویرایش"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </AdminLink>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          <span className="num">{fa(filtered.length)}</span> مورد
          {needle && ` از ${fa(all.length)}`}
          {orderable && " — ترتیب این فهرست، همان ترتیب نمایش در سایت است."}
          {schema.orderable && !orderable && " — برای تغییر ترتیب، جستجو را پاک کنید."}
        </p>

        {pages > 1 && (
          <div className="flex items-center gap-1.5">
            <PageLink href={pageHref(page - 1)} disabled={page === 1} label="قبلی" />
            <span className="num text-xs text-muted">
              {fa(page)} / {fa(pages)}
            </span>
            <PageLink href={pageHref(page + 1)} disabled={page === pages} label="بعدی" />
          </div>
        )}
      </div>
    </>
  );
}

function PageLink({ href, disabled, label }: { href: string; disabled: boolean; label: string }) {
  if (disabled) {
    return (
      <span className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted/40">
        {label}
      </span>
    );
  }
  return (
    <AdminLink
      href={href}
      className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink"
    >
      {label}
    </AdminLink>
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
