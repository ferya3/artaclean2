import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getService, getServices } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.blurb,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const others = getServices().filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHeader eyebrow={service.latin} title={service.name} lead={service.blurb} />

      <div className="shell py-6">
        <Breadcrumbs
          trail={[
            { label: "خانه", href: "/" },
            { label: "خدمات", href: "/services" },
            { label: service.name },
          ]}
        />
      </div>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-lg leading-9">{service.body}</p>

          <ul className="mt-8 divide-y divide-line border-y border-line">
            {service.bullets.map((b) => (
              <li key={b} className="flex gap-3 py-3 text-sm">
                <span className="text-accent">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:col-span-5">
          <div className="card bg-canvas p-6">
            <p className="font-semibold">درخواست {service.name}</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              مدل دستگاه و شهر محل استفاده را بفرستید تا زمان و هزینه اعلام شود.
            </p>
            <Link href={`/quote?service=${service.slug}`} className={cn(buttonVariants({ variant: "accent" }), "mt-4 w-full")}>
              ثبت درخواست
            </Link>
            <a href="tel:+982100000000" className={cn(buttonVariants({ variant: "outline" }), "num mt-2 w-full")} dir="ltr">
              021-0000 0000
            </a>
          </div>

          <div className="card mt-5 p-6">
            <p className="eyebrow mb-3">سایر خدمات</p>
            <ul className="space-y-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-muted hover:text-ink">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
