import "server-only";

import {
  sectionFields,
  type ContentCollection,
  type EnumKey,
  type Field,
  type Option,
  type OptionSource,
  type Section,
} from "@/lib/admin/fields";
import { listRows } from "@/lib/db/content";
import {
  areaLabels,
  brushTypeLabels,
  dirtLabels,
  frequencyLabels,
  machineTypeLabels,
  powerSourceLabels,
  surfaceLabels,
} from "@/lib/data/taxonomy";
import { articleKindLabels } from "@/lib/data/knowledge";
import { navSettings } from "@/lib/site";

/**
 * تبدیل «منبع گزینه» به فهرست واقعی.
 *
 * توصیف فیلدها باید JSON بماند تا به کامپوننت کلاینت منتقل شود، پس نمی‌تواند
 * خودش دیتابیس بخواند. این مرحله روی سرور اجرا می‌شود و هر فیلد انتخابی را
 * با گزینه‌های لحظه‌ای پر می‌کند — یعنی برند تازه‌ای که دقیقه قبل ساخته شده،
 * بلافاصله در فرم محصول قابل انتخاب است.
 */

const fromPairs = (map: Record<string, string>): Option[] =>
  Object.entries(map).map(([value, label]) => ({ value, label }));

function enumOptions(key: EnumKey): Option[] {
  switch (key) {
    case "machineType":
      return fromPairs(machineTypeLabels);
    case "powerSource":
      return fromPairs(powerSourceLabels);
    case "brushType":
      return fromPairs(brushTypeLabels);
    case "surface":
      return fromPairs(surfaceLabels);
    case "dirt":
      return fromPairs(dirtLabels);
    case "frequency":
      return fromPairs(frequencyLabels);
    case "area":
      return fromPairs(areaLabels);
    case "articleKind":
      return fromPairs(articleKindLabels);
    case "downloadKind":
      return [
        { value: "datasheet", label: "دیتاشیت" },
        { value: "manual", label: "دفترچه راهنما" },
        { value: "certificate", label: "گواهی" },
        { value: "brochure", label: "بروشور" },
      ];
    case "filterKey":
      return [
        { value: "machineType", label: "نوع دستگاه" },
        { value: "powerSource", label: "منبع انرژی" },
        { value: "area", label: "متراژ سایت" },
        { value: "workingWidth", label: "عرض کار" },
        { value: "brushType", label: "نوع برس" },
        { value: "brand", label: "برند" },
      ];
    case "megaKey":
      return [
        { value: "products", label: "محصولات" },
        { value: "solutions", label: "راهکارها" },
        { value: "services", label: "خدمات" },
      ];
    case "categoryGroup":
      // گروه‌های دسته، خودشان تنظیمات قابل ویرایش‌اند.
      return navSettings().categoryGroups.map((g) => ({ value: g.key, label: g.title }));
  }
}

/** عنوانی که یک رکورد را در فهرست انتخاب قابل تشخیص می‌کند. */
const labelField: Record<ContentCollection, string[]> = {
  products: ["name", "model"],
  categories: ["name"],
  brands: ["name"],
  industries: ["name"],
  services: ["name"],
  articles: ["title"],
  projects: ["title"],
  parts: ["title", "partNo"],
  offices: ["city"],
  pages: ["title"],
};

function collectionOptions(collection: ContentCollection): Option[] {
  return listRows(collection, true).map((row) => {
    const data = (row.data ?? {}) as Record<string, unknown>;
    const parts = (labelField[collection] ?? [])
      .map((key) => data[key])
      .filter((v): v is string => typeof v === "string" && v.length > 0);
    return {
      value: row.slug,
      label: parts.length ? parts.join(" — ") : row.slug,
    };
  });
}

function resolveSource(source: OptionSource): Option[] {
  if ("static" in source) return source.static;
  if ("enumKey" in source) return enumOptions(source.enumKey);
  return collectionOptions(source.collection);
}

function resolveField(field: Field): Field {
  if (field.kind === "repeater") {
    return { ...field, fields: field.fields.map(resolveField) };
  }
  if (field.kind === "select" || field.kind === "multiselect" || field.kind === "refs") {
    return { ...field, options: resolveSource(field.source) };
  }
  return field;
}

export function resolveSections(sections: Section[]): Section[] {
  return sections.map((section) => ({
    ...section,
    fields: section.fields.map(resolveField),
  }));
}

/** مقدار پیش‌فرض یک رکورد تازه، بر اساس نوع هر فیلد. */
export function blankRecord(sections: Section[]): Record<string, unknown> {
  const record: Record<string, unknown> = {};
  for (const field of sectionFields(sections)) setDefault(record, field);
  return record;
}

function setDefault(record: Record<string, unknown>, field: Field) {
  const value = (() => {
    switch (field.kind) {
      case "boolean":
        // «موجود است» و امثالش منطقی‌تر است که روشن شروع شوند.
        return field.name === "inStock";
      case "number":
        return undefined;
      case "lines":
      case "refs":
      case "multiselect":
      case "repeater":
        return [];
      case "select":
        return field.options?.[0]?.value ?? "";
      default:
        return "";
    }
  })();
  if (value !== undefined) setPath(record, field.name, value);
}

/** نوشتن در مسیر نقطه‌دار — برای فیلدهایی مثل `facets.areaMax`. */
export function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let node = target;
  for (const key of keys.slice(0, -1)) {
    const next = node[key];
    if (!next || typeof next !== "object" || Array.isArray(next)) node[key] = {};
    node = node[key] as Record<string, unknown>;
  }
  node[keys[keys.length - 1]] = value;
}
