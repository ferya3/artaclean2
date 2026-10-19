import type { Metadata } from "next";

import CompareScreen from "@/components/compare/CompareScreen";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getPage, getProducts } from "@/lib/content";

export function generateMetadata(): Metadata {
  const page = getPage("compare");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function ComparePage() {
  const page = getPage("compare");

  // فهرست انتخاب‌شده در localStorage است، پس این صفحه بدون JavaScript هم باید
  // چیزی برای گفتن داشته باشد: چند پیشنهاد برای شروع.
  const popular = getProducts()
    .slice(1, 5)
    .map((p) => ({ slug: p.slug, category: p.category, name: p.name }));

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "مقایسه دستگاه‌ها" }]} />
      </div>

      <CompareScreen popular={popular} />
    </>
  );
}
