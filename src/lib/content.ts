import "server-only";

import { cache } from "react";

import { getRow, listRows } from "@/lib/db/content";
import type {
  Article,
  Brand,
  BrushType,
  Category,
  DirtKind,
  Download,
  Faq,
  Feature,
  FilterKey,
  FrequencyBand,
  Industry,
  MachineType,
  Office,
  PageCard,
  PageContent,
  PowerSource,
  Product,
  ProductCardData,
  Project,
  Service,
  SparePart,
  Spec,
  SpecGroup,
  SurfaceKind,
} from "@/lib/types";

/**
 * خواندن محتوای سایت.
 *
 * هر رکورد در دیتابیس یک JSON آزاد است، چون ساختارش را واحد فروش از پنل
 * تغییر می‌دهد. بنابراین هیچ‌جا به بدنه خام اعتماد نمی‌شود: هر رکورد از
 * یک normalize رد می‌شود که مقدار گمشده را با پیش‌فرض پر می‌کند و مقدار
 * بی‌ربط را دور می‌اندازد. نتیجه این است که یک رکورد خراب، حداکثر خودش
 * ناقص دیده می‌شود — نه اینکه کل صفحه ۵۰۰ بدهد.
 *
 * cache() از React نتیجه را در طول یک درخواست نگه می‌دارد، پس چند
 * کامپوننت سرور که همگی کاتالوگ می‌خواهند، یک بار از SQLite می‌خوانند.
 */

/* ───────────────────────────────────────────── تبدیل‌های پایه */

const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

const strs = (v: unknown): string[] =>
  arr(v).filter((x): x is string => typeof x === "string" && x.trim().length > 0);

const num = (v: unknown, fallback: number): number =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

const numOpt = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

const bool = (v: unknown, fallback = false): boolean => (typeof v === "boolean" ? v : fallback);

function oneOf<T extends string>(v: unknown, allowed: readonly T[], fallback: T): T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
}

function manyOf<T extends string>(v: unknown, allowed: readonly T[]): T[] {
  return strs(v).filter((x): x is T => (allowed as readonly string[]).includes(x));
}

const SURFACES = [
  "factory-floor",
  "warehouse",
  "parking",
  "production-line",
  "machinery",
  "vertical",
  "carpet",
] as const satisfies readonly SurfaceKind[];

const DIRTS = ["dust", "oil", "grease", "mud", "food", "chemical"] as const satisfies readonly DirtKind[];

const FREQUENCIES = [
  "daily",
  "weekly",
  "monthly",
  "seasonal",
] as const satisfies readonly FrequencyBand[];

const MACHINE_TYPES = [
  "walk-behind",
  "ride-on",
  "robotic",
  "stationary",
  "handheld",
] as const satisfies readonly MachineType[];

const POWER_SOURCES = [
  "battery",
  "electric",
  "diesel",
  "petrol",
  "pneumatic",
] as const satisfies readonly PowerSource[];

const BRUSH_TYPES = ["disc", "cylindrical", "orbital", "none"] as const satisfies readonly BrushType[];

const FILTER_KEYS = [
  "machineType",
  "powerSource",
  "area",
  "workingWidth",
  "brushType",
  "brand",
] as const satisfies readonly FilterKey[];

const DOWNLOAD_KINDS = [
  "datasheet",
  "manual",
  "certificate",
  "brochure",
] as const satisfies readonly Download["kind"][];

const ARTICLE_KINDS = [
  "buying-guide",
  "cleaning-guide",
  "comparison",
  "case-study",
] as const satisfies readonly Article["kind"][];

/* ─────────────────────────────────────────────── normalize محصول */

function normalizeSpec(v: unknown, index: number): Spec {
  const o = obj(v);
  return {
    key: str(o.key) || `spec-${index}`,
    label: str(o.label),
    value: numOpt(o.value),
    unit: str(o.unit) || undefined,
    text: str(o.text) || undefined,
    highlight: bool(o.highlight),
  };
}

function normalizeSpecGroup(v: unknown): SpecGroup {
  const o = obj(v);
  return {
    title: str(o.title),
    specs: arr(o.specs).map(normalizeSpec),
  };
}

function normalizeFeature(v: unknown): Feature {
  const o = obj(v);
  return { title: str(o.title), body: str(o.body) };
}

function normalizeDownload(v: unknown): Download {
  const o = obj(v);
  return {
    title: str(o.title),
    kind: oneOf(o.kind, DOWNLOAD_KINDS, "datasheet"),
    size: str(o.size),
    href: str(o.href, "#"),
  };
}

function normalizeFaq(v: unknown): Faq {
  const o = obj(v);
  return { q: str(o.q), a: str(o.a) };
}

