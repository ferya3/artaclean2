"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCompare } from "@/components/compare/CompareProvider";
import SearchDialog from "@/components/layout/SearchDialog";
import { megaProducts, megaServices, megaSolutions, primaryNav } from "@/lib/nav";

type MegaKey = "products" | "solutions" | "services";

const megaData: Record<MegaKey, { title: string; items: { label: string; href: string; latin: string }[] }[]> = {
  products: megaProducts,
  solutions: megaSolutions,
  services: megaServices,
};

const megaMeta: Record<MegaKey, { heading: string; allHref: string; allLabel: string }> = {
  products: { heading: "تجهیزات نظافت صنعتی", allHref: "/products", allLabel: "مشاهده همه تجهیزات" },
  solutions: { heading: "راهکار بر اساس صنعت", allHref: "/solutions", allLabel: "مشاهده همه راهکارها" },
  services: { heading: "خدمات پیش و پس از فروش", allHref: "/services", allLabel: "مشاهده همه خدمات" },
};

export default function Header() {
  const [open, setOpen] = useState<MegaKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { items } = useCompare();

  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // تأخیر کوتاه در بستن، تا حرکت مورب ماوس به سمت پنل، منو را نبندد.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
      <div className="hidden border-b border-line bg-primary text-white/80 lg:block">
        <div className="shell flex h-9 items-center justify-between text-xs">
          <p>مشاوره فنی رایگان پیش از خرید — انتخاب دستگاه بر اساس متراژ و نوع آلودگی سایت شما</p>
          <div className="flex items-center gap-5">
            <Link href="/spare-parts" className="hover:text-white">
              استعلام قطعه یدکی
            </Link>
            <a href="tel:+982100000000" className="num hover:text-white" dir="ltr">
              021-0000 0000
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
        <div className="shell flex h-16 items-center gap-4">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="btn-quiet -ms-2 px-2 lg:hidden"
            aria-label="باز کردن منو"
          >
            <BurgerIcon />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm font-bold text-white">
              AC
            </span>
            <span className="hidden text-base font-bold tracking-tight sm:block">آرتا کلین</span>
          </Link>

          <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="منوی اصلی">
            {primaryNav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <div
                  key={item.href}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpen(item.mega ?? null);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                    aria-expanded={item.mega ? open === item.mega : undefined}
                  >
                    {item.label}
                    {item.mega && <ChevronIcon />}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="ms-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="btn-quiet gap-2 px-3"
              aria-label="جستجو"
            >
              <SearchIcon />
              <span className="hidden text-sm xl:inline">جستجو</span>
            </button>

            <Link href="/compare" className="btn-quiet relative gap-2 px-3">
              <CompareIcon />
              <span className="hidden text-sm xl:inline">مقایسه</span>
              {items.length > 0 && (
                <span className="num absolute -top-0.5 start-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </Link>

            <Link href="/quote" className="btn-accent hidden sm:inline-flex">
              درخواست مشاوره
            </Link>
          </div>
        </div>

        {open && (
          <div
            className="absolute inset-x-0 top-full hidden border-b border-line bg-surface shadow-pop lg:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <MegaPanel which={open} />
          </div>
        )}
      </header>

      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} onSearch={() => setSearchOpen(true)} />}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function MegaPanel({ which }: { which: MegaKey }) {
  const groups = megaData[which];
  const meta = megaMeta[which];

  return (
    <div className="shell grid grid-cols-12 gap-8 py-8">
      <div className="col-span-9">
        <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
          <h2 className="text-sm font-semibold">{meta.heading}</h2>
          <Link href={meta.allHref} className="text-sm text-accent hover:underline">
            {meta.allLabel} ←
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-x-8 gap-y-6">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="eyebrow mb-3">{group.title}</p>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="group block">
                      <span className="block text-sm text-ink group-hover:text-accent">{item.label}</span>
                      <span className="block text-[11px] text-muted">{item.latin}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ستون کمکی: برای کاربری که اصلاً نمی‌داند دنبال کدام دسته است. */}
      <aside className="col-span-3 rounded-card bg-canvas p-6">
        <p className="text-sm font-semibold">چه دستگاهی نیاز دارید؟</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          اگر مدل دستگاه را نمی‌دانید، با چهار پرسش درباره سطح، آلودگی و متراژ، گزینه‌های مناسب سایت
          شما را فهرست می‌کنیم.
        </p>
        <Link href="/advisor" className="btn-primary mt-4 w-full">
          پیدا کردن دستگاه
        </Link>
        <Link href="/quote" className="btn-ghost mt-2 w-full">
          مشاوره با کارشناس
        </Link>
      </aside>
    </div>
  );
}

function MobileNav({ onClose, onSearch }: { onClose: () => void; onSearch: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} aria-hidden />
      <div className="absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col bg-surface">
        <div className="flex h-16 items-center justify-between border-b border-line px-4">
          <span className="font-bold">منو</span>
          <button type="button" onClick={onClose} className="btn-quiet px-2" aria-label="بستن منو">
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSearch();
            }}
            className="btn-ghost mb-3 w-full justify-start gap-2"
          >
            <SearchIcon />
            جستجوی محصول، قطعه یا راهنما
          </button>

          <Link href="/advisor" className="btn-accent mb-5 w-full" onClick={onClose}>
            پیدا کردن دستگاه مناسب
          </Link>

          <nav className="divide-y divide-line">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose} className="block py-3 text-sm font-medium">
                {item.label}
              </Link>
            ))}
            <Link href="/compare" onClick={onClose} className="block py-3 text-sm font-medium">
              مقایسه دستگاه‌ها
            </Link>
            <Link href="/spare-parts" onClick={onClose} className="block py-3 text-sm font-medium">
              قطعات یدکی
            </Link>
            <Link href="/company/contact" onClick={onClose} className="block py-3 text-sm font-medium">
              تماس با ما
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M9 5v14M15 5v14M4 9h10M10 15h10" strokeLinecap="round" />
    </svg>
  );
}
