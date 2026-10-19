import Link from "next/link";

import type { SiteNav } from "@/lib/nav";
import type { SiteSettings } from "@/lib/site";

export default function Footer({ nav, site }: { nav: SiteNav; site: SiteSettings }) {
  return (
    <footer className="section-deep grain">
      <div
        className="glow bottom-[-8rem] start-[15%] h-80 w-96 opacity-15"
        style={{ background: "rgb(var(--c-accent))" }}
      />
      <div className="absolute inset-0 blueprint opacity-60" aria-hidden />

      <div className="shell relative py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-sm font-black text-white">
                {site.brandShort}
              </span>
              <span className="text-[17px] font-extrabold text-white">{site.brandName}</span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-8 text-white/50">{site.footerAbout}</p>

            <a
              href={`tel:${site.phone}`}
              className="num mt-7 block text-2xl font-black text-white transition-colors hover:text-accent"
              dir="ltr"
            >
              {site.phoneDisplay}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="mt-1 block text-sm text-white/45 transition-colors hover:text-white"
              dir="ltr"
            >
              {site.email}
            </a>

            {site.social.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/45">
                {site.social.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {nav.footer.map((col) => (
              <div key={col.title}>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/55 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.brandName} — همه حقوق محفوظ است.
          </p>
          <div className="flex gap-6">
            <Link href="/advisor" className="transition-colors hover:text-white">
              انتخاب دستگاه
            </Link>
            <Link href="/quote" className="transition-colors hover:text-white">
              درخواست پیش‌فاکتور
            </Link>
            <Link href="/company/contact" className="transition-colors hover:text-white">
              تماس
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
