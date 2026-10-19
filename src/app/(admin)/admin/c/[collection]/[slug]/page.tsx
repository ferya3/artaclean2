import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import DangerActions from "@/components/admin/DangerActions";
import RecordEditor from "@/components/admin/RecordEditor";
import { resolveSections } from "@/lib/admin/resolve";
import { getSchema } from "@/lib/admin/schemas";
import { fillPath } from "@/lib/admin/fields";
import { getRow } from "@/lib/db/content";

type Params = { params: Promise<{ collection: string; slug: string }> };

export default async function EditRecordPage({ params }: Params) {
  const { collection, slug: raw } = await params;
  const slug = decodeURIComponent(raw);

  const schema = getSchema(collection);
  if (!schema) notFound();

  const row = getRow(collection, slug);
  if (!row) notFound();

  const sections = resolveSections(schema.sections);
  const record = (row.data ?? {}) as Record<string, unknown>;
  const titleValue = record[schema.titleField];
  const title = typeof titleValue === "string" && titleValue ? titleValue : slug;

  return (
    <>
      <Link
        href={`/admin/c/${collection}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowRight className="size-4" aria-hidden />
        {schema.title}
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-black">{title}</h1>
        <DangerActions collection={collection} slug={slug} label={title} />
      </div>

      <RecordEditor
        schema={{
          key: schema.key,
          title: schema.title,
          singular: schema.singular,
          slugLabel: schema.slugLabel,
          slugHint: schema.slugHint,
          publishable: schema.publishable,
        }}
        sections={sections}
        slug={slug}
        initial={record}
        published={row.published}
        isNew={false}
        publicPath={schema.publicPath ? fillPath(schema.publicPath, slug, record) : undefined}
      />
    </>
  );
}
