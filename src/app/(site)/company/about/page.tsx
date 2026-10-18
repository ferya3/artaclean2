import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درباره ما",
  description: "تأمین، مشاوره و پشتیبانی تجهیزات نظافت صنعتی؛ با تمرکز بر قطعه و سرویس در داخل کشور.",
};

const PILLARS = [
  {
    title: "اول مسئله، بعد دستگاه",
    body: "پیش از پیشنهاد هر مدلی، نوع کف، آلودگی غالب، متراژ و پنجره زمانی نظافت را می‌سنجیم. دستگاه بزرگ‌تر همیشه جواب بهتر نیست.",
  },
  {
    title: "قطعه و سرویس، نه فقط فروش",
    body: "برندی را وارد می‌کنیم که بتوانیم تا ده سال قطعه‌اش را تأمین کنیم. دستگاه بدون قطعه، آهن‌پاره گران است.",
  },
  {
    title: "عدد به‌جای شعار",
    body: "پیشنهاد فنی ما شامل برآورد زمان نظافت، مصرف آب و هزینه مصرفی سالانه است تا بتوانید مقایسه کنید.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="شرکت"
        title="درباره آرتا کلین"
        lead="تأمین تجهیزات نظافت صنعتی برای صنایع، انبارها، مراکز درمانی و مجموعه‌های تجاری — با مسئولیت کامل بر سرویس و قطعه پس از فروش."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
      </div>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-lg leading-9">
            بازار تجهیزات نظافت صنعتی در ایران دو مشکل قدیمی دارد: فروش دستگاهی که اندازه سایت نیست، و
            نبود قطعه در سال دوم. ما کسب‌وکار را دور حل همین دو مسئله ساخته‌ایم.
          </p>
          <p className="mt-6 text-lg leading-9">
            هر پیشنهاد فروش با بررسی شرایط سایت شروع می‌شود و هر فروش با یک برنامه سرویس و فهرست
            مصرفی‌های سالانه تحویل داده می‌شود. اگر دستگاهی برای شرایط شما مناسب نباشد، همان را
            می‌گوییم — حتی اگر گران‌ترین گزینه فهرست‌مان باشد.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="card p-5">
                <p className="font-semibold">{p.title}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="card bg-canvas p-6">
            <p className="font-semibold">می‌خواهید ما را بسنجید؟</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              یک دستگاه را برای یک روز اجاره کنید و روی کف خودتان تست کنید. ارزان‌ترین راه برای
              نخریدن دستگاه اشتباه.
            </p>
            <Link href="/services/rental" className={cn(buttonVariants({ variant: "primary" }), "mt-4 w-full")}>
              شرایط اجاره
            </Link>
            <Link href="/company/projects" className={cn(buttonVariants({ variant: "outline" }), "mt-2 w-full")}>
              پروژه‌های اجراشده
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
