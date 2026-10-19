import type { Metadata } from "next";

import Advisor from "@/components/advisor/Advisor";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import type { AdvisorAnswers } from "@/lib/advisor";
import { advise } from "@/lib/actions/advisor";
import { getPage } from "@/lib/content";
import { areaLabels, dirtLabels, frequencyLabels, surfaceLabels } from "@/lib/data/taxonomy";
import type { AreaBand, DirtKind, FrequencyBand, SurfaceKind } from "@/lib/types";

export function generateMetadata(): Metadata {
  const page = getPage("advisor");
  return { title: page.metaTitle, description: page.metaDescription };
}

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const one = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export default async function AdvisorPage({ searchParams }: Search) {
  const sp = await searchParams;

  // ورودی از URL می‌آید (لینک جستجو، Hero، یا اشتراک‌گذاری) و اعتبارسنجی می‌شود
  // تا مقدار نامعتبر باعث خطای رندر نشود.
  const surface = one(sp.surface);
  const dirt = one(sp.dirt);
  const area = one(sp.area);
  const frequency = one(sp.frequency);

  const initial: AdvisorAnswers = {
    surface: surface && surface in surfaceLabels ? (surface as SurfaceKind) : undefined,
    dirt: dirt && dirt in dirtLabels ? (dirt as DirtKind) : undefined,
    area: area && area in areaLabels ? (area as AreaBand) : undefined,
    frequency: frequency && frequency in frequencyLabels ? (frequency as FrequencyBand) : undefined,
  };

  const page = getPage("advisor");

  // نخستین نتیجه همین‌جا حساب می‌شود تا لینکِ از پیش پاسخ‌دار (از جست‌وجو
  // یا اشتراک‌گذاری) بدون انتظار، فهرست را نشان دهد.
  const initialAdvice = await advise(initial);

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "پیدا کردن دستگاه" }]} />
      </div>

      <div className="shell pb-16">
        <Advisor initial={initial} initialAdvice={initialAdvice} />
      </div>
    </>
  );
}
