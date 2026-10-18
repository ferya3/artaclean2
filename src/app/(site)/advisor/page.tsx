import type { Metadata } from "next";

import Advisor from "@/components/advisor/Advisor";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import type { AdvisorAnswers } from "@/lib/advisor";
import { areaLabels, dirtLabels, frequencyLabels, surfaceLabels } from "@/lib/data/taxonomy";
import type { AreaBand, DirtKind, FrequencyBand, SurfaceKind } from "@/lib/types";

export const metadata: Metadata = {
  title: "پیدا کردن دستگاه مناسب",
  description:
    "با چهار پرسش درباره سطح، آلودگی، متراژ و تناوب استفاده، دستگاه‌های مناسب سایت شما را به‌همراه دلیل هر پیشنهاد فهرست می‌کنیم.",
};

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

  return (
    <>
      <PageHeader
        eyebrow="مشاور انتخاب دستگاه"
        title="دستگاه مورد نیازتان را پیدا کنید"
        lead="لازم نیست مدل دستگاه را بدانید. مسئله‌تان را بگویید — سطح، آلودگی، متراژ و تناوب — تا از مسئله به راهکار و بعد به دستگاه برسیم."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "پیدا کردن دستگاه" }]} />
      </div>

      <div className="shell pb-16">
        <Advisor initial={initial} />
      </div>
    </>
  );
}
