"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useCompare } from "@/store/compare";
import SearchDialog from "@/components/layout/SearchDialog";
import { megaProducts, megaServices, megaSolutions, primaryNav } from "@/lib/nav";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const { items } = useCompare();

  // همه صفحات با یک باند تیره شروع می‌شوند، پس هدر در بالای صفحه شفاف است
  // و با اسکرول به سطح جامد تبدیل می‌شود.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const solid = scrolled || open !== null;

  return (
    <>
      {/* نوار خدماتی — با اسکرول کنار می‌رود */}
      <div className="relative z-50 hidden bg-deep text-white/55 lg:block">
        <div className="shell flex h-10 items-center justify-between text-xs">
          <p className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            مشاوره فنی رایگان پیش از خرید — انتخاب دستگاه بر اساس متراژ و نوع آلودگی سایت شما
          </p>
          <div className="flex items-center gap-6">
            <Link href="/spare-parts" className="transition-colors hover:text-white">
              استعلام قطعه یدکی
            </Link>
            <a href="tel:+982100000000" className="num transition-colors hover:text-white" dir="ltr">
              021-0000 0000
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-500 ease-out ${
          solid
            ? "border-b border-line bg-surface/88 shadow-[0_10px_30px_-24px_rgb(13_15_18/0.5)] backdrop-blur-xl"
            : "border-b border-white/[0.07] bg-deep"
        }`}
      >
        <div className={`shell flex items-center gap-4 transition-all duration-500 ${solid ? "h-16" : "h-20"}`}>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`-ms-2 rounded-lg p-2 transition-colors lg:hidden ${
              solid ? "text-ink hover:bg-ink/5" : "text-white hover:bg-white/10"
            }`}
            aria-label="باز کردن منو"
          >
            <BurgerIcon />
          </button>

          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-accent to-accent-2 text-sm font-black text-white shadow-glow transition-transform duration-500 group-hover:scale-105">
              AC
            </span>
            <span
              className={`hidden text-[17px] font-extrabold tracking-tight transition-colors sm:block ${
                solid ? "text-ink" : "text-white"
              }`}
            >
              آرتا کلین
            </span>
          </Link>

          <nav className="hidden flex-1 items-center gap-0.5 lg:flex" aria-label="منوی اصلی">
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
                    data-active={active || open === item.mega}
                    className={`nav-link ${
                      solid
                        ? active
                          ? "text-ink"
                          : "text-muted hover:text-ink"
                        : active
                          ? "text-white"
                          : "text-white/65 hover:text-white"
                    }`}
                    aria-expanded={item.mega ? open === item.mega : undefined}
                  >
                    {item.label}
                    {item.mega && (
                      <ChevronIcon className={open === item.mega ? "rotate-180" : ""} />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="ms-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                solid ? "text-muted hover:bg-ink/5 hover:text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              aria-label="جستجو"
            >
              <SearchIcon />
              <span className="hidden xl:inline">جستجو</span>
              <kbd
                className={`num hidden rounded border px-1.5 py-0.5 text-[10px] xl:inline ${
                  solid ? "border-line text-muted" : "border-white/20 text-white/50"
                }`}
              >
                ⌘K
              </kbd>
            </button>

            <Link
              href="/compare"
              className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                solid ? "text-muted hover:bg-ink/5 hover:text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <CompareIcon />
              <span className="hidden xl:inline">مقایسه</span>
              {items.length > 0 && (
                <span className="absolute -top-0.5 start-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  <span className="num">{items.length}</span>
                </span>
              )}
            </Link>

            <Link
              href="/quote"
              className={cn(
                buttonVariants({ variant: solid ? "accent" : "glass", size: "sm" }),
                "hidden sm:inline-flex",
              )}
            >
              درخواست مشاوره
            </Link>
          </div>
        </div>

        {open && (
          <div
            className="absolute inset-x-0 top-full hidden lg:block"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <div className="shell pt-2">
              <div className="overflow-hidden rounded-xl2 border border-line bg-surface shadow-pop">
                <MegaPanel which={open} />
              </div>
            </div>
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
    <div className="grid grid-cols-12">
      <div className="col-span-9 p-8">
        <div className="mb-7 flex items-baseline justify-between border-b border-line pb-4">
          <h2 className="text-sm font-bold">{meta.heading}</h2>
          <Link href={meta.allHref} className="group text-sm font-medium text-accent">
            {meta.allLabel}
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1"> ←</span>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-x-8 gap-y-7">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="eyebrow mb-4">{group.title}</p>
              <ul className="space-y-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="group block">
                      <span className="flex items-center gap-1.5 text-sm font-medium text-ink transition-colors group-hover:text-accent">
                        {item.label}
                        <span className="opacity-0 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:opacity-100">
                          ←
                        </span>
                      </span>
                      <span className="block text-[11px] text-muted">{item.latin}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ستون کمکی برای کاربری که نمی‌داند دنبال کدام دسته است */}
      <aside className="section-deep grain col-span-3 p-8">
        <div
          className="glow -top-10 start-0 h-40 w-40 opacity-30"
          style={{ background: "rgb(var(--c-accent))" }}
        />
        <div className="relative">
          <p className="text-base font-bold text-white">چه دستگاهی نیاز دارید؟</p>
          <p className="mt-3 text-sm leading-7 text-white/55">
            اگر مدل دستگاه را نمی‌دانید، با چهار پرسش درباره سطح، آلودگی و متراژ، گزینه‌های مناسب
            سایت شما را فهرست می‌کنیم.
          </p>
          <Link href="/advisor" className={cn(buttonVariants({ variant: "accent", size: "sm" }), "mt-6 w-full")}>
            پیدا کردن دستگاه
          </Link>
          <Link href="/quote" className={cn(buttonVariants({ variant: "glass", size: "sm" }), "mt-2 w-full")}>
            مشاوره با کارشناس
          </Link>
        </div>
      </aside>
    </div>
  );
}

function MobileNav({ onClose, onSearch }: { onClose: () => void; onSearch: () => void }) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-deep/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="section-deep absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col">
        <div className="relative flex h-16 items-center justify-between border-b border-white/10 px-5">
          <span className="font-bold text-white">منو</span>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-white/70" aria-label="بستن منو">
            <CloseIcon />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto px-5 py-5">
          <button type="button" onClick={() => { onClose(); onSearch(); }} className={cn(buttonVariants({ variant: "glass", size: "sm" }), "mb-3 w-full justify-start gap-2")}>
            <SearchIcon />
            جستجوی محصول، قطعه یا راهنما
          </button>

          <Link href="/advisor" className={cn(buttonVariants({ variant: "accent" }), "mb-6 w-full")} onClick={onClose}>
            پیدا کردن دستگاه مناسب
          </Link>

          <nav className="divide-y divide-white/10">
            {[
              ...primaryNav,
              { label: "مقایسه دستگاه‌ها", href: "/compare" },
              { label: "قطعات یدکی", href: "/spare-parts" },
              { label: "تماس با ما", href: "/company/contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between py-3.5 text-[15px] font-medium text-white/85"
              >
                {item.label}
                <span className="text-white/25">←</span>
              </Link>
            ))}
          </nav>

          <a href="tel:+982100000000" className="num mt-8 block text-lg font-bold text-white" dir="ltr">
            021-0000 0000
          </a>
        </div>
      </div>
    </div>
  );
}

function BurgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      className={`transition-transform duration-300 ${className}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 5v14M15 5v14M4 9h10M10 15h10" strokeLinecap="round" />
    </svg>
  );
}
