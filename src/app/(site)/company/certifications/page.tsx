import type { Metadata } from "next";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "گواهی‌نامه‌ها و استانداردها",
  description: "استانداردها و گواهی‌نامه‌های مرتبط با تجهیزات نظافت صنعتی و خدمات پس از فروش.",
};

const CERTS = [
  {
    title: "CE — انطباق با الزامات اروپا",
    body: "دستگاه‌های وارداتی با علامت CE و پرونده فنی مربوطه عرضه می‌شوند؛ کپی گواهی همراه هر دستگاه تحویل می‌شود.",
  },
  {
    title: "ATEX — تجهیزات محیط قابل انفجار",
    body: "مدل‌های ضدانفجار با تعیین زون (۲۰/۲۱/۲۲) و گواهی متناسب عرضه می‌شوند. انتخاب زون بر عهده واحد HSE سایت است.",
  },
  {
    title: "ISO 9001 — سیستم مدیریت کیفیت",
    body: "فرآیند فروش، نصب و خدمات پس از فروش مطابق رویه‌های مستند اجرا و ممیزی می‌شود.",
  },
  {
    title: "IP — درجه حفاظت",
    body: "درجه IP هر دستگاه در دیتاشیت آمده است؛ برای محیط‌های شست‌وشوی آبی این عدد تعیین‌کننده است.",
  },
  {
    title: "تراز صدا",
    body: "تراز صدای اعلام‌شده مطابق روش استاندارد اندازه‌گیری شده و در مشخصات هر مدل درج شده است.",
  },
  {
    title: "MSDS مواد شوینده",
    body: "برای هر ماده شوینده، برگه اطلاعات ایمنی و نسبت رقت مجاز ارائه می‌شود.",
  },
];

export default function CertificationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="کیفیت و ایمنی"
        title="گواهی‌نامه‌ها و استانداردها"
        lead="در خرید صنعتی، گواهی‌نامه تزئین نیست؛ در ممیزی و بازرسی از شما خواسته می‌شود."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "گواهی‌نامه‌ها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {CERTS.map((c) => (
          <div key={c.title} className="card p-6">
            <h2 className="font-semibold">{c.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{c.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
