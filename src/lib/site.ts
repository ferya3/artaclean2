import "server-only";

import { cache } from "react";

import { readSetting } from "@/lib/db/content";

/**
 * تنظیمات سایت.
 *
 * برخلاف محتوا، تنظیمات seed نمی‌شوند: پیش‌فرض‌ها همین‌جا در کد می‌مانند و
 * جدول settings فقط چیزهایی را نگه می‌دارد که از پنل عوض شده‌اند. نتیجه این
 * است که افزودن یک کلید تازه به این فایل، هیچ مهاجرتی لازم ندارد و روی
 * نصب‌های موجود هم بلافاصله مقدار درست را می‌گیرد.
 */

export interface SiteSettings {
  brandName: string;
  brandShort: string;
  description: string;
  /** شماره برای لینک tel: — فقط رقم و +. */
  phone: string;
  /** همان شماره، به شکلی که روی صفحه دیده می‌شود. */
  phoneDisplay: string;
  email: string;
  address: string;
  hours: string;
  topbar: string;
  footerAbout: string;
  social: { label: string; href: string }[];
}

export interface HomeSettings {
  heroEyebrow: string;
  heroTitleTop: string;
  heroTitleAccent: string;
  heroLead: string;
  heroPrimaryLabel: string;
  heroPrimaryHref: string;
  heroSecondaryLabel: string;
  heroSecondaryHref: string;
  stats: { value: string; label: string }[];
  badgeOneValue: string;
  badgeOneLabel: string;
  badgeTwoValue: string;
  badgeTwoLabel: string;
  heroCaption: string;
  brandsLabel: string;
  categoriesEyebrow: string;
  categoriesTitle: string;
  categoriesLead: string;
  featuredEyebrow: string;
  featuredTitle: string;
  featuredLead: string;
  /** شناسه محصولاتی که در نوار «منتخب» می‌آیند. */
  featured: string[];
  solutionsEyebrow: string;
  solutionsTitle: string;
  solutionsLead: string;
  trustEyebrow: string;
  trustTitle: string;
  trust: { title: string; body: string }[];
  projectsEyebrow: string;
  projectsTitle: string;
  projectsLead: string;
  servicesEyebrow: string;
  servicesTitle: string;
  servicesLead: string;
  knowledgeEyebrow: string;
  knowledgeTitle: string;
  ctaTitle: string;
  ctaLead: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

export interface NavSettings {
  primary: { label: string; href: string; mega: string }[];
  /** گروه‌بندی مگامنوی محصولات — دسته‌ها خودشان بر اساس `group` توزیع می‌شوند. */
  categoryGroups: { key: string; title: string }[];
  solutionGroups: { title: string; items: string[] }[];
  serviceGroups: { title: string; items: string[] }[];
  footer: { title: string; links: { label: string; href: string }[] }[];
}

/* ───────────────────────────────────────────────────── پیش‌فرض‌ها */

export const defaultSite: SiteSettings = {
  brandName: "آرتا کلین",
  brandShort: "AC",
  description:
    "تأمین تجهیزات نظافت صنعتی، مشاوره انتخاب دستگاه بر اساس شرایط واقعی سایت، و پشتیبانی فنی و قطعات پس از فروش.",
  phone: "+982100000000",
  phoneDisplay: "021-0000 0000",
  email: "sales@example.com",
  address: "تهران، جاده مخصوص کرج — نمایشگاه دائمی تجهیزات و انبار قطعات.",
  hours: "شنبه تا چهارشنبه ۸:۰۰ تا ۱۷:۰۰ · پنجشنبه ۸:۰۰ تا ۱۳:۰۰",
  topbar:
    "مشاوره فنی رایگان پیش از خرید — انتخاب دستگاه بر اساس متراژ و نوع آلودگی سایت شما",
  footerAbout:
    "تأمین تجهیزات نظافت صنعتی، مشاوره انتخاب دستگاه بر اساس شرایط واقعی سایت، و پشتیبانی فنی و قطعات پس از فروش.",
  social: [],
};

export const defaultHome: HomeSettings = {
  heroEyebrow: "تجهیزات نظافت صنعتی",
  heroTitleTop: "نظافت صنعتی،",
  heroTitleAccent: "سریع‌تر و ارزان‌تر",
  heroLead:
    "از کارخانه و انبار تا بیمارستان و مجتمع تجاری. ما اول شرایط سایت شما را می‌سنجیم، بعد دستگاه پیشنهاد می‌دهیم — نه برعکس.",
  heroPrimaryLabel: "دستگاه مناسبم را پیدا کن",
  heroPrimaryHref: "/advisor",
  heroSecondaryLabel: "مشاهده تجهیزات",
  heroSecondaryHref: "/products",
  stats: [
    { value: "۲۸", label: "سال سابقه" },
    { value: "۱۲۰۰+", label: "دستگاه نصب‌شده" },
    { value: "۹۶٪", label: "تمدید قرارداد سرویس" },
  ],
  badgeOneValue: "5,000",
  badgeOneLabel: "m²/h راندمان",
  badgeTwoValue: "5.5",
  badgeTwoLabel: "ساعت کارکرد",
  heroCaption: "یک اپراتور · یک شیفت · ۱۸٬۰۰۰ متر مربع",
  brandsLabel: "برندهای موجود در کاتالوگ:",
  categoriesEyebrow: "محصولات",
  categoriesTitle: "دسته‌بندی تجهیزات",
  categoriesLead: "اگر می‌دانید دنبال چه نوع دستگاهی هستید، از اینجا شروع کنید.",
  featuredEyebrow: "منتخب",
  featuredTitle: "پرکاربردترین دستگاه‌ها",
  featuredLead: "مدل‌هایی که بیشترین تناسب را با سایت‌های صنعتی ایران داشته‌اند.",
  featured: ["vertex-r850", "arta-s700", "arta-w800", "vertex-ax60"],
  solutionsEyebrow: "راهکارها",
  solutionsTitle: "اگر مدل دستگاه را نمی‌دانید، از مسئله شروع کنید",
  solutionsLead: "هر صنعت، ترکیب آلودگی و محدودیت خودش را دارد. راهکار را از همان‌جا می‌بندیم.",
  trustEyebrow: "چرا ما",
  trustTitle: "خرید دستگاه صنعتی، نقطه پایان معامله نیست؛ نقطه شروع رابطه است",
  trust: [
    {
      title: "مشاوره فنی پیش از خرید",
      body: "انتخاب دستگاه بر اساس متراژ، نوع کف و آلودگی واقعی سایت — نه بر اساس موجودی انبار.",
    },
    {
      title: "گارانتی مکتوب",
      body: "۱۲ ماه دستگاه و ۲۴ ماه باتری لیتیوم، با شرایط شفاف پیش از خرید.",
    },
    {
      title: "سرویس در محل",
      body: "قرارداد نگهداری پیشگیرانه و اعزام تکنسین برای خرابی اضطراری.",
    },
    { title: "قطعات تا ۱۰ سال", body: "تأمین مصرفی و قطعه یدکی برای تمام مدل‌های فروخته‌شده." },
    {
      title: "آموزش اپراتور",
      body: "دوره در محل؛ چون بیشتر خرابی‌های زودرس ریشه در استفاده نادرست دارد.",
    },
  ],
  projectsEyebrow: "پروژه‌ها",
  projectsTitle: "پروژه‌های اجراشده",
  projectsLead: "مشخصات سایت، دستگاه انتخاب‌شده و نتیجه — به‌جای شعار.",
  servicesEyebrow: "خدمات",
  servicesTitle: "نصب، سرویس، تعمیر، قطعات، آموزش، اجاره",
  servicesLead:
    "برای تجهیزات صنعتی، خدمات پس از فروش بخشی از فروش است، نه یک صفحه فرعی.",
  knowledgeEyebrow: "راهنما",
  knowledgeTitle: "پیش از خرید، این‌ها را بخوانید",
  ctaTitle: "برای پروژه خودتان دستگاه مناسب پیدا کنید",
  ctaLead:
    "متراژ، نوع کف و آلودگی را بگویید؛ فهرست کوتاه دستگاه‌های مناسب به‌همراه برآورد زمان نظافت را دریافت کنید.",
  ctaPrimaryLabel: "شروع مشاور انتخاب",
  ctaPrimaryHref: "/advisor",
  ctaSecondaryLabel: "درخواست پیش‌فاکتور",
  ctaSecondaryHref: "/quote",
};

export const defaultNav: NavSettings = {
  primary: [
    { label: "محصولات", href: "/products", mega: "products" },
    { label: "راهکارها", href: "/solutions", mega: "solutions" },
    { label: "برندها", href: "/brands", mega: "" },
    { label: "خدمات", href: "/services", mega: "services" },
    { label: "راهنمای خرید", href: "/knowledge", mega: "" },
    { label: "پروژه‌ها", href: "/company/projects", mega: "" },
  ],
  categoryGroups: [
    { key: "floor", title: "نظافت کف" },
    { key: "high-pressure", title: "نظافت فشار بالا" },
    { key: "specialised", title: "نظافت تخصصی" },
    { key: "consumable", title: "مصرفی و جانبی" },
  ],
  solutionGroups: [
    { title: "صنایع تولیدی", items: ["factories", "food-industry", "automotive", "construction"] },
    { title: "لجستیک و تجاری", items: ["warehouses", "retail", "parking"] },
    { title: "خدماتی و درمانی", items: ["hospitals", "hotels", "offices", "restaurants"] },
  ],
  serviceGroups: [
    { title: "پیش از خرید", items: ["rental", "training"] },
    { title: "پس از فروش", items: ["installation", "maintenance", "repair", "warranty"] },
    { title: "تأمین", items: ["spare-parts"] },
  ],
  footer: [
    {
      title: "شرکت",
      links: [
        { label: "درباره ما", href: "/company/about" },
        { label: "پروژه‌ها", href: "/company/projects" },
        { label: "نمایندگی‌ها", href: "/company/representatives" },
        { label: "گواهی‌نامه‌ها", href: "/company/certifications" },
        { label: "تماس با ما", href: "/company/contact" },
        { label: "راهنمای خرید", href: "/knowledge" },
        { label: "قطعات یدکی", href: "/spare-parts" },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────────────── خواندن */

/**
 * ادغام کم‌عمق کافی است و عمداً انتخاب شده:
 * پنل همیشه کل سند را ذخیره می‌کند، پس کلید نیمه‌پرشده وجود ندارد. تنها
 * حالتی که مقدار ذخیره‌شده ناقص است، افزودن یک کلید تازه به کد است — و
 * همان با این ادغام از پیش‌فرض پر می‌شود.
 */
function merge<T extends object>(key: string, defaults: T): T {
  const stored = readSetting(key);
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) return defaults;

  const out = { ...defaults } as Record<string, unknown>;
  for (const [k, v] of Object.entries(stored as Record<string, unknown>)) {
    if (!(k in defaults)) continue;
    if (v === undefined || v === null) continue;
    // نوع باید با پیش‌فرض بخواند، وگرنه یک رشته به‌جای آرایه، صفحه را می‌اندازد.
    if (Array.isArray((defaults as Record<string, unknown>)[k]) !== Array.isArray(v)) continue;
    if (typeof v !== typeof (defaults as Record<string, unknown>)[k]) continue;
    out[k] = v;
  }
  return out as T;
}

export const siteSettings = cache((): SiteSettings => merge("site", defaultSite));
export const homeSettings = cache((): HomeSettings => merge("home", defaultHome));
export const navSettings = cache((): NavSettings => merge("nav", defaultNav));
