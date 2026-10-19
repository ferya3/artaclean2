import type { CollectionSchema, ContentCollection, Field } from "@/lib/admin/fields";

/**
 * توصیف هر مجموعه محتوا.
 *
 * این فایل تنها جایی است که «شکل محصول» برای پنل تعریف می‌شود. افزودن یک
 * مشخصه تازه به دستگاه‌ها، یا یک فیلد تازه به صنعت، یک سطر اینجاست.
 */

/* ──────────────────────────────────────── تکه‌های تکرارشونده */

const specFields: Field[] = [
  {
    kind: "text",
    name: "key",
    label: "کلید",
    dir: "ltr",
    hint: "شناسه لاتین مشخصه. مقایسه و نوار نسبت بر اساس همین کلید کار می‌کنند، پس در همه مدل‌ها باید یکسان باشد (مثلاً coverage، width، tank).",
  },
  { kind: "text", name: "label", label: "عنوان فارسی" },
  {
    kind: "number",
    name: "value",
    label: "مقدار عددی",
    hint: "فقط عدد، بدون واحد. خالی بگذارید اگر مقدار متنی است.",
  },
  { kind: "text", name: "unit", label: "واحد", dir: "ltr" },
  {
    kind: "text",
    name: "text",
    label: "مقدار متنی",
    hint: "جایگزین مقدار عددی — مثلاً «لیتیوم-یون». اگر مقدار عددی پر باشد، نادیده گرفته می‌شود.",
  },
  { kind: "boolean", name: "highlight", label: "در کارت محصول برجسته شود" },
];

const cardFields: Field[] = [
  { kind: "text", name: "title", label: "عنوان", wide: true },
  { kind: "textarea", name: "body", label: "متن", rows: 3, wide: true },
  { kind: "text", name: "phone", label: "تلفن (اختیاری)", dir: "ltr" },
  { kind: "text", name: "email", label: "ایمیل (اختیاری)", dir: "ltr" },
  { kind: "text", name: "ctaLabel", label: "برچسب دکمه (اختیاری)" },
  { kind: "text", name: "ctaHref", label: "مسیر دکمه (اختیاری)", dir: "ltr" },
];

/* ───────────────────────────────────────────────── محصولات */

