/**
 * توصیف فیلدهای فرم.
 *
 * پنل مدیریت این سایت باید نُه مجموعه محتوا را ویرایش کند و هر مجموعه
 * ساختار خودش را دارد — محصول با چهار سطح تودرتو، قطعه با چهار فیلد ساده.
 * نوشتن نُه فرم دستی یعنی نُه جای متفاوت برای فراموش کردن یک اعتبارسنجی.
 *
 * به‌جایش، هر مجموعه با همین نوع‌ها «توصیف» می‌شود و یک ویرایشگر عمومی
 * فرمش را می‌سازد. افزودن فیلد تازه به یک محصول = یک سطر در اینجا، بدون
 * مهاجرت دیتابیس (بدنه رکورد JSON است) و بدون کامپوننت تازه.
 *
 * این فایل عمداً هیچ تابعی در ساختار نمی‌گذارد: توصیف‌ها باید به‌صورت
 * JSON از سرور به کامپوننت کلاینت منتقل شوند.
 */

export interface Option {
  value: string;
  label: string;
}

/**
 * منبع گزینه‌های یک فیلد انتخابی.
 * `collection` به محتوای زنده اشاره می‌کند (مثلاً فهرست برندها) و سرور
 * پیش از رندر آن را به Option[] تبدیل می‌کند؛ `enumKey` به واژگان ثابت
 * موتورها اشاره دارد که در کد می‌مانند.
 */
export type OptionSource =
  | { static: Option[] }
  | { collection: ContentCollection }
  | { enumKey: EnumKey };

export type ContentCollection =
  | "products"
  | "categories"
  | "brands"
  | "industries"
  | "services"
  | "articles"
  | "projects"
  | "parts"
  | "offices"
  | "pages";

export type EnumKey =
  | "machineType"
  | "powerSource"
  | "brushType"
  | "surface"
  | "dirt"
  | "frequency"
  | "area"
  | "categoryGroup"
  | "articleKind"
  | "downloadKind"
  | "filterKey"
  | "megaKey";

interface FieldBase {
  name: string;
  label: string;
  hint?: string;
  /** روی گرید دو ستونه فرم، فیلد تمام‌عرض شود. */
  wide?: boolean;
}

export type Field =
  | (FieldBase & {
      kind: "text";
      /** برای شماره فنی، تلفن و مسیر — متن لاتین در قالب راست‌به‌چپ. */
      dir?: "ltr";
      placeholder?: string;
      required?: boolean;
    })
  | (FieldBase & { kind: "textarea"; rows?: number; placeholder?: string })
  | (FieldBase & { kind: "number"; unit?: string; min?: number })
  | (FieldBase & { kind: "boolean" })
  | (FieldBase & { kind: "select"; source: OptionSource; options?: Option[]; allowEmpty?: boolean })
  | (FieldBase & { kind: "multiselect"; source: OptionSource; options?: Option[] })
  /** آرایه رشته — هر سطر یک مورد. برای فهرست‌های کوتاه مثل برچسب و بولت. */
  | (FieldBase & { kind: "lines"; rows?: number; placeholder?: string })
  /** آرایه شناسه با انتخاب از محتوای موجود (محصولات مرتبط، دسته‌های پیشنهادی). */
  | (FieldBase & { kind: "refs"; source: OptionSource; options?: Option[] })
  | (FieldBase & { kind: "image" })
  /** فهرستی از اشیاء هم‌شکل — خودش می‌تواند repeater داخلی داشته باشد. */
  | (FieldBase & {
      kind: "repeater";
      itemLabel: string;
      /** کدام فیلد، عنوان هر مورد در حالت بسته باشد. */
      titleField?: string;
      fields: Field[];
    });

export interface Section {
  title: string;
  hint?: string;
  /** ستون کناری برای کارت‌های کوچک (انتشار، تصویر، قیمت). */
  side?: boolean;
  fields: Field[];
}

export interface CollectionSchema {
  key: ContentCollection;
  /** عنوان جمع، برای منو و فهرست. */
  title: string;
  /** عنوان مفرد، برای دکمه «افزودن …». */
  singular: string;
  /** توضیح بالای فهرست. */
  blurb?: string;
  /** برچسب و راهنمای شناسه رکورد. */
  slugLabel: string;
  slugHint: string;
  /** نام فیلدی که در فهرست به‌عنوان عنوان دیده می‌شود. */
  titleField: string;
  subtitleField?: string;
  /** آیا پیش‌نویس/انتشار معنا دارد. */
  publishable: boolean;
  /** آیا ترتیب نمایش دستی است. */
  orderable: boolean;
  /**
   * الگوی مسیر صفحه عمومی، برای دکمه «دیدن در سایت».
   * `{slug}` و نام هر فیلد رکورد جایگزین می‌شود — الگو به‌جای تابع، چون
   * کل توصیف باید به‌صورت JSON به کامپوننت کلاینت برود.
   */
  publicPath?: string;
  sections: Section[];
}

/** جایگذاری `{slug}` و `{field}` در الگوی مسیر عمومی. */
export function fillPath(
  template: string,
  slug: string,
  record: Record<string, unknown>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    if (key === "slug") return slug;
    const value = record[key];
    return typeof value === "string" ? value : "";
  });
}

/** پیمایش همه فیلدها، شامل داخلِ repeaterها. */
export function walkFields(fields: Field[], visit: (field: Field) => void) {
  for (const field of fields) {
    visit(field);
    if (field.kind === "repeater") walkFields(field.fields, visit);
  }
}

export function sectionFields(sections: Section[]): Field[] {
  return sections.flatMap((s) => s.fields);
}
