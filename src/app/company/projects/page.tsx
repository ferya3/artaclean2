import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { industries } from "@/lib/data/industries";
import { projects } from "@/lib/data/knowledge";
import { getProduct } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "پروژه‌های اجراشده",
  description: "نمونه پروژه‌های تجهیز نظافت صنعتی: مشخصات سایت، دستگاه انتخاب‌شده و نتیجه.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="پروژه‌ها"
        title="پروژه‌های اجراشده"
        lead="هر پروژه با سه چیز توضیح داده شده: شرایط سایت، دستگاه انتخاب‌شده و نتیجه — بدون تعریف و تمجید."
      />

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
                  <Link href={`/solutions/${industry.slug}`} className="chip hover:border-ink/30">
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
                          className="chip hover:border-ink/30"
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
