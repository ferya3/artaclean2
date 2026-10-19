import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getIndustries, getPage } from "@/lib/content";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";

export function generateMetadata(): Metadata {
  const page = getPage("solutions");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function SolutionsPage() {
  const page = getPage("solutions");
  const industries = getIndustries();

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
        <Link href="/advisor" className={buttonVariants({ variant: "accent" })}>
          پیدا کردن دستگاه مناسب
        </Link>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "راهکارها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((i) => (
          <Link key={i.slug} href={`/solutions/${i.slug}`} className="card card-hover group flex h-full flex-col p-6">
            <p className="eyebrow">{i.latin}</p>
            <h2 className="mt-2 text-lg font-semibold group-hover:text-accent">{i.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-muted">{i.blurb}</p>
            <ul className="mt-4 space-y-1 border-t border-line pt-4 text-xs text-muted">
              {i.problems.slice(0, 3).map((p) => (
                <li key={p.key}>• {p.title}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              {fa(i.recommendedCategories.length)} دسته تجهیزات پیشنهادی
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