const products: CollectionSchema = {
  key: "products",
  title: "محصولات",
  singular: "محصول",
  blurb:
    "همه‌چیز یک دستگاه از همین‌جا می‌آید: متن‌ها، مشخصات فنی، ویژگی‌های فیلتر و دامنه تناسب که ورودی مشاور انتخاب است.",
  slugLabel: "شناسه محصول",
  slugHint: "در URL دیده می‌شود. فقط حروف لاتین کوچک، رقم و خط تیره — مثلاً arta-s700.",
  titleField: "name",
  subtitleField: "model",
  publishable: true,
  orderable: true,
  publicPath: "/products/{category}/{slug}",
  sections: [
    {
      title: "شناسنامه",
      fields: [
        { kind: "text", name: "name", label: "نام محصول", required: true, wide: true },
        { kind: "text", name: "model", label: "مدل", dir: "ltr" },
        { kind: "select", name: "brand", label: "برند", source: { collection: "brands" } },
        { kind: "select", name: "category", label: "دسته‌بندی", source: { collection: "categories" } },
        { kind: "text", name: "subcategory", label: "زیردسته (متن آزاد)" },
        {
          kind: "text",
          name: "tagline",
          label: "شعار",
          hint: "یک خط، زیر نام محصول.",
          wide: true,
        },
        { kind: "textarea", name: "summary", label: "خلاصه", rows: 5, wide: true },
        {
          kind: "lines",
          name: "badges",
          label: "برچسب‌ها",
          hint: "هر برچسب در یک سطر. روی کارت محصول دیده می‌شود.",
          rows: 3,
        },
      ],
    },
    {
      title: "نوار KPI",
      hint: "چهار عددی که تصمیم خرید را می‌سازند. بالای صفحه محصول با شمارش از صفر نمایش داده می‌شوند.",
      fields: [
        {
          kind: "repeater",
          name: "kpis",
          label: "مشخصه‌های شاخص",
          itemLabel: "مشخصه",
          titleField: "label",
          fields: specFields,
        },
      ],
    },
    {
      title: "مشخصات فنی",
      hint: "گروه اول همیشه باز است و بقیه با «مشخصات کامل» باز می‌شوند. کلید هر مشخصه ورودی موتور مقایسه است.",
      fields: [
        {
          kind: "repeater",
          name: "specGroups",
          label: "گروه‌های مشخصات",
          itemLabel: "گروه",
          titleField: "title",
          fields: [
            { kind: "text", name: "title", label: "عنوان گروه", wide: true },
            {
              kind: "repeater",
              name: "specs",
              label: "مشخصه‌ها",
              itemLabel: "مشخصه",
              titleField: "label",
              fields: specFields,
            },
          ],
        },
      ],
    },
    {
      title: "ویژگی‌ها",
      fields: [
        {
          kind: "repeater",
          name: "features",
          label: "ویژگی‌ها",
          itemLabel: "ویژگی",
          titleField: "title",
          fields: [
            { kind: "text", name: "title", label: "عنوان", wide: true },
            { kind: "textarea", name: "body", label: "توضیح", rows: 3, wide: true },
          ],
        },
      ],
    },
    {
      title: "کاربردها",
      hint: "هر صنعت با یک جمله مختص همان محیط. همین فهرست، محصول را در صفحه راهکار آن صنعت هم نشان می‌دهد.",
      fields: [
        {
          kind: "repeater",
          name: "applications",
          label: "صنایع",
          itemLabel: "کاربرد",
          titleField: "industry",
          fields: [
            {
              kind: "select",
              name: "industry",
              label: "صنعت",
              source: { collection: "industries" },
            },
            { kind: "textarea", name: "note", label: "توضیح", rows: 2, wide: true },
          ],
        },
      ],
    },
    {
      title: "ویژگی‌های فیلتر",
      hint: "ورودی فیلتر وجهی صفحه دسته‌بندی و امتیازدهی متراژ در مشاور.",
      fields: [
        {
          kind: "select",
          name: "facets.machineType",
          label: "نوع دستگاه",
          source: { enumKey: "machineType" },
        },
        {
          kind: "select",
          name: "facets.powerSource",
          label: "منبع انرژی",
          source: { enumKey: "powerSource" },
        },
        {
          kind: "select",
          name: "facets.brushType",
          label: "نوع برس",
          source: { enumKey: "brushType" },
        },
        { kind: "number", name: "facets.workingWidth", label: "عرض کار", unit: "mm" },
        { kind: "number", name: "facets.areaMin", label: "کمینه متراژ پوششی", unit: "m²", min: 0 },
        {
          kind: "number",
          name: "facets.areaMax",
          label: "بیشینه متراژ پوششی",
          unit: "m²",
          min: 0,
          hint: "همین دو عدد اندازه تصویر محصول در فهرست و امتیاز متراژ در مشاور را تعیین می‌کنند.",
        },
      ],
    },
    {
      title: "دامنه تناسب",
      hint: "پاسخ‌هایی از مشاور که این دستگاه برایشان مناسب است. هیچ انتخابی = هرگز در مشاور پیشنهاد نمی‌شود.",
      fields: [
        {
          kind: "multiselect",
          name: "fit.surfaces",
          label: "سطوح",
          source: { enumKey: "surface" },
          wide: true,
        },
        {
          kind: "multiselect",
          name: "fit.dirt",
          label: "آلودگی‌ها",
          source: { enumKey: "dirt" },
          wide: true,
        },
        {
          kind: "multiselect",
          name: "fit.frequency",
          label: "تناوب استفاده",
          source: { enumKey: "frequency" },
          wide: true,
        },
      ],
    },
    {
      title: "دانلودها",
      fields: [
        {
          kind: "repeater",
          name: "downloads",
          label: "فایل‌ها",
          itemLabel: "فایل",
          titleField: "title",
          fields: [
            { kind: "text", name: "title", label: "عنوان", wide: true },
            { kind: "select", name: "kind", label: "نوع", source: { enumKey: "downloadKind" } },
            { kind: "text", name: "size", label: "حجم و قالب", dir: "ltr" },
            { kind: "text", name: "href", label: "نشانی فایل", dir: "ltr", wide: true },
          ],
        },
      ],
    },
    {
      title: "پرسش‌های متداول",
      fields: [
        {
          kind: "repeater",
          name: "faqs",
          label: "پرسش‌ها",
          itemLabel: "پرسش",
          titleField: "q",
          fields: [
            { kind: "text", name: "q", label: "پرسش", wide: true },
            { kind: "textarea", name: "a", label: "پاسخ", rows: 4, wide: true },
          ],
        },
      ],
    },
    {
      title: "قیمت",
      side: true,
      fields: [
        {
          kind: "select",
          name: "priceMode",
          label: "نحوه نمایش قیمت",
          source: {
            static: [
              { value: "rfq", label: "استعلامی" },
              { value: "listed", label: "قیمت مستقیم" },
            ],
          },
          hint: "«استعلامی» دکمه «درخواست پیش‌فاکتور» می‌دهد؛ «قیمت مستقیم» عدد را روی کارت و صفحه محصول نشان می‌دهد.",
          wide: true,
        },
        {
          kind: "number",
          name: "price",
          label: "قیمت (تومان)",
          hint: "فقط در حالت «قیمت مستقیم» دیده می‌شود.",
          wide: true,
        },
      ],
    },
    {
      title: "تصویر",
      side: true,
      fields: [{ kind: "image", name: "image", label: "تصویر محصول", wide: true }],
    },
    {
      title: "لوازم و محصولات مرتبط",
      side: true,
      fields: [
        {
          kind: "lines",
          name: "accessories",
          label: "لوازم جانبی",
          hint: "هر مورد در یک سطر.",
          rows: 4,
          wide: true,
        },
        {
          kind: "refs",
          name: "related",
          label: "محصولات مرتبط",
          source: { collection: "products" },
          wide: true,
        },
      ],
    },
  ],
};

