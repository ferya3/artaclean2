import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { areaLabels, dirtLabels, surfaceLabels } from "@/lib/data/taxonomy";
import { fa } from "@/lib/format";
import { extractIntent, groupHits, groupLabels, search } from "@/lib/search";

export const metadata: Metadata = {
  title: "جستجو",
  robots: { index: false },
};

type Search = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: Search) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "";
  const hits = q ? search(q) : [];
  const groups = groupHits(hits);
  const intent = q ? extractIntent(q) : {};
  const hasIntent = Boolean(intent.surface || intent.dirt || intent.area);

  const advisorParams = new URLSearchParams();
  if (intent.surface) advisorParams.set("surface", intent.surface);
  if (intent.dirt) advisorParams.set("dirt", intent.dirt);
  if (intent.area) advisorParams.set("area", intent.area);

  return (
    <>
      <PageHeader
        eyebrow="جستجو"
        title={q ? `نتایج برای «${q}»` : "جستجو"}
        lead={
          q
            ? `${fa(hits.length)} نتیجه در محصولات، راهکارها، قطعات، خدمات و مقالات.`
            : "نام دستگاه، شماره فنی قطعه، یا مسئله‌تان را بنویسید."
        }
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "جستجو" }]} />
      </div>

      <div className="shell pb-16">
        {hasIntent && (
          <div className="card mb-8 flex flex-wrap items-center justify-between gap-4 bg-accent-soft/60 p-6">
            <div>
              <p className="font-semibold">از جمله شما این را فهمیدیم</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {intent.surface && <span className="chip bg-surface">{surfaceLabels[intent.surface]}</span>}
                {intent.dirt && <span className="chip bg-surface">{dirtLabels[intent.dirt]}</span>}
                {intent.area && <span className="chip bg-surface">{areaLabels[intent.area]}</span>}
              </div>
            </div>
            <Link href={`/advisor?${advisorParams.toString()}`} className="btn-accent">
              دیدن دستگاه‌های پیشنهادی
            </Link>
          </div>
        )}

        {q && hits.length === 0 && (
          <div className="card px-6 py-16 text-center">
            <p className="text-lg font-semibold">نتیجه‌ای پیدا نشد</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
              به‌جای نام دقیق دستگاه، مسئله‌تان را بنویسید — مثلاً «روغن روی کف کارخانه ۵۰۰۰ متر».
            </p>
            <Link href="/advisor" className="btn-accent mt-6">
              مشاور انتخاب دستگاه
            </Link>
          </div>
        )}

        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.group}>
              <h2 className="mb-4 border-b border-line pb-3 text-lg font-bold">
                {groupLabels[group.group]}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((hit) => (
                  <li key={hit.href + hit.title}>
                    <Link href={hit.href} className="card block h-full p-5 hover:shadow-card">
                      <p className="font-medium">{hit.title}</p>
                      <p className="mt-1.5 text-sm leading-6 text-muted">{hit.subtitle}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
