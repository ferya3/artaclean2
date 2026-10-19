import { notFound } from "next/navigation";

import SettingsEditor from "@/components/admin/SettingsEditor";
import { resolveSections } from "@/lib/admin/resolve";
import { getSettingsSchema } from "@/lib/admin/settings-schemas";
import { homeSettings, navSettings, siteSettings } from "@/lib/site";

type Params = { params: Promise<{ key: string }> };

export default async function SettingsPage({ params }: Params) {
  const { key } = await params;
  const schema = getSettingsSchema(key);
  if (!schema) notFound();

  // مقدار فعلی همیشه کامل است: اگر کلیدی ذخیره نشده باشد، از پیش‌فرض کد
  // پر می‌شود. پس فرم هرگز با فیلد تهی باز نمی‌شود.
  const current =
    schema.key === "site" ? siteSettings() : schema.key === "home" ? homeSettings() : navSettings();

  return (
    <>
      <h1 className="text-2xl font-black">{schema.title}</h1>
      {schema.blurb && (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{schema.blurb}</p>
      )}

      <div className="mt-8">
        <SettingsEditor
          settingsKey={schema.key}
          sections={resolveSections(schema.sections)}
          initial={current as unknown as Record<string, unknown>}
        />
      </div>
    </>
  );
}
