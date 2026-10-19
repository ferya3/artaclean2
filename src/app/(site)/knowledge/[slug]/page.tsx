import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getArticle, getArticles, getCategories } from "@/lib/content";
import { articleKindLabels } from "@/lib/data/knowledge";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/knowledge/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const categories = getCategories();
  const related = article.relatedCategories
    .map((c) => categories.find((cat) => cat.slug === c))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const more = getArticles().filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow={articleKindLabels[article.kind]} title={article.title} lead={article.excerpt} />

      <div className="shell py-6">
        <Breadcrumbs
          trail={[
            { label: "خانه", href: "/" },
            { label: "راهنمای خرید", href: "/knowledge" },
            { label: article.title },
          ]}
        />
      </div>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <p className="mb-8 text-xs text-muted">
            {fa(article.readingTime)} دقیقه مطالعه · {fa(article.date)}
          </p>
          <div className="space-y-6">
            {article.body.map((para, i) => (
              <p key={i} className="text-lg leading-9">
                {para}
              </p>
            ))}
          </div>

          <div className="card mt-12 flex flex-wrap items-center justify-between gap-4 bg-canvas p-6">
            <p className="max-w-md text-sm leading-7">
              اگر می‌خواهید همین را روی سایت خودتان اعمال کنید، شرایط را وارد کنید تا فهرست کوتاه
              دستگاه‌های مناسب را ببینید.
            </p>
            <Link href="/advisor" className={buttonVariants({ variant: "accent" })}>
              پیدا کردن دستگاه
            </Link>
          </div>
        </article>

        <aside className="lg:col-span-4">
          {related.length > 0 && (
            <div className="card p-6">
              <p className="eyebrow mb-3">دسته‌های مرتبط</p>
              <ul className="space-y-2">
                {related.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/products/${c.slug}`} className="text-sm text-muted hover:text-ink">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card mt-5 p-6">
            <p className="eyebrow mb-3">مطالب دیگر</p>
            <ul className="space-y-3">
              {more.map((a) => (
                <li key={a.slug}>
                  <Link href={`/knowledge/${a.slug}`} className="text-sm leading-6 text-muted hover:text-ink">
                    {a.title}
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
