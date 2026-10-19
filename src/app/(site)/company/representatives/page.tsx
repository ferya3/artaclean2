import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getOffices, getPage } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { chipVariants } from "@/components/ui/card";

export function generateMetadata(): Metadata {
  const page = getPage("representatives");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function RepresentativesPage() {
  const page = getPage("representatives");
  const offices = getOffices();

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "نمایندگی‌ها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {offices.map((office) => (
          <div key={office.slug} className="card p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold">{office.city}</h2>
              <span className="text-xs text-muted">{office.role}</span>
            </div>
            <p className="mt-3 text-sm text-muted">{office.address}</p>
            {office.phone && (
              <a
                href={`tel:${office.phone.replace(/\s/g, "")}`}
                className="num mt-2 block text-sm"
                dir="ltr"
              >
                {office.phone}
              </a>
            )}
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {office.services.map((s) => (
                <li key={s} className={chipVariants({ interactive: true })}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {page.asideBody && (
        <div className="shell pb-16">
          <div className="card flex flex-wrap items-center justify-between gap-4 bg-canvas p-6">
            <p className="max-w-xl text-sm leading-7">{page.asideBody}</p>
            <Link href="/company/contact" className={buttonVariants({ variant: "primary" })}>
              تماس با ما
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
