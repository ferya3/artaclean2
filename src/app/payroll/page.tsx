import type { Metadata } from "next";

import PayrollCalculator from "@/components/payroll/PayrollCalculator";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { fa } from "@/lib/format";
import { latestPayrollYear } from "@/lib/payroll/config";
import { money } from "@/lib/payroll/money";

/**
 * ابزار داخلی است، نه صفحه بازاریابی: از sitemap و منو بیرون نگه داشته
 * و برای موتور جست‌وجو noindex شده.
 */
export const metadata: Metadata = {
  title: "محاسبه حقوق و دستمزد",
  description: "کارکرد ماه را وارد کنید تا مزایا، کسورات و خالص پرداختی محاسبه شود.",
  robots: { index: false, follow: false },
};

export default function PayrollPage() {
  const y = latestPayrollYear;

  return (
    <>
      <PageHeader
        eyebrow="ابزار داخلی — حقوق و دستمزد"
        title="کارکرد را بده، حقوق را بگیر"
        lead="روز کارکرد و ساعت اضافه‌کاری را وارد کنید؛ مزد پایه، پایه سنوات، حق مسکن، بن کارگری و حق اولاد از ارقام مصوب همان سال اعمال می‌شود و بیمه و مالیات کسر می‌گردد."
        aside={
          <dl className="card-deep glass p-6 text-sm text-white">
            <p className="eyebrow-accent mb-4">ارقام پایه سال {fa(y.year)}</p>
            {[
              ["حداقل مزد روزانه", money(y.minDailyWage, "toman")],
              ["پایه سنوات روزانه", money(y.seniorityDaily, "toman")],
              ["حق مسکن ماهانه", money(y.housingMonthly, "toman")],
              ["بن کارگری ماهانه", money(y.foodMonthly, "toman")],
              ["حق اولاد (هر فرزند)", money(y.childMonthly, "toman")],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-t border-white/10 py-2.5 first:border-t-0"
              >
                <dt className="text-white/60">{label}</dt>
                <dd className="num font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "محاسبه حقوق و دستمزد" }]} />
      </div>

      <div className="shell pb-16">
        <PayrollCalculator />

        <section className="card mt-10 p-6 lg:p-8">
          <h2 className="text-lg font-bold">به‌روزرسانی ارقام سال جدید</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
            هر عددی که «قانون» تعیین می‌کند — حداقل مزد، پایه سنوات، حق مسکن، بن کارگری، حق اولاد،
            نرخ بیمه و پله‌های مالیاتی — در یک فایل جمع است:{" "}
            <code className="num rounded bg-ink/[0.06] px-1.5 py-0.5 text-xs">
              src/lib/payroll/config.ts
            </code>
            . بعد از انتشار بخشنامه مزد، فقط یک بلوک جدید به آرایه{" "}
            <code className="num rounded bg-ink/[0.06] px-1.5 py-0.5 text-xs">payrollYears</code> اضافه
            کنید؛ محاسبه‌گر خودش جدیدترین سال را پیش‌فرض می‌گیرد و سال‌های قبل برای محاسبه معوقات سر
            جای‌شان می‌مانند. فرمول‌ها در{" "}
            <code className="num rounded bg-ink/[0.06] px-1.5 py-0.5 text-xs">
              src/lib/payroll/calc.ts
            </code>{" "}
            هستند و به رابط کاربری وابسته نیستند.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">
            ارقام هر سال باید پیش از استفاده رسمی با متن بخشنامه وزارت کار و بخشنامه مالیات حقوق تطبیق
            داده شود؛ سالی که هنوز تأیید نشده با برچسب «پیش‌نویس» و هشدار نمایش داده می‌شود.
          </p>
        </section>
      </div>
    </>
  );
}
