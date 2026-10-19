import {
  Award,
  Blocks,
  Building2,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Package,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AdminLink from "@/components/admin/AdminLink";

import { logoutAction } from "@/app/(admin)/admin/actions";
import { buttonVariants } from "@/components/ui/button";
import { currentUser } from "@/lib/auth";
import { collectionOrder, schemas } from "@/lib/admin/schemas";
import { collectionCounts } from "@/lib/db/content";
import { quoteCounts } from "@/lib/db/queries";
import { fa } from "@/lib/format";
import { siteSettings } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

// پنل همیشه داده لحظه‌ای می‌خواهد؛ هیچ صفحه‌ای از آن نباید استاتیک شود.
export const dynamic = "force-dynamic";

const COLLECTION_ICONS: Record<string, typeof Package> = {
  products: Package,
  categories: Blocks,
  brands: Award,
  industries: Building2,
  services: Wrench,
  articles: FileText,
  projects: Building2,
  parts: Wrench,
  offices: Building2,
  pages: FileText,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  // صفحه ورود زیر همین layout نیست (route group جدا)، پس اینجا نبود کاربر
  // همیشه یعنی دسترسی غیرمجاز.
  if (!user) redirect("/admin/login");

  const site = siteSettings();
  const newQuotes = quoteCounts().new ?? 0;
  const counts = collectionCounts();

  const contentLinks = collectionOrder.map((key) => ({
    href: `/admin/c/${key}`,
    label: schemas[key].title,
    icon: COLLECTION_ICONS[key] ?? Package,
    count: counts[key]?.total ?? 0,
  }));

  return (
    <div className="min-h-screen bg-canvas">
      <header className="section-deep sticky top-0 z-30">
        <div className="shell flex h-16 items-center gap-6">
          <AdminLink href="/admin" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-linear-to-br from-accent to-accent-2 text-xs font-black text-white">
              {site.brandShort}
            </span>
            <span className="font-extrabold text-white">پنل مدیریت</span>
          </AdminLink>

          <div className="ms-auto flex items-center gap-3">
            <AdminLink href="/" target="_blank" className="text-xs text-white/50 transition-colors hover:text-white">
              مشاهده سایت ←
            </AdminLink>
            <span className="hidden text-xs text-white/40 md:inline">{user.name}</span>
            <form action={logoutAction}>
              <button type="submit" className={cn(buttonVariants({ variant: "glass", size: "sm" }))}>
                <LogOut className="size-4" aria-hidden />
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="shell grid gap-8 py-8 lg:grid-cols-[15rem_1fr]">
        {/*
          منوی عمودی، نه افقی: با ده مجموعه محتوا به‌علاوه تنظیمات، نوار افقی
          یا می‌شکند یا پشت «بیشتر» پنهان می‌شود — و وقتی کسی دنبال «کجا
          می‌توانم فلان را عوض کنم» است، دیدن کل فهرست خودش جواب است.
        */}
        <nav aria-label="منوی پنل" className="lg:sticky lg:top-24 lg:self-start">
          <NavGroup
            items={[
              { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
              { href: "/admin/quotes", label: "درخواست‌ها", icon: Inbox, badge: newQuotes },
            ]}
          />

          <NavGroup title="محتوا" items={contentLinks} />

          <NavGroup
            title="ظاهر و تنظیمات"
            items={[
              { href: "/admin/settings/home", label: "صفحه اصلی", icon: LayoutDashboard },
              { href: "/admin/settings/nav", label: "منوها", icon: MenuIcon },
              { href: "/admin/settings/site", label: "تنظیمات سایت", icon: Settings },
              { href: "/admin/media", label: "رسانه", icon: ImageIcon },
              { href: "/admin/users", label: "کاربران", icon: Users },
            ]}
          />
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

function NavGroup({
  title,
  items,
}: {
  title?: string;
  items: {
    href: string;
    label: string;
    icon: typeof Package;
    count?: number;
    badge?: number;
  }[];
}) {
  return (
    <div className="mb-6">
      {title && (
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
          {title}
        </p>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <AdminLink
                href={item.href}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-ink/5 hover:text-ink"
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge ? (
                  <span className="rounded-full bg-accent px-1.5 text-[10px] font-bold text-white">
                    <span className="num">{fa(item.badge)}</span>
                  </span>
                ) : item.count !== undefined ? (
                  <span className="num text-[11px] text-muted/60">{fa(item.count)}</span>
                ) : null}
              </AdminLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
