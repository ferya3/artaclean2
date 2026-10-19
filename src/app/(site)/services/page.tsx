import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getPage, getServices } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";

export function generateMetadata(): Metadata {
  const page = getPage("services");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function ServicesPage() {
  const page = getPage("services");
  const services = getServices();

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
        <Link href="/quote" className={buttonVariants({ variant: "accent" })}>
          درخواست خدمات
        </Link>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "خدمات" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="card card-hover group flex h-full flex-col p-6">
            <p className="eyebrow">{s.latin}</p>
            <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">{s.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{s.blurb}</p>
            <ul className="mt-4 space-y-1 border-t border-line pt-4 text-xs text-muted">
              {s.bullets.slice(0, 3).map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </>
  );
}
