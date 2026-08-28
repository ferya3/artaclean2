import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "خدمات",
  description:
    "نصب و راه‌اندازی، سرویس دوره‌ای، تعمیرات، قطعات یدکی، آموزش اپراتور، اجاره دستگاه و گارانتی تجهیزات نظافت صنعتی.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="خدمات"
        title="خدمات پیش و پس از فروش"
        lead="برای تجهیزات صنعتی، خدمات پس از فروش بخشی از فروش است. دستگاهی که قطعه و سرویسش تأمین نشود، سرمایه خوابیده است."
      >
        <Link href="/quote" className="btn-accent">
          درخواست خدمات
        </Link>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "خدمات" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="card group flex flex-col p-6 hover:shadow-card">
            <p className="eyebrow">{s.latin}</p>
            <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">{s.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{s.blurb}</p>
            <ul className="mt-4 space-y-1 border-t border-line pt-4 text-xs text-muted">
              {s.bullets.slice(0, 3).map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </>
  );
}