export function normalizeProduct(slug: string, data: unknown): Product {
  const o = obj(data);
  const facets = obj(o.facets);
  const fit = obj(o.fit);
  const areaMin = Math.max(0, num(facets.areaMin, 0));
  const areaMax = Math.max(areaMin, num(facets.areaMax, areaMin));

  return {
    slug,
    name: str(o.name, slug),
    model: str(o.model),
    brand: str(o.brand),
    category: str(o.category),
    subcategory: str(o.subcategory) || undefined,
    tagline: str(o.tagline),
    summary: str(o.summary),
    badges: strs(o.badges),
    kpis: arr(o.kpis).map(normalizeSpec),
    specGroups: arr(o.specGroups).map(normalizeSpecGroup),
    features: arr(o.features).map(normalizeFeature),
    applications: arr(o.applications).map((a) => {
      const item = obj(a);
      return { industry: str(item.industry), note: str(item.note) };
    }),
    facets: {
      machineType: oneOf(facets.machineType, MACHINE_TYPES, "walk-behind"),
      powerSource: oneOf(facets.powerSource, POWER_SOURCES, "electric"),
      brushType: oneOf(facets.brushType, BRUSH_TYPES, "none"),
      areaMin,
      areaMax,
      workingWidth: numOpt(facets.workingWidth),
    },
    fit: {
      surfaces: manyOf(fit.surfaces, SURFACES),
      dirt: manyOf(fit.dirt, DIRTS),
      frequency: manyOf(fit.frequency, FREQUENCIES),
    },
    image: str(o.image) || undefined,
    priceMode: oneOf(o.priceMode, ["rfq", "listed"] as const, "rfq"),
    price: numOpt(o.price),
    accessories: strs(o.accessories),
    downloads: arr(o.downloads).map(normalizeDownload),
    faqs: arr(o.faqs).map(normalizeFaq),
    related: strs(o.related),
  };
}

/* ───────────────────────────────────── normalize بقیه مجموعه‌ها */

export function normalizeCategory(slug: string, data: unknown): Category {
  const o = obj(data);
  const filters = manyOf(o.filters, FILTER_KEYS);
  return {
    slug,
    name: str(o.name, slug),
    latin: str(o.latin),
    group: str(o.group, "floor") as Category["group"],
    blurb: str(o.blurb),
    buyingGuide: str(o.buyingGuide) || undefined,
    // دسته بدون فیلتر، صفحه‌ای بدون ستون کناری می‌دهد؛ برند همیشه معنا دارد.
    filters: filters.length ? filters : ["brand"],
  };
}

export function normalizeBrand(slug: string, data: unknown): Brand {
  const o = obj(data);
  return {
    slug,
    name: str(o.name, slug),
    country: str(o.country),
    blurb: str(o.blurb),
    since: num(o.since, 0),
  };
}

export function normalizeIndustry(slug: string, data: unknown): Industry {
  const o = obj(data);
  return {
    slug,
    name: str(o.name, slug),
    latin: str(o.latin),
    blurb: str(o.blurb),
    problems: arr(o.problems).map((p, i) => {
      const item = obj(p);
      return {
        key: str(item.key) || `problem-${i}`,
        title: str(item.title),
        body: str(item.body),
        dirt: manyOf(item.dirt, DIRTS),
      };
    }),
    recommendedCategories: strs(o.recommendedCategories),
    metrics: arr(o.metrics).map((m) => {
      const item = obj(m);
      return { label: str(item.label), value: str(item.value) };
    }),
  };
}

export function normalizeService(slug: string, data: unknown): Service {
  const o = obj(data);
  return {
    slug,
    name: str(o.name, slug),
    latin: str(o.latin),
    blurb: str(o.blurb),
    body: str(o.body),
    bullets: strs(o.bullets),
  };
}

export function normalizeArticle(slug: string, data: unknown): Article {
  const o = obj(data);
  return {
    slug,
    title: str(o.title, slug),
    kind: oneOf(o.kind, ARTICLE_KINDS, "buying-guide"),
    excerpt: str(o.excerpt),
    readingTime: Math.max(1, num(o.readingTime, 5)),
    date: str(o.date),
    body: strs(o.body),
    relatedCategories: strs(o.relatedCategories),
  };
}

export function normalizeProject(slug: string, data: unknown): Project {
  const o = obj(data);
  return {
    slug,
    title: str(o.title, slug),
    industry: str(o.industry),
    location: str(o.location),
    area: str(o.area),
    machines: strs(o.machines),
    result: str(o.result),
  };
}

export function normalizePart(slug: string, data: unknown): SparePart {
  const o = obj(data);
  return {
    partNo: str(o.partNo, slug),
    title: str(o.title),
    category: str(o.category, "سایر"),
    fitsModels: strs(o.fitsModels),
    price: numOpt(o.price),
    inStock: bool(o.inStock, true),
  };
}

export function normalizeOffice(slug: string, data: unknown): Office {
  const o = obj(data);
  return {
    slug,
    city: str(o.city, slug),
    role: str(o.role),
    address: str(o.address),
    phone: str(o.phone),
    services: strs(o.services),
  };
}

function normalizeCard(v: unknown): PageCard {
  const o = obj(v);
  return {
    title: str(o.title),
    body: str(o.body),
    phone: str(o.phone) || undefined,
    email: str(o.email) || undefined,
    ctaLabel: str(o.ctaLabel) || undefined,
    ctaHref: str(o.ctaHref) || undefined,
  };
}

