import type { Metadata } from "next";
import { Suspense } from "react";

import PartsFinder from "@/components/parts/PartsFinder";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "قطعات یدکی",
  description:
    "جستجوی قطعات یدکی تجهیزات نظافت صنعتی بر اساس مدل دستگاه یا شماره فنی — برس، پد، تیغه لاستیکی، فیلتر، باتری و شیلنگ.",
};

type Search = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SparePartsPage({ searchParams }: Search) {
  const sp = await searchParams;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q;

  return (
    <>
      <PageHeader
        eyebrow="قطعات یدکی"
        title="قطعه را با مدل دستگاه یا شماره فنی پیدا کنید"
        lead="کاربر قطعه، از مرور دسته‌بندی شروع نمی‌کند؛ از پلاک دستگاه شروع می‌کند. مسیر جستجو را هم بر همین اساس چیده‌ایم."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "قطعات یدکی" }]} />
      </div>

      <div className="shell pb-16">
        <Suspense fallback={<div className="py-20 text-center text-sm text-muted">در حال بارگذاری…</div>}>
          <PartsFinder initialQuery={q ?? ""} />
        </Suspense>
      </div>
    </>
  );
}
