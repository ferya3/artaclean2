import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { industries } from "@/lib/data/industries";
import { fa } from "@/lib/format";

export const metadata: Metadata = {
  title: "راهکارهای نظافت صنعتی بر اساس صنعت",
  description:
    "راهکار نظافت کارخانه، انبار، بیمارستان، هتل، مرکز خرید، صنایع غذایی، خودروسازی و پروژه‌های ساختمانی — از مسئله تا دستگاه.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="راهکارها"
        title="راهکار نظافت بر اساس صنعت"
        lead="کاربر صنعتی معمولاً با نام دستگاه شروع نمی‌کند؛ با مسئله شروع می‌کند. اینجا از مسئله به راهکار و بعد به دستگاه می‌رسیم."
      >
        <Link href="/advisor" className="btn-accent">
          پیدا کردن دستگاه مناسب
        </Link>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "راهکارها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((i) => (
          <Link key={i.slug} href={`/solutions/${i.slug}`} className="card group flex flex-col p-6 hover:shadow-card">
            <p className="eyebrow">{i.latin}</p>
            <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">{i.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{i.blurb}</p>
            <ul className="mt-4 space-y-1 border-t border-line pt-4 text-xs text-muted">
              {i.problems.slice(0, 3).map((p) => (
                <li key={p.key}>• {p.title}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              {fa(i.recommendedCategories.length)} دسته تجهیزات پیشنهادی
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
