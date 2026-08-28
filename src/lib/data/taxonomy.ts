import type {
  AreaBand,
  BrushType,
  Category,
  DirtKind,
  FrequencyBand,
  MachineType,
  PowerSource,
  SurfaceKind,
} from "@/lib/types";

/** برچسب‌های فارسی مقادیر گسسته — تنها منبع حقیقت برای UI و فیلترها. */

export const surfaceLabels: Record<SurfaceKind, string> = {
  "factory-floor": "کف کارخانه",
  warehouse: "انبار",
  parking: "پارکینگ",
  "production-line": "خط تولید",
  machinery: "ماشین‌آلات",
  vertical: "سطوح عمودی",
  carpet: "فرش و موکت",
};

export const dirtLabels: Record<DirtKind, string> = {
  dust: "گرد و خاک",
  oil: "روغن",
  grease: "گریس",
  mud: "گل و خاک",
  food: "مواد غذایی",
  chemical: "مواد شیمیایی",
};

export const areaLabels: Record<AreaBand, string> = {
  lt500: "زیر ۵۰۰ متر",
  "500-2000": "۵۰۰ تا ۲٬۰۰۰ متر",
  "2000-10000": "۲٬۰۰۰ تا ۱۰٬۰۰۰ متر",
  gt10000: "بالای ۱۰٬۰۰۰ متر",
};

export const areaBandRange: Record<AreaBand, [number, number]> = {
  lt500: [0, 500],
  "500-2000": [500, 2000],
  "2000-10000": [2000, 10000],
  gt10000: [10000, 100000],
};

export const frequencyLabels: Record<FrequencyBand, string> = {
  daily: "روزانه / چند شیفت",
  weekly: "هفتگی",
  monthly: "ماهانه",
  seasonal: "فصلی یا موردی",
};

export const machineTypeLabels: Record<MachineType, string> = {
  "walk-behind": "دستی (Walk-Behind)",
  "ride-on": "سرنشین‌دار (Ride-On)",
  robotic: "خودران (Robotic)",
  stationary: "ثابت / مرکزی",
  handheld: "قابل حمل",
};

export const powerSourceLabels: Record<PowerSource, string> = {
  battery: "باتری",
  electric: "برقی",
  diesel: "دیزلی",
  petrol: "بنزینی",
  pneumatic: "بادی (ATEX)",
};

export const brushTypeLabels: Record<BrushType, string> = {
  disc: "دیسکی",
  cylindrical: "رولی",
  orbital: "اوربیتال",
  none: "بدون برس",
};

export const workingWidthBands: { key: string; label: string; range: [number, number] }[] = [
  { key: "lt500", label: "زیر ۵۰ سانتی‌متر", range: [0, 500] },
  { key: "500-800", label: "۵۰ تا ۸۰ سانتی‌متر", range: [500, 800] },
  { key: "800-1000", label: "۸۰ تا ۱۰۰ سانتی‌متر", range: [800, 1000] },
  { key: "gt1000", label: "بالای ۱۰۰ سانتی‌متر", range: [1000, 10000] },
];

export const categories: Category[] = [
  {
    slug: "floor-scrubbers",
    name: "اسکرابر (کفشوی صنعتی)",
    latin: "Scrubber Dryers",
    group: "floor",
    blurb:
      "شستشو و خشک‌کردن هم‌زمان سطوح بزرگ صنعتی و تجاری، در یک پاس. جایگزین اصلی تی و شستشوی دستی در متراژ بالا.",
    buyingGuide: "how-to-choose-a-scrubber",
    filters: ["machineType", "powerSource", "area", "workingWidth", "brushType", "brand"],
  },
  {
    slug: "industrial-vacuum-cleaners",
    name: "جاروبرقی و مکنده صنعتی",
    latin: "Industrial Vacuum Cleaners",
    group: "specialised",
    blurb:
      "مکش ضایعات خشک، مایعات، براده و گرد و غبار خطرناک — از مکنده کارگاهی تا سیستم مکش مرکزی و مدل‌های ضدانفجار.",
    buyingGuide: "how-to-choose-industrial-vacuum",
    filters: ["machineType", "powerSource", "area", "brand"],
  },
  {
    slug: "sweepers",
    name: "سویپر (جاروی صنعتی)",
    latin: "Sweepers",
    group: "floor",
    blurb:
      "جمع‌آوری خشک ضایعات درشت و گرد و خاک در محوطه، انبار و پارکینگ؛ پیش‌نیاز رایج قبل از اسکرابر.",
    filters: ["machineType", "powerSource", "area", "workingWidth", "brand"],
  },
  {
    slug: "pressure-washers",
    name: "واترجت صنعتی",
    latin: "Pressure Washers",
    group: "high-pressure",
    blurb:
      "شستشوی فشار بالا برای چربی‌زدایی ماشین‌آلات، سطوح عمودی، محوطه و خط تولید — سرد و آب‌گرم.",
    filters: ["powerSource", "brand"],
  },
  {
    slug: "carpet-extractors",
    name: "مبل و موکت‌شوی",
    latin: "Carpet Extractors",
    group: "specialised",
    blurb: "شستشوی تزریق-استخراج فرش، موکت و مبلمان در هتل، دفتر و مراکز تجاری.",
    filters: ["machineType", "powerSource", "brand"],
  },
  {
    slug: "single-disc-machines",
    name: "پولیشر تک‌دیسک",
    latin: "Single Disc Machines",
    group: "floor",
    blurb: "پولیش، ساب، واکس‌زدایی و شستشوی نقطه‌ای سطوح سخت با یک دیسک.",
    filters: ["powerSource", "workingWidth", "brand"],
  },
  {
    slug: "steam-cleaners",
    name: "بخارشوی صنعتی",
    latin: "Steam Cleaners",
    group: "high-pressure",
    blurb: "شستشو و ضدعفونی با بخار خشک اشباع، بدون مواد شیمیایی — مناسب صنایع غذایی و درمانی.",
    filters: ["powerSource", "brand"],
  },
  {
    slug: "robotic-cleaning",
    name: "ربات نظافت صنعتی",
    latin: "Robotic Cleaning",
    group: "floor",
    blurb: "اسکرابر خودران با ناوبری لیزری برای شیفت‌های تکراری در سطوح باز و مسیرهای ثابت.",
    filters: ["powerSource", "area", "workingWidth", "brand"],
  },
  {
    slug: "cleaning-chemicals",
    name: "مواد شوینده صنعتی",
    latin: "Cleaning Chemicals",
    group: "consumable",
    blurb: "دترجنت، چربی‌زدا، جرم‌گیر و ضدعفونی‌کننده سازگار با دستگاه و سطح.",
    filters: ["brand"],
  },
  {
    slug: "accessories",
    name: "لوازم جانبی",
    latin: "Accessories",
    group: "consumable",
    blurb: "پد، برس، تیغه لاستیکی، نازل و شیلنگ — سازگار با مدل دستگاه شما.",
    filters: ["brand"],
  },
];

export const categoryGroups: { key: Category["group"]; title: string }[] = [
  { key: "floor", title: "نظافت کف" },
  { key: "high-pressure", title: "نظافت فشار بالا" },
  { key: "specialised", title: "نظافت تخصصی" },
  { key: "consumable", title: "مصرفی و جانبی" },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