/* ──────────────────────────────────────────── دسته‌بندی‌ها */

const categories: CollectionSchema = {
  key: "categories",
  title: "دسته‌بندی‌ها",
  singular: "دسته‌بندی",
  blurb:
    "دسته‌ها ساختار منوی محصولات و صفحه فهرست را می‌سازند. فیلترهای هر دسته هم همین‌جا تعیین می‌شود.",
  slugLabel: "شناسه دسته",
  slugHint: "در URL دیده می‌شود — مثلاً floor-scrubbers.",
  titleField: "name",
  subtitleField: "latin",
  publishable: true,
  orderable: true,
  publicPath: "/products/{slug}",
  sections: [
    {
      title: "معرفی",
      fields: [
        { kind: "text", name: "name", label: "نام فارسی", required: true },
        { kind: "text", name: "latin", label: "نام لاتین", dir: "ltr" },
        {
          kind: "select",
          name: "group",
          label: "گروه مگامنو",
          source: { enumKey: "categoryGroup" },
          hint: "گروه‌ها در تنظیمات «منو» تعریف می‌شوند. گروه «مصرفی» در مشاور، محصول را از رتبه‌بندی دستگاه‌ها جدا می‌کند.",
        },
        {
          kind: "select",
          name: "buyingGuide",
          label: "راهنمای خرید",
          source: { collection: "articles" },
          allowEmpty: true,
        },
        { kind: "textarea", name: "blurb", label: "توضیح", rows: 4, wide: true },
      ],
    },
    {
      title: "فیلترها",
      hint: "فقط فیلترهایی را فعال کنید که برای این دسته معنا دارند؛ ستون فیلتر خالی بدتر از نبودنش است.",
      side: true,
      fields: [
        {
          kind: "multiselect",
          name: "filters",
          label: "فیلترهای فعال",
          source: { enumKey: "filterKey" },
          wide: true,
        },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────── برندها */

const brands: CollectionSchema = {
  key: "brands",
  title: "برندها",
  singular: "برند",
  slugLabel: "شناسه برند",
  slugHint: "در URL دیده می‌شود — مثلاً nordline.",
  titleField: "name",
  subtitleField: "country",
  publishable: true,
  orderable: true,
  publicPath: "/brands/{slug}",
  sections: [
    {
      title: "معرفی",
      fields: [
        { kind: "text", name: "name", label: "نام برند", required: true },
        { kind: "text", name: "country", label: "کشور" },
        { kind: "number", name: "since", label: "سال تأسیس" },
        { kind: "textarea", name: "blurb", label: "توضیح", rows: 4, wide: true },
      ],
    },
  ],
};

/* ───────────────────────────────────────── صنایع (راهکارها) */

const industries: CollectionSchema = {
  key: "industries",
  title: "راهکارها (صنایع)",
  singular: "صنعت",
  blurb:
    "مسیر Problem → Solution → Product از همین‌جا شروع می‌شود: مسائل رایج هر صنعت، و دسته‌هایی که پاسخ آن‌ها هستند.",
  slugLabel: "شناسه صنعت",
  slugHint: "در URL دیده می‌شود — مثلاً warehouses.",
  titleField: "name",
  subtitleField: "latin",
  publishable: true,
  orderable: true,
  publicPath: "/solutions/{slug}",
  sections: [
    {
      title: "معرفی",
      fields: [
        { kind: "text", name: "name", label: "نام فارسی", required: true },
        { kind: "text", name: "latin", label: "نام لاتین", dir: "ltr" },
        { kind: "textarea", name: "blurb", label: "توضیح", rows: 4, wide: true },
      ],
    },
    {
      title: "مسائل رایج",
      hint: "هر مسئله یک کارت در صفحه راهکار می‌شود. «آلودگی» هر مسئله به جست‌وجوی نیت‌محور وصل است.",
      fields: [
        {
          kind: "repeater",
          name: "problems",
          label: "مسائل",
          itemLabel: "مسئله",
          titleField: "title",
          fields: [
            { kind: "text", name: "key", label: "کلید", dir: "ltr" },
            { kind: "text", name: "title", label: "عنوان" },
            { kind: "textarea", name: "body", label: "توضیح و راهکار", rows: 3, wide: true },
            {
              kind: "multiselect",
              name: "dirt",
              label: "نوع آلودگی",
              source: { enumKey: "dirt" },
              wide: true,
            },
          ],
        },
      ],
    },
    {
      title: "اعداد شاخص",
      fields: [
        {
          kind: "repeater",
          name: "metrics",
          label: "اعداد",
          itemLabel: "عدد",
          titleField: "label",
          fields: [
            { kind: "text", name: "label", label: "عنوان" },
            { kind: "text", name: "value", label: "مقدار" },
          ],
        },
      ],
    },
    {
      title: "دسته‌های پیشنهادی",
      side: true,
      fields: [
        {
          kind: "refs",
          name: "recommendedCategories",
          label: "دسته‌ها",
          source: { collection: "categories" },
          wide: true,
        },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────── خدمات */

const services: CollectionSchema = {
  key: "services",
  title: "خدمات",
  singular: "خدمت",
  slugLabel: "شناسه خدمت",
  slugHint: "در URL دیده می‌شود — مثلاً maintenance.",
  titleField: "name",
  subtitleField: "latin",
  publishable: true,
  orderable: true,
  publicPath: "/services/{slug}",
  sections: [
    {
      title: "معرفی",
      fields: [
        { kind: "text", name: "name", label: "نام خدمت", required: true },
        { kind: "text", name: "latin", label: "نام لاتین", dir: "ltr" },
        {
          kind: "textarea",
          name: "blurb",
          label: "توضیح کوتاه",
          rows: 2,
          hint: "روی کارت فهرست خدمات و زیر عنوان صفحه دیده می‌شود.",
          wide: true,
        },
        { kind: "textarea", name: "body", label: "متن کامل", rows: 6, wide: true },
      ],
    },
    {
      title: "سرفصل‌ها",
      side: true,
      fields: [
        {
          kind: "lines",
          name: "bullets",
          label: "موارد",
          hint: "هر مورد در یک سطر.",
          rows: 6,
          wide: true,
        },
      ],
    },
  ],
};

/* ───────────────────────────────────────── مقالات و راهنما */

const articles: CollectionSchema = {
  key: "articles",
  title: "راهنما و مقالات",
  singular: "مقاله",
  slugLabel: "شناسه مقاله",
  slugHint: "در URL دیده می‌شود — مثلاً how-to-choose-a-scrubber.",
  titleField: "title",
  subtitleField: "date",
  publishable: true,
  orderable: true,
  publicPath: "/knowledge/{slug}",
  sections: [
    {
      title: "مقاله",
      fields: [
        { kind: "text", name: "title", label: "عنوان", required: true, wide: true },
        { kind: "select", name: "kind", label: "نوع", source: { enumKey: "articleKind" } },
        { kind: "number", name: "readingTime", label: "زمان مطالعه (دقیقه)", min: 1 },
        {
          kind: "text",
          name: "date",
          label: "تاریخ",
          hint: "همان‌طور که باید دیده شود — مثلاً ۱۴۰۴-۰۴-۱۲.",
        },
        { kind: "textarea", name: "excerpt", label: "چکیده", rows: 3, wide: true },
        {
          kind: "lines",
          name: "body",
          label: "متن",
          hint: "هر پاراگراف در یک سطر. سطر خالی نادیده گرفته می‌شود.",
          rows: 16,
          wide: true,
        },
      ],
    },
    {
      title: "دسته‌های مرتبط",
      side: true,
      fields: [
        {
          kind: "refs",
          name: "relatedCategories",
          label: "دسته‌ها",
          source: { collection: "categories" },
          wide: true,
        },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────────── پروژه‌ها */

const projects: CollectionSchema = {
  key: "projects",
  title: "پروژه‌ها",
  singular: "پروژه",
  slugLabel: "شناسه پروژه",
  slugHint: "در URL دیده نمی‌شود ولی باید یکتا باشد — مثلاً mall-shiraz.",
  titleField: "title",
  subtitleField: "location",
  publishable: true,
  orderable: true,
  sections: [
    {
      title: "پروژه",
      fields: [
        { kind: "text", name: "title", label: "عنوان", required: true, wide: true },
        { kind: "select", name: "industry", label: "صنعت", source: { collection: "industries" } },
        { kind: "text", name: "location", label: "موقعیت" },
        { kind: "text", name: "area", label: "متراژ" },
        { kind: "textarea", name: "result", label: "نتیجه", rows: 4, wide: true },
      ],
    },
    {
      title: "دستگاه‌های نصب‌شده",
      side: true,
      fields: [
        {
          kind: "refs",
          name: "machines",
          label: "دستگاه‌ها",
          source: { collection: "products" },
          wide: true,
        },
      ],
    },
  ],
};

/* ───────────────────────────────────────────── قطعات یدکی */

const parts: CollectionSchema = {
  key: "parts",
  title: "قطعات یدکی",
  singular: "قطعه",
  blurb: "قطعه با شماره فنی یا مدل دستگاه پیدا می‌شود؛ هر دو از همین‌جا می‌آیند.",
  slugLabel: "شماره فنی",
  slugHint: "همین مقدار، شناسه قطعه هم هست — مثلاً BR-510-PPL.",
  titleField: "title",
  subtitleField: "partNo",
  publishable: true,
  orderable: true,
  sections: [
    {
      title: "قطعه",
      fields: [
        { kind: "text", name: "partNo", label: "شماره فنی", dir: "ltr", required: true },
        { kind: "text", name: "category", label: "دسته قطعه", hint: "مثلاً برس، پد، فیلتر." },
        { kind: "text", name: "title", label: "عنوان", wide: true },
        { kind: "number", name: "price", label: "قیمت (تومان)" },
        { kind: "boolean", name: "inStock", label: "موجود است" },
      ],
    },
    {
      title: "سازگاری",
      side: true,
      fields: [
        {
          kind: "refs",
          name: "fitsModels",
          label: "روی این مدل‌ها می‌نشیند",
          source: { collection: "products" },
          wide: true,
        },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────── نمایندگی‌ها */

const offices: CollectionSchema = {
  key: "offices",
  title: "نمایندگی‌ها",
  singular: "نمایندگی",
  blurb: "دفاتر و مراکز خدمات؛ در صفحه «نمایندگی‌ها» به همین ترتیب دیده می‌شوند.",
  slugLabel: "شناسه",
  slugHint: "یکتا، بدون فاصله — مثلاً tehran یا اصفهان.",
  titleField: "city",
  subtitleField: "role",
  publishable: true,
  orderable: true,
  publicPath: "/company/representatives",
  sections: [
    {
      title: "دفتر",
      fields: [
        { kind: "text", name: "city", label: "شهر", required: true },
        { kind: "text", name: "role", label: "نقش", hint: "مثلاً دفتر مرکزی، نمایندگی خدمات." },
        { kind: "text", name: "address", label: "نشانی", wide: true },
        { kind: "text", name: "phone", label: "تلفن", dir: "ltr" },
        {
          kind: "lines",
          name: "services",
          label: "خدمات این دفتر",
          hint: "هر مورد در یک سطر.",
          rows: 4,
          wide: true,
        },
      ],
    },
  ],
};

/* ───────────────────────────────────────────── صفحات ثابت */

const pages: CollectionSchema = {
  key: "pages",
  title: "صفحات",
  singular: "صفحه",
  blurb:
    "سربرگ و متن SEO هر صفحه سایت. شناسه هر صفحه در کد به مسیرش وصل است، پس شناسه را عوض نکنید مگر صفحه‌ای تازه بسازید.",
  slugLabel: "شناسه صفحه",
  slugHint: "با مسیر صفحه در کد مطابقت دارد — مثلاً about، contact، products.",
  titleField: "title",
  subtitleField: "slug",
  publishable: false,
  orderable: false,
  sections: [
    {
      title: "سربرگ",
      fields: [
        { kind: "text", name: "eyebrow", label: "برچسب بالای عنوان" },
        { kind: "text", name: "title", label: "عنوان", required: true },
        { kind: "textarea", name: "lead", label: "توضیح زیر عنوان", rows: 3, wide: true },
      ],
    },
    {
      title: "متن بدنه",
      hint: "فقط در «درباره ما» استفاده می‌شود؛ بقیه صفحات بدنه خودشان را از محتوای مرتبط می‌سازند.",
      fields: [
        {
          kind: "lines",
          name: "body",
          label: "پاراگراف‌ها",
          hint: "هر پاراگراف در یک سطر.",
          rows: 8,
          wide: true,
        },
      ],
    },
    {
      title: "کارت‌ها",
      hint: "در «درباره ما» ستون ارزش‌ها، در «گواهی‌نامه‌ها» هر استاندارد، و در «تماس» هر واحد با تلفن و ایمیل خودش.",
      fields: [
        {
          kind: "repeater",
          name: "cards",
          label: "کارت‌ها",
          itemLabel: "کارت",
          titleField: "title",
          fields: cardFields,
        },
      ],
    },
    {
      title: "SEO",
      side: true,
      fields: [
        { kind: "text", name: "metaTitle", label: "عنوان مرورگر", wide: true },
        {
          kind: "textarea",
          name: "metaDescription",
          label: "توضیح متا",
          rows: 4,
          wide: true,
        },
      ],
    },
    {
      title: "جعبه کناری",
      side: true,
      hint: "در «درباره ما» و «نمایندگی‌ها» استفاده می‌شود.",
      fields: [
        { kind: "text", name: "asideTitle", label: "عنوان", wide: true },
        { kind: "textarea", name: "asideBody", label: "متن", rows: 4, wide: true },
      ],
    },
  ],
};

/* ──────────────────────────────────────────────────── فهرست */

export const schemas: Record<ContentCollection, CollectionSchema> = {
  products,
  categories,
  brands,
  industries,
  services,
  articles,
  projects,
  parts,
  offices,
  pages,
};

/** ترتیب نمایش در منوی پنل. */
export const collectionOrder: ContentCollection[] = [
  "products",
  "categories",
  "brands",
  "industries",
  "services",
  "articles",
  "projects",
  "parts",
  "offices",
  "pages",
];

export function getSchema(key: string): CollectionSchema | undefined {
  return (schemas as Record<string, CollectionSchema>)[key];
}
