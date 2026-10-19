import type { Section } from "@/lib/admin/fields";

/**
 * توصیف فرم‌های تنظیمات.
 *
 * همان نوع فیلدهای محتوا، چون ویرایشگر یکی است. تفاوت فقط این است که سند
 * تنظیمات شناسه و وضعیت انتشار ندارد.
 */
export interface SettingsSchema {
  key: "site" | "home" | "nav";
  title: string;
  blurb?: string;
  sections: Section[];
}

const site: SettingsSchema = {
  key: "site",
  title: "تنظیمات سایت",
  blurb: "نام، راه‌های تماس و متن‌های تکرارشونده‌ای که در هدر و فوتر همه صفحات دیده می‌شوند.",
  sections: [
    {
      title: "هویت",
      fields: [
        { kind: "text", name: "brandName", label: "نام برند" },
        {
          kind: "text",
          name: "brandShort",
          label: "نشان کوتاه",
          dir: "ltr",
          hint: "دو یا سه حرف، داخل مربع لوگو.",
        },
        {
          kind: "textarea",
          name: "description",
          label: "توضیح پیش‌فرض سایت",
          rows: 3,
          hint: "وقتی صفحه‌ای توضیح متای خودش را ندارد، از این استفاده می‌شود.",
          wide: true,
        },
      ],
    },
    {
      title: "تماس",
      fields: [
        {
          kind: "text",
          name: "phone",
          label: "شماره برای لینک تماس",
          dir: "ltr",
          hint: "فقط رقم و +، بدون فاصله و خط تیره — مثلاً +982100000000.",
        },
        {
          kind: "text",
          name: "phoneDisplay",
          label: "شماره نمایشی",
          dir: "ltr",
          hint: "همان شماره، به شکلی که روی صفحه خوانده می‌شود.",
        },
        { kind: "text", name: "email", label: "ایمیل", dir: "ltr" },
        { kind: "textarea", name: "address", label: "نشانی دفتر مرکزی", rows: 2, wide: true },
        { kind: "text", name: "hours", label: "ساعات کاری", wide: true },
      ],
    },
    {
      title: "متن‌های پوسته",
      fields: [
        {
          kind: "text",
          name: "topbar",
          label: "نوار بالای هدر",
          hint: "فقط روی نمایشگر بزرگ دیده می‌شود و با اسکرول کنار می‌رود.",
          wide: true,
        },
        { kind: "textarea", name: "footerAbout", label: "متن معرفی در فوتر", rows: 3, wide: true },
      ],
    },
    {
      title: "شبکه‌های اجتماعی",
      side: true,
      hint: "خالی بگذارید تا این بخش در فوتر دیده نشود.",
      fields: [
        {
          kind: "repeater",
          name: "social",
          label: "لینک‌ها",
          itemLabel: "لینک",
          titleField: "label",
          fields: [
            { kind: "text", name: "label", label: "عنوان" },
            { kind: "text", name: "href", label: "نشانی", dir: "ltr", wide: true },
          ],
        },
      ],
    },
  ],
};

