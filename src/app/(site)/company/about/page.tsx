import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getPage } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const page = getPage("about");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function AboutPage() {
  const page = getPage("about");

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]} />
      </div>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {page.body.map((paragraph, i) => (
            <p key={i} className={cn("text-lg leading-9", i > 0 && "mt-6")}>
              {paragraph}
            </p>
          ))}

          {page.cards.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {page.cards.map((card) => (
                <div key={card.title} className="card p-5">
                  <p className="font-semibold">{card.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">{card.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {(page.asideTitle || page.asideBody) && (
          <aside className="lg:col-span-5">
            <div className="card bg-canvas p-6">
              {page.asideTitle && <p className="font-semibold">{page.asideTitle}</p>}
              {page.asideBody && (
                <p className="mt-2 text-sm leading-7 text-muted">{page.asideBody}</p>
              )}
              <Link
                href="/services/rental"
                className={cn(buttonVariants({ variant: "primary" }), "mt-4 w-full")}
              >
                شرایط اجاره
              </Link>
              <Link
                href="/company/projects"
                className={cn(buttonVariants({ variant: "outline" }), "mt-2 w-full")}
              >
                پروژه‌های اجراشده
              </Link>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
