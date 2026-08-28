import Link from "next/link";

import { footerNav } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-sm font-bold text-white">
                AC
              </span>
              <span className="text-base font-bold">آرتا کلین</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
              تأمین تجهیزات نظافت صنعتی، مشاوره انتخاب دستگاه بر اساس شرایط واقعی سایت، و پشتیبانی
              فنی و قطعات پس از فروش.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a href="tel:+982100000000" className="num block text-ink" dir="ltr">
                021-0000 0000
              </a>
              <a href="mailto:sales@example.com" className="block text-muted hover:text-ink" dir="ltr">
                sales@example.com
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {footerNav.map((col) => (
              <div key={col.title}>
                <p className="eyebrow mb-3">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} آرتا کلین — همه حقوق محفوظ است.</p>
          <div className="flex gap-5">
            <Link href="/advisor" className="hover:text-ink">
              انتخاب دستگاه
            </Link>
            <Link href="/quote" className="hover:text-ink">
              درخواست پیش‌فاکتور
            </Link>
            <Link href="/company/contact" className="hover:text-ink">
              تماس
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
