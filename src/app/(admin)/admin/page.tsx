import { ArrowLeft, Inbox, Package, TrendingUp } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { catalogIncludingDrafts } from "@/lib/catalog";
import { listQuotes, quoteCounts } from "@/lib/db/queries";
import { fa } from "@/lib/format";

export default function AdminDashboard() {
  const products = catalogIncludingDrafts();
  const counts = quoteCounts();
  const recent = listQuotes().slice(0, 6);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const published = products.filter((p) => p.published).length;

  const stats = [
    { label: "درخواست جدید", value: counts.new ?? 0, icon: Inbox, href: "/admin/quotes?status=new" },
    { label: "کل درخواست‌ها", value: total, icon: TrendingUp, href: "/admin/quotes" },
    { label: "محصول منتشرشده", value: published, icon: Package, href: "/admin/products" },
  ];

  return (
    <>
      <h1 className="text-2xl font-black">داشبورد</h1>
      <p className="mt-2 text-sm text-muted">
        وضعیت درخواست‌های فروش و کاتالوگ، در یک نگاه.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card hover className="flex items-center gap-4 p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="num block text-2xl font-black">{fa(s.value)}</span>
                  <span className="block text-xs text-muted">{s.label}</span>
                </span>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-bold">آخرین درخواست‌ها</h2>
        <Link href="/admin/quotes" className="flex items-center gap-1 text-sm text-accent">
          همه درخواست‌ها
          <ArrowLeft className="size-4" aria-hidden />
        </Link>
      </div>

      {recent.length === 0 ? (
        <Card className="mt-4 px-6 py-14 text-center">
          <p className="font-semibold">هنوز درخواستی ثبت نشده است</p>
          <p className="mt-2 text-sm text-muted">
            فرم «درخواست پیش‌فاکتور» سایت، مستقیم در همین جدول ثبت می‌شود.
          </p>
        </Card>
      ) : (
        <Card className="mt-4 overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                <th className="px-5 py-3 text-start font-medium">شرکت</th>
                <th className="px-5 py-3 text-start font-medium">تماس</th>
                <th className="px-5 py-3 text-start font-medium">صنعت</th>
                <th className="px-5 py-3 text-start font-medium">وضعیت</th>
                <th className="px-5 py-3 text-start font-medium">تاریخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {recent.map((q) => (
                <tr key={q.id}>
                  <td className="px-5 py-3 font-medium">{q.company}</td>
                  <td className="px-5 py-3">
                    <span className="block">{q.contact_name}</span>
                    <span className="num block text-xs text-muted" dir="ltr">
                      {q.phone}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{q.industry ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-ink/6 px-2.5 py-1 text-[11px]">{q.status}</span>
                  </td>
                  <td className="num px-5 py-3 text-xs text-muted">{q.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