const home: SettingsSchema = {
  key: "home",
  title: "صفحه اصلی",
  blurb:
    "همه متن‌های صفحه اصلی و انتخاب محصولات منتخب. چیدمان و انیمیشن در کد می‌ماند؛ متن و انتخاب اینجاست.",
  sections: [
    {
      title: "هدر اصلی (Hero)",
      fields: [
        { kind: "text", name: "heroEyebrow", label: "برچسب بالای تیتر" },
        { kind: "text", name: "heroTitleTop", label: "تیتر — سطر اول" },
        {
          kind: "text",
          name: "heroTitleAccent",
          label: "تیتر — سطر دوم (رنگی)",
          hint: "هر سطر در یک خط می‌ماند و نمی‌شکند، پس کوتاه بنویسید.",
        },
        { kind: "textarea", name: "heroLead", label: "متن زیر تیتر", rows: 3, wide: true },
        { kind: "text", name: "heroPrimaryLabel", label: "دکمه اول — برچسب" },
        { kind: "text", name: "heroPrimaryHref", label: "دکمه اول — مسیر", dir: "ltr" },
        { kind: "text", name: "heroSecondaryLabel", label: "دکمه دوم — برچسب" },
        { kind: "text", name: "heroSecondaryHref", label: "دکمه دوم — مسیر", dir: "ltr" },
      ],
    },
    {
      title: "اعداد زیر تیتر",
      fields: [
        {
          kind: "repeater",
          name: "stats",
          label: "اعداد",
          itemLabel: "عدد",
          titleField: "label",
          fields: [
            { kind: "text", name: "value", label: "مقدار" },
            { kind: "text", name: "label", label: "عنوان" },
          ],
        },
      ],
    },
    {
      title: "پلاک‌های شناور تصویر",
      fields: [
        { kind: "text", name: "badgeOneValue", label: "پلاک اول — مقدار", dir: "ltr" },
        { kind: "text", name: "badgeOneLabel", label: "پلاک اول — عنوان" },
        { kind: "text", name: "badgeTwoValue", label: "پلاک دوم — مقدار", dir: "ltr" },
        { kind: "text", name: "badgeTwoLabel", label: "پلاک دوم — عنوان" },
        { kind: "text", name: "heroCaption", label: "نوشته زیر تصویر", wide: true },
      ],
    },
    {
      title: "بخش دسته‌بندی‌ها",
      fields: [
        { kind: "text", name: "brandsLabel", label: "متن نوار برندها", wide: true },
        { kind: "text", name: "categoriesEyebrow", label: "برچسب" },
        { kind: "text", name: "categoriesTitle", label: "عنوان" },
        { kind: "textarea", name: "categoriesLead", label: "توضیح", rows: 2, wide: true },
      ],
    },
    {
      title: "بخش محصولات منتخب",
      fields: [
        { kind: "text", name: "featuredEyebrow", label: "برچسب" },
        { kind: "text", name: "featuredTitle", label: "عنوان" },
        { kind: "textarea", name: "featuredLead", label: "توضیح", rows: 2, wide: true },
        {
          kind: "refs",
          name: "featured",
          label: "محصولات منتخب",
          source: { collection: "products" },
          hint: "ترتیب انتخاب، همان ترتیب نمایش است. چهار مورد با گرید صفحه می‌خواند.",
          wide: true,
        },
      ],
    },
    {
      title: "بخش راهکارها",
      fields: [
        { kind: "text", name: "solutionsEyebrow", label: "برچسب" },
        { kind: "text", name: "solutionsTitle", label: "عنوان", wide: true },
        { kind: "textarea", name: "solutionsLead", label: "توضیح", rows: 2, wide: true },
      ],
    },
    {
      title: "بخش «چرا ما»",
      fields: [
        { kind: "text", name: "trustEyebrow", label: "برچسب" },
        { kind: "text", name: "trustTitle", label: "عنوان", wide: true },
        {
          kind: "repeater",
          name: "trust",
          label: "ستون‌ها",
          itemLabel: "ستون",
          titleField: "title",
          fields: [
            { kind: "text", name: "title", label: "عنوان", wide: true },
            { kind: "textarea", name: "body", label: "متن", rows: 3, wide: true },
          ],
        },
      ],
    },
    {
      title: "بخش پروژه‌ها",
      fields: [
        { kind: "text", name: "projectsEyebrow", label: "برچسب" },
        { kind: "text", name: "projectsTitle", label: "عنوان" },
        { kind: "textarea", name: "projectsLead", label: "توضیح", rows: 2, wide: true },
      ],
    },
    {
      title: "بخش خدمات",
      fields: [
        { kind: "text", name: "servicesEyebrow", label: "برچسب" },
        { kind: "text", name: "servicesTitle", label: "عنوان", wide: true },
        { kind: "textarea", name: "servicesLead", label: "توضیح", rows: 2, wide: true },
      ],
    },
    {
      title: "بخش راهنما",
      fields: [
        { kind: "text", name: "knowledgeEyebrow", label: "برچسب" },
        { kind: "text", name: "knowledgeTitle", label: "عنوان", wide: true },
      ],
    },
    {
      title: "فراخوان پایانی",
      side: true,
      fields: [
        { kind: "text", name: "ctaTitle", label: "عنوان", wide: true },
        { kind: "textarea", name: "ctaLead", label: "توضیح", rows: 3, wide: true },
        { kind: "text", name: "ctaPrimaryLabel", label: "دکمه اول — برچسب", wide: true },
        { kind: "text", name: "ctaPrimaryHref", label: "دکمه اول — مسیر", dir: "ltr", wide: true },
        { kind: "text", name: "ctaSecondaryLabel", label: "دکمه دوم — برچسب", wide: true },
        { kind: "text", name: "ctaSecondaryHref", label: "دکمه دوم — مسیر", dir: "ltr", wide: true },
      ],
    },
  ],
};

