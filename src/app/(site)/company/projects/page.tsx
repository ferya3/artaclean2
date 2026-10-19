import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getIndustries, getPage, getProduct, getProjects } from "@/lib/content";
import { chipVariants } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const page = getPage("projects");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function ProjectsPage() {
  const page = getPage("projects");
  const projects = getProjects();
  const industries = getIndustries();

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "پروژه‌ها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 lg:grid-cols-2">
        {projects.map((p) => {
          const industry = industries.find((i) => i.slug === p.industry);
          return (
            <article key={p.slug} className="card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="eyebrow">{p.location}</p>
                {industry && (
                  <Link href={`/solutions/${industry.slug}`} className={cn(chipVariants({ interactive: true }), "hover:border-ink/30")}>
                    {industry.name}
                  </Link>
                )}
              </div>

              <h2 className="mt-3 text-lg font-semibold">{p.title}</h2>
              <p className="mt-1 text-sm text-muted">{p.area}</p>
              <p className="mt-4 text-sm leading-7 text-muted">{p.result}</p>

              <div className="mt-5 border-t border-line pt-4">
                <p className="eyebrow mb-2">دستگاه‌های نصب‌شده</p>
                <ul className="flex flex-wrap gap-2">
                  {p.machines.map((slug) => {
                    const product = getProduct(slug);
                    if (!product) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/products/${product.category}/${product.slug}`}
                          className={cn(chipVariants({ interactive: true }), "hover:border-ink/30")}
                        >
                          {product.model}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
