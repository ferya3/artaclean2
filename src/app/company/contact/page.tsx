import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: "راه‌های تماس با واحد فروش، خدمات پس از فروش و قطعات یدکی.",
};

const CHANNELS = [
  {
    title: "فروش و مشاوره پیش از خرید",
    body: "انتخاب دستگاه، بازدید سایت، دمو و پیش‌فاکتور.",
    phone: "021-0000 0000",
    email: "sales@example.com",
    cta: { label: "درخواست پیش‌فاکتور", href: "/quote" },
  },
  {
    title: "خدمات پس از فروش",
    body: "خرابی، سرویس دوره‌ای و اعزام تکنسین.",
    phone: "021-0000 0001",
    email: "service@example.com",
    cta: { label: "درخواست سرویس", href: "/services/repair" },
  },
  {
    title: "قطعات یدکی",
    body: "استعلام شماره فنی، موجودی و زمان تأمین.",
    phone: "021-0000 0002",
    email: "parts@example.com",
    cta: { label: "جستجوی قطعه", href: "/spare-parts" },
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="تماس"
        title="تماس با ما"
        lead="بسته به اینکه دنبال خرید، سرویس یا قطعه هستید، مستقیم با همان واحد تماس بگیرید."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "تماس با ما" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 lg:grid-cols-3">
        {CHANNELS.map((c) => (
          <div key={c.title} className="card flex flex-col p-6">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{c.body}</p>
            <div className="mt-4 space-y-1 text-sm">
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="num block" dir="ltr">
                {c.phone}
              </a>
              <a href={`mailto:${c.email}`} className="block text-muted hover:text-ink" dir="ltr">
                {c.email}
              </a>
            </div>
            <Link href={c.cta.href} className="btn-ghost mt-5">
              {c.cta.label}
            </Link>
          </div>
        ))}
      </div>

      <div className="shell pb-16">
        <div className="card grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">دفتر مرکزی</p>
            <p className="text-sm leading-7 text-muted">
              تهران، جاده مخصوص کرج — نمایشگاه دائمی تجهیزات و انبار قطعات.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-2">ساعات کاری</p>
            <p className="text-sm leading-7 text-muted">
              شنبه تا چهارشنبه ۸:۰۰ تا ۱۷:۰۰ · پنجشنبه ۸:۰۰ تا ۱۳:۰۰
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