const nav: SettingsSchema = {
  key: "nav",
  title: "منوها",
  blurb:
    "منوی اصلی و گروه‌بندی مگامنو. سه ستون اول فوتر و فهرست دسته‌ها در مگامنو خودکار از محتوا ساخته می‌شوند، پس دسته یا صنعت تازه بدون کار اضافه در منو ظاهر می‌شود.",
  sections: [
    {
      title: "منوی اصلی",
      fields: [
        {
          kind: "repeater",
          name: "primary",
          label: "آیتم‌ها",
          itemLabel: "آیتم",
          titleField: "label",
          fields: [
            { kind: "text", name: "label", label: "برچسب" },
            { kind: "text", name: "href", label: "مسیر", dir: "ltr" },
            {
              kind: "select",
              name: "mega",
              label: "مگامنو",
              source: { enumKey: "megaKey" },
              allowEmpty: true,
              hint: "اگر خالی باشد، آیتم فقط یک لینک ساده است.",
              wide: true,
            },
          ],
        },
      ],
    },
    {
      title: "گروه‌های دسته‌بندی",
      hint: "هر دسته با فیلد «گروه مگامنو» به یکی از این‌ها وصل می‌شود. گروهی با کلید consumable در مشاور، محصولاتش را از رتبه‌بندی دستگاه‌ها جدا نگه می‌دارد.",
      fields: [
        {
          kind: "repeater",
          name: "categoryGroups",
          label: "گروه‌ها",
          itemLabel: "گروه",
          titleField: "title",
          fields: [
            { kind: "text", name: "key", label: "کلید", dir: "ltr" },
            { kind: "text", name: "title", label: "عنوان" },
          ],
        },
      ],
    },
    {
      title: "گروه‌های مگامنوی راهکارها",
      fields: [
        {
          kind: "repeater",
          name: "solutionGroups",
          label: "گروه‌ها",
          itemLabel: "گروه",
          titleField: "title",
          fields: [
            { kind: "text", name: "title", label: "عنوان", wide: true },
            {
              kind: "refs",
              name: "items",
              label: "صنایع",
              source: { collection: "industries" },
              wide: true,
            },
          ],
        },
      ],
    },
    {
      title: "گروه‌های مگامنوی خدمات",
      fields: [
        {
          kind: "repeater",
          name: "serviceGroups",
          label: "گروه‌ها",
          itemLabel: "گروه",
          titleField: "title",
          fields: [
            { kind: "text", name: "title", label: "عنوان", wide: true },
            {
              kind: "refs",
              name: "items",
              label: "خدمات",
              source: { collection: "services" },
              wide: true,
            },
          ],
        },
      ],
    },
    {
      title: "ستون‌های دستی فوتر",
      side: true,
      hint: "پس از سه ستون خودکار (محصولات، راهکارها، خدمات) می‌آیند.",
      fields: [
        {
          kind: "repeater",
          name: "footer",
          label: "ستون‌ها",
          itemLabel: "ستون",
          titleField: "title",
          fields: [
            { kind: "text", name: "title", label: "عنوان ستون", wide: true },
            {
              kind: "repeater",
              name: "links",
              label: "لینک‌ها",
              itemLabel: "لینک",
              titleField: "label",
              fields: [
                { kind: "text", name: "label", label: "برچسب" },
                { kind: "text", name: "href", label: "مسیر", dir: "ltr" },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const settingsSchemas = { site, home, nav } as const;

export function getSettingsSchema(key: string): SettingsSchema | undefined {
  return (settingsSchemas as Record<string, SettingsSchema>)[key];
}
