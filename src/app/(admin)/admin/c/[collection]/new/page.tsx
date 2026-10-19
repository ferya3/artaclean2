import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import RecordEditor from "@/components/admin/RecordEditor";
import { blankRecord, resolveSections } from "@/lib/admin/resolve";
import { getSchema } from "@/lib/admin/schemas";

type Params = { params: Promise<{ collection: string }> };

export default async function NewRecordPage({ params }: Params) {
  const { collection } = await params;
  const schema = getSchema(collection);
  if (!schema) notFound();

  const sections = resolveSections(schema.sections);

  return (
    <>
      <Link
        href={`/admin/c/${collection}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <ArrowRight className="size-4" aria-hidden />
        {schema.title}
      </Link>

      <h1 className="mb-8 text-2xl font-black">افزودن {schema.singular}</h1>

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
        slug=""
        initial={blankRecord(sections)}
        published={false}
        isNew
      />
    </>
  );
}
