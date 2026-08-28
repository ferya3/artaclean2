/**
 * مدل داده کاتالوگ.
 *
 * اصل طراحی: مشخصات فنی به‌صورت «صفت‌های نام‌دار» (attributes) نگهداری می‌شوند،
 * نه ستون‌های ثابت. بنابراین افزودن دستگاهی با ۷۰ ویژگی متفاوت، تغییر schema
 * لازم ندارد و همان ساختار مستقیماً به یک EAV/JSONB در دیتابیس یا به یک CMS
 * headless نگاشت می‌شود.
 *
 * سه چیز از هم جدا نگه داشته شده‌اند:
 *   1) specs        → داده خام قابل مقایسه (عدد + واحد)   ← موتور مقایسه و فیلتر
 *   2) facets       → مقادیر گسسته برای فیلتر/جستجو        ← صفحه دسته‌بندی
 *   3) fit          → دامنه تناسب با نیاز کاربر            ← Product Advisor
 */

export type Id = string;

export type SurfaceKind =
  | "factory-floor"
  | "warehouse"
  | "parking"
  | "production-line"
  | "machinery"
  | "vertical"
  | "carpet";

export type DirtKind =
  | "dust"
  | "oil"
  | "grease"
  | "mud"
  | "food"
  | "chemical";

export type AreaBand = "lt500" | "500-2000" | "2000-10000" | "gt10000";

export type FrequencyBand = "daily" | "weekly" | "monthly" | "seasonal";

export type MachineType = "walk-behind" | "ride-on" | "robotic" | "stationary" | "handheld";

export type PowerSource = "battery" | "electric" | "diesel" | "petrol" | "pneumatic";

export type BrushType = "disc" | "cylindrical" | "orbital" | "none";

/** یک ردیف مشخصات: عدد قابل مقایسه + نمایش انسانی. */
export interface Spec {
  key: string;
  label: string;
  /** عدد خام برای مقایسه/مرتب‌سازی؛ برای مقادیر غیرعددی خالی می‌ماند. */
  value?: number;
  unit?: string;
  /** متن جایگزین وقتی مقدار عددی نیست (مثلاً «لیتیوم-یون»). */
  text?: string;
  /** آیا در کارت محصول و نوار KPI دیده شود. */
  highlight?: boolean;
}

export interface SpecGroup {
  title: string;
  specs: Spec[];
}

export interface Feature {
  title: string;
  body: string;
}

export interface Download {
  title: string;
  kind: "datasheet" | "manual" | "certificate" | "brochure";
  size: string;
  href: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface SparePart {
  partNo: string;
  title: string;
  category: string;
  /** مدل‌هایی که این قطعه روی آن‌ها می‌نشیند. */
  fitsModels: Id[];
  price?: number;
  inStock: boolean;
}

export interface Product {
  slug: Id;
  name: string;
  model: string;
  brand: Id;
  category: Id;
  subcategory?: string;
  tagline: string;
  summary: string;
  badges?: string[];

  /** KPIهای بصری صفحه محصول (حداکثر ۴ تا). */
  kpis: Spec[];
  specGroups: SpecGroup[];
  features: Feature[];

  /** صنایعی که این دستگاه در آن‌ها می‌نشیند + یک جمله توضیح برای هرکدام. */
  applications: { industry: Id; note: string }[];

  facets: {
    machineType: MachineType;
    powerSource: PowerSource;
    brushType: BrushType;
    /** بازه متراژ پوششی (m²) برای فیلتر و امتیازدهی. */
    areaMin: number;
    areaMax: number;
    /** عرض کار (mm) برای فیلتر بازه‌ای. */
    workingWidth?: number;
  };

  fit: {
    surfaces: SurfaceKind[];
    dirt: DirtKind[];
    frequency: FrequencyBand[];
  };

  /** RFQ برای دستگاه سنگین، قیمت مستقیم برای مصرفی و لوازم جانبی. */
  priceMode: "rfq" | "listed";
  price?: number;

  accessories: string[];
  downloads: Download[];
  faqs: Faq[];
  related: Id[];
}

export interface Category {
  slug: Id;
  name: string;
  latin: string;
  /** گروه‌بندی مگامنو: نظافت کف / فشار بالا / تخصصی / مصرفی */
  group: "floor" | "high-pressure" | "specialised" | "consumable";
  blurb: string;
  buyingGuide?: Id;
  /** فیلترهایی که برای این دسته معنا دارند. */
  filters: FilterKey[];
}

export type FilterKey =
  | "machineType"
  | "powerSource"
  | "area"
  | "workingWidth"
  | "brushType"
  | "brand";

export interface Industry {
  slug: Id;
  name: string;
  latin: string;
  blurb: string;
  /** مسائل رایج این صنعت → ورودی مسیر Problem → Solution → Product */
  problems: { key: string; title: string; body: string; dirt: DirtKind[] }[];
  recommendedCategories: Id[];
  metrics: { label: string; value: string }[];
}

export interface Brand {
  slug: Id;
  name: string;
  country: string;
  blurb: string;
  since: number;
}

export interface Service {
  slug: Id;
  name: string;
  latin: string;
  blurb: string;
  body: string;
  bullets: string[];
}

export interface Article {
  slug: Id;
  title: string;
  kind: "buying-guide" | "cleaning-guide" | "comparison" | "case-study";
  excerpt: string;
  readingTime: number;
  date: string;
  body: string[];
  relatedCategories: Id[];
}

export interface Project {
  slug: Id;
  title: string;
  industry: Id;
  location: string;
  area: string;
  machines: Id[];
  result: string;
}
