import AdminLink from "@/components/admin/AdminLink";

import { updateQuoteStatusAction } from "@/app/(admin)/admin/actions";
import { Card } from "@/components/ui/card";
import { industries } from "@/lib/data/industries";
import { areaLabels, dirtLabels, surfaceLabels } from "@/lib/data/taxonomy";
import { listQuotes, quoteCounts } from "@/lib/db/queries";
import { fa } from "@/lib/format";
import type { AreaBand, DirtKind, SurfaceKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUSES = [
  { key: "all", label: "همه" },
  { key: "new", label: "جدید" },
  { key: "contacted", label: "تماس گرفته شد" },
  { key: "quoted", label: "پیش‌فاکتور ارسال شد" },
  { key: "won", label: "فروش انجام شد" },
  { key: "lost", label: "منتفی" },
];

type Search = { searchParams: Promise<{ status?: string }> };

export default async function AdminQuotesPage({ searchParams }: Search) {
  const { status = "all" } = await searchParams;
  const quotes = listQuotes(status);
  const counts = quoteCounts();

  return (
    <>
      <h1 className="text-2xl font-black">درخواست‌های پیش‌فاکتور</h1>
      <p className="mt-2 text-sm text-muted">
        هر فرم ثبت‌شده در سایت، با شرایط سایت مشتری، اینجا می‌آید.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUSES.map((s) => {
          const count = s.key === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : (counts[s.key] ?? 0);
          return (
            <AdminLink
              key={s.key}
              href={`/admin/quotes?status=${s.key}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                status === s.key
                  ? "border-ink bg-ink text-white"
                  : "border-line bg-surface text-muted hover:border-ink/30 hover:text-ink",
              )}
            >
              {s.label}
              <span className="ms-2 text-xs opacity-60">
                <span className="num">{fa(count)}</span>
              </span>
            </AdminLink>
          );
        })}
      </div>

      {quotes.length === 0 ? (
        <Card className="mt-6 px-6 py-16 text-center">
          <p className="font-semibold">درخواستی با این وضعیت نیست</p>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {quotes.map((q) => {
            const industry = industries.find((i) => i.slug === q.industry);
            return (
              <Card key={q.id} className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold">{q.company}</h2>
                    <p className="mt-1 text-sm text-muted">
                      {q.contact_name}
                      {" · "}
                      <a href={`tel:${q.phone}`} className="num text-ink" dir="ltr">
                        {q.phone}
                      </a>
                      {q.email && (
                        <>
                          {" · "}
                          <a href={`mailto:${q.email}`} className="text-ink" dir="ltr">
                            {q.email}
                          </a>
                        </>
                      )}
                    </p>
                  </div>

                  <form action={updateQuoteStatusAction} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={q.id} />
                    <select
                      name="status"
                      defaultValue={q.status}
                      className="rounded-xl border border-line bg-surface px-3 py-2 text-sm"
                    >
                      {STATUSES.filter((s) => s.key !== "all").map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-xl border border-line px-3 py-2 text-xs text-muted transition-colors hover:border-ink/30 hover:text-ink"
                    >
                      ثبت
                    </button>
                  </form>
                </div>

                <dl className="mt-5 grid gap-x-8 gap-y-3 border-t border-line pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["صنعت", industry?.name ?? q.industry],
                    ["سطح", q.surface ? surfaceLabels[q.surface as SurfaceKind] : null],
                    ["آلودگی", q.dirt ? dirtLabels[q.dirt as DirtKind] : null],
                    ["متراژ", q.area ? areaLabels[q.area as AreaBand] : null],
                    ["شهر", q.site_city],
                    ["دستگاه مدنظر", q.interest],
                    ["تعداد", q.quantity ? fa(q.quantity) : null],
                    ["زمان خرید", q.timeline],
                    ["بودجه", q.budget],
                  ]
                    .filter(([, v]) => v)
                    .map(([label, value]) => (
                      <div key={label as string}>
                        <dt className="text-[11px] text-muted">{label}</dt>
                        <dd className="mt-0.5">{value}</dd>
                      </div>
                    ))}
                </dl>

                {(q.needs_training === 1 || q.needs_service === 1) && (
                  <p className="mt-4 flex gap-2 text-xs">
                    {q.needs_training === 1 && (
                      <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                        آموزش اپراتور
                      </span>
                    )}
                    {q.needs_service === 1 && (
                      <span className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">
                        قرارداد سرویس
                      </span>
                    )}
                  </p>
                )}

                {q.notes && (
                  <p className="mt-4 rounded-xl bg-canvas p-4 text-sm leading-7 text-muted">
                    {q.notes}
                  </p>
                )}

                <p className="num mt-4 text-xs text-muted">{q.created_at}</p>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
