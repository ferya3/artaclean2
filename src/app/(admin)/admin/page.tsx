import { ArrowLeft, Inbox, Package, Plus, Settings, TrendingUp } from "lucide-react";
import AdminLink from "@/components/admin/AdminLink";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { collectionOrder, schemas } from "@/lib/admin/schemas";
import { collectionCounts } from "@/lib/db/content";
import { listQuotes, quoteCounts } from "@/lib/db/queries";
import { fa } from "@/lib/format";

export default function AdminDashboard() {
  const counts = quoteCounts();
  const recent = listQuotes().slice(0, 6);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const contentCounts = collectionCounts();
  const products = contentCounts.products ?? { total: 0, published: 0 };

  const stats = [
    { label: "درخواست جدید", value: counts.new ?? 0, icon: Inbox, href: "/admin/quotes?status=new" },
    { label: "کل درخواست‌ها", value: total, icon: TrendingUp, href: "/admin/quotes" },
    {
      label: "محصول منتشرشده",
      value: products.published,
      icon: Package,
      href: "/admin/c/products",
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-black">داشبورد</h1>
      <p className="mt-2 text-sm text-muted">وضعیت درخواست‌های فروش و محتوای سایت، در یک نگاه.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <AdminLink key={s.label} href={s.href}>
              <Card hover className="flex items-center gap-4 p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="num block text-2xl font-black">{fa(s.value)}</span>
                  <span className="block text-xs text-muted">{s.label}</span>
                </span>
              </Card>
            </AdminLink>
          );
        })}
      </div>

      {/* میان‌بر همه مجموعه‌ها، تا «کجا می‌توانم فلان را عوض کنم» یک کلیک باشد. */}
      <h2 className="mt-10 text-lg font-bold">محتوای سایت</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {collectionOrder.map((key) => {
          const schema = schemas[key];
          const stat = contentCounts[key] ?? { total: 0, published: 0 };
          return (
            <Card key={key} hover className="flex items-center gap-4 p-5">
              <AdminLink href={`/admin/c/${key}`} className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{schema.title}</span>
                <span className="num mt-0.5 block text-xs text-muted">
                  {fa(stat.total)} مورد
                  {schema.publishable && stat.total !== stat.published
                    ? ` · ${fa(stat.total - stat.published)} پیش‌نویس`
                    : ""}
                </span>
              </AdminLink>
              <AdminLink
                href={`/admin/c/${key}/new`}
                className="shrink-0 rounded-lg border border-line p-2 text-muted transition-colors hover:border-ink/30 hover:text-ink"
                aria-label={`افزودن ${schema.singular}`}
              >
                <Plus className="size-4" aria-hidden />
              </AdminLink>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <AdminLink href="/admin/settings/home" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Settings className="size-4" aria-hidden />
          متن‌های صفحه اصلی
        </AdminLink>
        <AdminLink href="/admin/settings/site" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Settings className="size-4" aria-hidden />
          تماس و هویت برند
        </AdminLink>
        <AdminLink href="/admin/settings/nav" className={buttonVariants({ variant: "outline", size: "sm" })}>
          <Settings className="size-4" aria-hidden />
          منوها
        </AdminLink>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-bold">آخرین درخواست‌ها</h2>
        <AdminLink href="/admin/quotes" className="flex items-center gap-1 text-sm text-accent">
          همه درخواست‌ها
          <ArrowLeft className="size-4" aria-hidden />
        </AdminLink>
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
