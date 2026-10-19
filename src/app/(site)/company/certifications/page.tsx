import type { Metadata } from "next";

import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getPage } from "@/lib/content";

export function generateMetadata(): Metadata {
  const page = getPage("certifications");
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function CertificationsPage() {
  const page = getPage("certifications");

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "گواهی‌نامه‌ها" }]} />
      </div>

      <div className="shell grid gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        {page.cards.map((card) => (
          <div key={card.title} className="card p-6">
            <h2 className="font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{card.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
