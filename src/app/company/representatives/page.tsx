import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "نمایندگی‌ها و مراکز خدمات",
  description: "دفاتر فروش و مراکز خدمات پس از فروش تجهیزات نظافت صنعتی در شهرهای مختلف.",
};

const OFFICES = [
  {
    city: "تهران",
    role: "دفتر مرکزی و انبار قطعات",
    address: "تهران، جاده مخصوص کرج",
    phone: "021-0000 0000",
    services: ["فروش", "قطعات", "تعمیرگاه مرکزی", "آموزش"],
  },
  {
    city: "اصفهان",
    role: "دفتر فروش و خدمات",
    address: "اصفهان، شهرک صنعتی امیرکبیر",
    phone: "031-0000 0000",
    services: ["فروش", "سرویس در محل", "قطعات پرگردش"],
  },
  {
    city: "مشهد",
    role: "دفتر فروش و خدمات",
    address: "مشهد، شهرک صنعتی توس",
    phone: "051-0000 0000",
    services: ["فروش", "سرویس در محل"],
  },
  {
    city: "تبریز",
    role: "نمایندگی",
    address: "تبریز، شهرک صنعتی غرب",
    phone: "041-0000 0000",
    services: ["فروش", "سرویس در محل"],
  },
  {
    city: "شیراز",
    role: "نمایندگی",
    address: "شیراز، شهرک صنعتی بزرگ",
    phone: "071-0000 0000",
    services: ["فروش", "قطعات پرگردش"],
  },
  {
    city: "اهواز",
    role: "نمایندگی خدمات",
    address: "اهواز، منطقه صنعتی",
    phone: "061-0000 0000",
    services: ["سرویس در محل", "تعمیرات"],
  },
];

export default function RepresentativesPage() {
  return (
    <>
      <PageHeader
        eyebrow="شبکه خدمات"
        title="نمایندگی‌ها و مراکز خدمات"
        lead="برای تجهیزات صنعتی، فاصله تا نزدیک‌ترین تکنسین یکی از معیارهای واقعی خرید است."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "نمایندگی‌ها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {OFFICES.map((o) => (
          <div key={o.city} className="card p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold">{o.city}</h2>
              <span className="text-xs text-muted">{o.role}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{o.address}</p>
            <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="num mt-2 block text-sm" dir="ltr">
              {o.phone}
            </a>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {o.services.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="shell pb-16">
        <div className="card flex flex-wrap items-center justify-between gap-4 bg-canvas p-6">
          <p className="max-w-xl text-sm leading-7">
            در شهر شما نماینده نداریم؟ سرویس در محل با اعزام تکنسین از نزدیک‌ترین مرکز انجام می‌شود.
          </p>
          <Link href="/company/contact" className="btn-primary">
            تماس با ما
          </Link>
        </div>
      </div>
    </>
  );
}
