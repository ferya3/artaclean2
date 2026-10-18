import { LayoutDashboard, LogOut, Package, Inbox } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAction } from "@/app/(admin)/admin/actions";
import { buttonVariants } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { quoteCounts } from "@/lib/db/queries";
import { fa } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

// پنل همیشه داده لحظه‌ای می‌خواهد؛ هیچ صفحه‌ای از آن نباید استاتیک شود.
export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/quotes", label: "درخواست‌ها", icon: Inbox },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  // صفحه ورود زیر همین layout نیست (route group جدا)، پس اینجا نبود کاربر
  // همیشه یعنی دسترسی غیرمجاز.
  if (!user) redirect("/admin/login");

  const counts = quoteCounts();
  const newQuotes = counts.new ?? 0;

  return (
    <div className="min-h-screen bg-canvas">
      <header className="section-deep">
        <div className="shell flex h-16 items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-accent to-accent-2 text-xs font-black text-white">
              AC
            </span>
            <span className="font-extrabold text-white">پنل مدیریت</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                  {item.href === "/admin/quotes" && newQuotes > 0 && (
                    <span className="rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                      {fa(newQuotes)}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="ms-auto flex items-center gap-3">
            <Link href="/" className="text-xs text-white/50 transition-colors hover:text-white">
              مشاهده سایت ←
            </Link>
            <span className="hidden text-xs text-white/40 md:inline">{user.name}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className={cn(buttonVariants({ variant: "glass", size: "sm" }))}
              >
                <LogOut className="size-4" aria-hidden />
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="shell py-10">{children}</div>
    </div>
  );
}
