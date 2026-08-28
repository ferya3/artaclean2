import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { articleKindLabels, articles } from "@/lib/data/knowledge";
import { fa } from "@/lib/format";
import type { Article } from "@/lib/types";

export const metadata: Metadata = {
  title: "راهنمای خرید و مقالات",
  description:
    "راهنمای انتخاب اسکرابر و مکنده صنعتی، مقایسه دستگاه‌ها، راهنمای نگهداری باتری و نظافت انواع آلودگی صنعتی.",
};

const ORDER: Article["kind"][] = ["buying-guide", "comparison", "cleaning-guide", "case-study"];

export default function KnowledgePage() {
  return (
    <>
      <PageHeader
        eyebrow="دانش"
        title="راهنمای خرید و نظافت صنعتی"
        lead="نوشته‌هایی که قرار است در تصمیم خرید کمک کنند، نه اینکه محتوای سئویی پر کنند."
      >
        <Link href="/advisor" className="btn-accent">
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