export function normalizePage(slug: string, data: unknown): PageContent {
  const o = obj(data);
  const title = str(o.title, slug);
  return {
    slug,
    eyebrow: str(o.eyebrow),
    title,
    lead: str(o.lead),
    metaTitle: str(o.metaTitle) || title,
    metaDescription: str(o.metaDescription) || str(o.lead),
    body: strs(o.body),
    cards: arr(o.cards).map(normalizeCard),
    asideTitle: str(o.asideTitle) || undefined,
    asideBody: str(o.asideBody) || undefined,
  };
}

/* ─────────────────────────────────────────────── خواندن مجموعه‌ها */

function collection<T>(
  name: string,
  normalize: (slug: string, data: unknown) => T,
  includeDrafts = false,
): T[] {
  return listRows(name, includeDrafts).map((row) => normalize(row.slug, row.data));
}

function single<T>(
  name: string,
  slug: string,
  normalize: (slug: string, data: unknown) => T,
  includeDrafts = false,
): T | undefined {
  const row = getRow(name, slug);
  if (!row) return undefined;
  if (!includeDrafts && !row.published) return undefined;
  return normalize(row.slug, row.data);
}

export const getProducts = cache((): Product[] => collection("products", normalizeProduct));
export const getCategories = cache((): Category[] => collection("categories", normalizeCategory));
export const getBrands = cache((): Brand[] => collection("brands", normalizeBrand));
export const getIndustries = cache((): Industry[] => collection("industries", normalizeIndustry));
export const getServices = cache((): Service[] => collection("services", normalizeService));
export const getArticles = cache((): Article[] => collection("articles", normalizeArticle));
export const getProjects = cache((): Project[] => collection("projects", normalizeProject));
export const getParts = cache((): SparePart[] => collection("parts", normalizePart));
export const getOffices = cache((): Office[] => collection("offices", normalizeOffice));

export const getProduct = (slug: string) => single("products", slug, normalizeProduct);
export const getCategory = (slug: string) => single("categories", slug, normalizeCategory);
export const getBrand = (slug: string) => single("brands", slug, normalizeBrand);
export const getIndustry = (slug: string) => single("industries", slug, normalizeIndustry);
export const getService = (slug: string) => single("services", slug, normalizeService);
export const getArticle = (slug: string) => single("articles", slug, normalizeArticle);
export const getProject = (slug: string) => single("projects", slug, normalizeProject);

/**
 * صفحه ثابت.
 *
 * برخلاف بقیه، نبودِ رکورد نباید ۴۰۴ بدهد: مسیر `/company/about` در کد
 * وجود دارد و اگر کسی رکوردش را پاک کند، باید همچنان صفحه‌ای — هرچند خالی —
 * رندر شود.
 */
export const getPage = cache((slug: string): PageContent => {
  const row = getRow("pages", slug);
  return normalizePage(slug, row?.data ?? {});
});

/* ───────────────────────────────────────────── نماهای کاتالوگ */

export const productsByCategory = (category: string) =>
  getProducts().filter((p) => p.category === category);

export const productsByBrand = (brand: string) => getProducts().filter((p) => p.brand === brand);

export const productsByIndustry = (industry: string) =>
  getProducts().filter((p) => p.applications.some((a) => a.industry === industry));

/** دسته‌هایی که محتوای مصرفی‌اند — ورودی جداسازی «دستگاه» از «مکمل» در مشاور. */
export const consumableCategorySlugs = cache((): string[] =>
  getCategories()
    .filter((c) => c.group === "consumable")
    .map((c) => c.slug),
);

/**
 * کوچک کردن محصول تا اندازه‌ای که کارت و فیلتر لازم دارند.
 *
 * صفحه دسته‌بندی و مشاور فهرست محصول را به کامپوننت کلاینت می‌دهند؛ بدون
 * این، کل `specGroups` هر محصول هم با آن می‌رود و صفحه مشاور با کاتالوگ
 * واقعی چند مگابایتی می‌شود.
 */
export function toCardData(p: Product): ProductCardData {
  return {
    slug: p.slug,
    name: p.name,
    model: p.model,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    tagline: p.tagline,
    badges: p.badges,
    kpis: p.kpis,
    facets: p.facets,
    fit: p.fit,
    applications: p.applications,
    image: p.image,
    priceMode: p.priceMode,
    price: p.price,
  };
}

/** همه‌چیزی که موتور جست‌وجو برای ساخت نتیجه لازم دارد. */
export const searchCorpus = cache(() => ({
  products: getProducts(),
  categories: getCategories(),
  industries: getIndustries(),
  articles: getArticles(),
  parts: getParts(),
  services: getServices(),
  brands: getBrands(),
}));

/* ──────────────────────────────────────────── نسخه شامل پیش‌نویس */

export const adminProducts = (): (Product & { published: boolean })[] =>
  listRows("products", true).map((row) => ({
    ...normalizeProduct(row.slug, row.data),
    published: row.published,
  }));
