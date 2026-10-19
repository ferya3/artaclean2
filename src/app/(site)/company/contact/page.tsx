import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getPage } from "@/lib/content";
import { siteSettings } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const page = getPage("contact");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function ContactPage() {
  const page = getPage("contact");
  const site = siteSettings();

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "تماس با ما" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 lg:grid-cols-3">
        {page.cards.map((card) => (
          <div key={card.title} className="card flex flex-col p-6">
            <h2 className="font-semibold">{card.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{card.body}</p>
            <div className="mt-4 space-y-1 text-sm">
              {card.phone && (
                <a href={`tel:${card.phone.replace(/\s/g, "")}`} className="num block" dir="ltr">
                  {card.phone}
                </a>
              )}
              {card.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="block text-muted hover:text-ink"
                  dir="ltr"
                >
                  {card.email}
                </a>
              )}
            </div>
            {card.ctaLabel && card.ctaHref && (
              <Link href={card.ctaHref} className={cn(buttonVariants({ variant: "outline" }), "mt-5")}>
                {card.ctaLabel}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="shell pb-16">
        <div className="card grid gap-6 p-6 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">دفتر مرکزی</p>
            <p className="text-sm leading-7 text-muted">{site.address}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">ساعات کاری</p>
            <p className="text-sm leading-7 text-muted">{site.hours}</p>
          </div>
        </div>
      </div>
    </>
  );
}
