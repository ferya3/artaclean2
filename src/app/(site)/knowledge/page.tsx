import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getArticles, getPage } from "@/lib/content";
import { articleKindLabels } from "@/lib/data/knowledge";
import { fa } from "@/lib/format";
import type { Article } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";

export function generateMetadata(): Metadata {
  const page = getPage("knowledge");
  return { title: page.metaTitle, description: page.metaDescription };
}

const ORDER: Article["kind"][] = ["buying-guide", "comparison", "cleaning-guide", "case-study"];

export default function KnowledgePage() {
  const page = getPage("knowledge");
  const articles = getArticles();

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead}>
        <Link href="/advisor" className={buttonVariants({ variant: "accent" })}>
          مشاور انتخاب دستگاه
        </Link>
      </PageHeader>

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "راهنمای خرید" }]} />
      </div>

      <div className="shell space-y-12 pb-16">
        {ORDER.map((kind) => {
          const list = articles.filter((a) => a.kind === kind);
          if (!list.length) return null;
          return (
            <section key={kind}>
              <h2 className="mb-6 border-b border-line pb-3 text-lg font-bold">
                {articleKindLabels[kind]}
              </h2>
              <div className="grid gap-5 lg:grid-cols-3">
                {list.map((a) => (
                  <Link key={a.slug} href={`/knowledge/${a.slug}`} className="card card-hover group flex h-full flex-col p-6">
                    <h3 className="text-lg font-semibold leading-8 group-hover:text-accent">{a.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-7 text-muted">{a.excerpt}</p>
                    <p className="mt-4 text-xs text-muted">
                      {fa(a.readingTime)} دقیقه · {fa(a.date)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
