import type { Download, Product, Spec } from "@/lib/types";

const s = (
  key: string,
  label: string,
  value: number | undefined,
  unit?: string,
  extra?: Partial<Spec>,
): Spec => ({ key, label, value, unit, ...extra });

const t = (key: string, label: string, text: string, extra?: Partial<Spec>): Spec => ({
  key,
  label,
  text,
  ...extra,
});

const docs = (model: string): Download[] => [
  { title: `دیتاشیت فنی ${model}`, kind: "datasheet", size: "PDF · 1.2MB", href: "#" },
  { title: `دفترچه راهنمای اپراتور ${model}`, kind: "manual", size: "PDF · 4.6MB", href: "#" },
  { title: "گواهی CE و تست ایمنی", kind: "certificate", size: "PDF · 320KB", href: "#" },
];

const commonFaqs = (model: string) => [
  {
    q: `دوره سرویس ${model} چقدر است؟`,
    a: "سرویس دوره‌ای هر ۲۵۰ ساعت کارکرد یا هر ۶ ماه — هرکدام زودتر رسید. قرارداد سرویس سالانه شامل دو بازدید برنامه‌ریزی‌شده و اولویت اعزام تکنسین است.",
  },
  {
    q: "قطعات مصرفی چقدر در دسترس است؟",
    a: "برس، پد، تیغه لاستیکی و فیلتر این مدل به‌صورت دائم موجود است و از بخش «قطعات یدکی» با شماره فنی قابل سفارش است.",
  },
];

/**
 * کاتالوگ نمونه (seed).
 * اعداد برای نمایش ساختار و موتور مقایسه/مشاور نوشته شده‌اند و باید با
 * دیتاشیت واقعی سازنده جایگزین شوند.
 */
export const products: Product[] = [
  /* ---------------------------------------------------------------- اسکرابر */
  {
    slug: "arta-c430",
    name: "اسکرابر جمع‌وجور ARTA C430",
    model: "C430",
    brand: "arta",
    category: "floor-scrubbers",
    subcategory: "دستی — فضای محدود",
    tagline: "کف‌شور کابلی برای فضاهای شلوغ و راهروهای باریک",
    summary:
      "دستگاه سبک با عرض کار ۴۳۰ میلی‌متر برای آشپزخانه صنعتی، فروشگاه و راهروهایی که دستگاه بزرگ در آن‌ها مانور ندارد. تغذیه کابلی، بدون نگرانی شارژ.",
    badges: ["مناسب فضای کوچک"],
    kpis: [
      s("coverage", "راندمان نظری", 1600, "m²/h", { highlight: true }),
      s("width", "عرض شستشو", 430, "mm", { highlight: true }),
      s("tank", "ظرفیت مخزن", 40, "L", { highlight: true }),
      t("power", "منبع انرژی", "کابلی ۲۲۰V", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 1600, "m²/h"),
          s("width", "عرض شستشو", 430, "mm"),
          s("squeegee", "عرض تیغه مکش", 610, "mm"),
          s("pressure", "فشار برس روی سطح", 22, "kg"),
        ],
      },
      {
        title: "مخزن و تغذیه",
        specs: [
          s("tank", "مخزن آب تمیز", 40, "L"),
          s("recovery", "مخزن آب کثیف", 45, "L"),
          t("power", "منبع انرژی", "کابلی ۲۲۰ ولت"),
          s("cable", "طول کابل", 20, "m"),
        ],
      },
      {
        title: "ابعاد و محیط",
        specs: [
          s("weight", "وزن خالی", 55, "kg"),
          s("noise", "تراز صدا", 62, "dB(A)"),
          s("gradient", "حداکثر شیب کاری", 2, "%"),
        ],
      },
    ],
    features: [
      {
        title: "مانور در فضای واقعی",
        body: "شعاع گردش کوتاه و بدنه باریک اجازه می‌دهد بین قفسه‌ها و میزها بدون جابه‌جایی چیدمان کار کند.",
      },
      {
        title: "بدون مدیریت باتری",
        body: "تغذیه کابلی یعنی صفر هزینه باتری و صفر زمان شارژ — برای محیط‌هایی که دستگاه روزی یک ساعت کار می‌کند منطقی‌تر است.",
      },
      {
        title: "تیغه اوربیتال",
        body: "حرکت اوربیتال برای واکس‌زدایی و لکه‌های چسبنده مؤثرتر از برس دیسکی است و آب کمتری مصرف می‌کند.",
      },
    ],
    applications: [
      { industry: "restaurants", note: "کف آشپزخانه و سالن، چربی سبک و لکه غذا." },
      { industry: "retail", note: "راهروهای فروشگاه در ساعات کاری، بدون مزاحمت برای مشتری." },
      { industry: "offices", note: "لابی و راهروهای سنگ و سرامیک." },
    ],
    facets: {
      machineType: "walk-behind",
      powerSource: "electric",
      brushType: "orbital",
      areaMin: 100,
      areaMax: 1200,
      workingWidth: 430,
    },
    fit: {
      surfaces: ["factory-floor", "production-line"],
      dirt: ["dust", "food", "oil"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["پد قرمز ۴۳۰", "پد سفید ۴۳۰", "تیغه لاستیکی یدک", "فیلتر مخزن"],
    downloads: docs("C430"),
    faqs: commonFaqs("C430"),
    related: ["arta-s500", "arta-sd430"],
  },
  {
    slug: "arta-s500",
    name: "اسکرابر دستی ARTA S500",
    model: "S500",
    brand: "arta",
    category: "floor-scrubbers",
    subcategory: "دستی — باتری",
    tagline: "پرکاربردترین اندازه برای انبار و سالن تولید متوسط",
    summary:
      "اسکرابر باتری‌خور با عرض ۵۱۰ میلی‌متر و مخزن ۵۰ لیتری؛ نقطه شروع منطقی برای مجموعه‌هایی که تازه از شستشوی دستی به دستگاه مهاجرت می‌کنند.",
    badges: ["پرفروش"],
    kpis: [
      s("coverage", "راندمان نظری", 2000, "m²/h", { highlight: true }),
      s("width", "عرض شستشو", 510, "mm", { highlight: true }),
      s("tank", "ظرفیت مخزن", 50, "L", { highlight: true }),
      s("runtime", "کارکرد با یک شارژ", 2.5, "h", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 2000, "m²/h"),
          s("coverageReal", "راندمان واقعی تخمینی", 1400, "m²/h"),
          s("width", "عرض شستشو", 510, "mm"),
          s("squeegee", "عرض تیغه مکش", 730, "mm"),
          s("pressure", "فشار برس روی سطح", 28, "kg"),
        ],
      },
      {
        title: "مخزن و انرژی",
        specs: [
          s("tank", "مخزن آب تمیز", 50, "L"),
          s("recovery", "مخزن آب کثیف", 55, "L"),
          t("battery", "نوع باتری", "ژل ۲۴V / ۸۵Ah"),
          s("runtime", "کارکرد با یک شارژ", 2.5, "h"),
          s("charge", "زمان شارژ کامل", 8, "h"),
        ],
      },
      {
        title: "ابعاد و محیط",
        specs: [
          s("weight", "وزن با باتری", 125, "kg"),
          s("noise", "تراز صدا", 64, "dB(A)"),
          s("gradient", "حداکثر شیب کاری", 2, "%"),
        ],
      },
    ],
    features: [
      {
        title: "یک شیفت کامل بدون شارژ",
        body: "۲.۵ ساعت کارکرد پیوسته، معادل تقریبی ۳٬۵۰۰ متر مربع در شرایط واقعی با توقف‌های عادی.",
      },
      {
        title: "دسترسی بدون ابزار",
        body: "برس، تیغه و مخزن بدون آچار باز می‌شوند؛ نگهداری روزانه را به اپراتور می‌سپارد نه به تکنسین.",
      },
      {
        title: "کنترل دبی آب",
        body: "تنظیم دبی متناسب با آلودگی، مصرف آب و شوینده را در متراژ بالا محسوس کم می‌کند.",
      },
    ],
    applications: [
      { industry: "warehouses", note: "راهروهای قفسه‌بندی و محوطه بارگیری سرپوشیده." },
      { industry: "factories", note: "سالن تولید با گرد و خاک و روغن سبک." },
      { industry: "retail", note: "مراکز خرید در شیفت شب." },
      { industry: "hospitals", note: "راهروها و بخش‌های عمومی با نیاز به صدای پایین." },
    ],
    facets: {
      machineType: "walk-behind",
      powerSource: "battery",
      brushType: "disc",
      areaMin: 300,
      areaMax: 2500,
      workingWidth: 510,
    },
    fit: {
      surfaces: ["factory-floor", "warehouse", "production-line", "parking"],
      dirt: ["dust", "oil", "food"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["برس دیسکی PPL ۵۱۰", "پد سبز/قرمز ۵۱۰", "شارژر داخلی", "تیغه لاستیکی PU"],
    downloads: docs("S500"),
    faqs: commonFaqs("S500"),
    related: ["arta-s700", "vertex-r850", "arta-w800"],
  },
  {
    slug: "arta-s700",
    name: "اسکرابر دستی ARTA S700",
    model: "S700",
    brand: "arta",
    category: "floor-scrubbers",
    subcategory: "دستی — برس رولی",
    tagline: "برس رولی برای کفی که هم ضایعات درشت دارد هم آلودگی چسبنده",
    summary:
      "نسخه بزرگ‌تر با برس رولی و مخزن ۸۵ لیتری. برس رولی ضایعات ریز را به مخزن جمع می‌کند، بنابراین در سالن تولید نیاز به جارو قبل از شستشو کم می‌شود.",
    kpis: [
      s("coverage", "راندمان نظری", 3400, "m²/h", { highlight: true }),
      s("width", "عرض شستشو", 700, "mm", { highlight: true }),
      s("tank", "ظرفیت مخزن", 85, "L", { highlight: true }),
      s("runtime", "کارکرد با یک شارژ", 3.5, "h", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 3400, "m²/h"),
          s("coverageReal", "راندمان واقعی تخمینی", 2400, "m²/h"),
          s("width", "عرض شستشو", 700, "mm"),
          s("squeegee", "عرض تیغه مکش", 940, "mm"),
          s("pressure", "فشار برس روی سطح", 45, "kg"),
        ],
      },
      {
        title: "مخزن و انرژی",
        specs: [
          s("tank", "مخزن آب تمیز", 85, "L"),
          s("recovery", "مخزن آب کثیف", 90, "L"),
          s("debris", "سبد ضایعات برس رولی", 4, "L"),
          t("battery", "نوع باتری", "لیتیوم-یون ۲۴V / ۱۰۵Ah"),
          s("runtime", "کارکرد با یک شارژ", 3.5, "h"),
          s("charge", "زمان شارژ کامل", 3, "h"),
        ],
      },
      {
        title: "ابعاد و محیط",
        specs: [
          s("weight", "وزن با باتری", 190, "kg"),
          s("noise", "تراز صدا", 66, "dB(A)"),
          s("gradient", "حداکثر شیب کاری", 8, "%"),
        ],
      },
    ],
    features: [
      {
        title: "شستشو بدون جاروی قبلی",
        body: "سبد ضایعات برس رولی، خرده‌ریز و ضایعات بسته‌بندی را جمع می‌کند و یک مرحله از فرآیند نظافت حذف می‌شود.",
      },
      {
        title: "باتری لیتیوم، شارژ میان‌شیفت",
        body: "شارژ جزئی به باتری آسیب نمی‌زند؛ دستگاه در وقت ناهار شارژ می‌شود و شیفت دوم را هم کار می‌کند.",
      },
      {
        title: "فشار برس قابل تنظیم",
        body: "سه سطح فشار برای اپوکسی، بتن پولیش‌شده و سرامیک صنعتی.",
      },
    ],
    applications: [
      { industry: "factories", note: "سالن تولید با براده، گرد و خاک و روغن." },
      { industry: "food-industry", note: "سالن بسته‌بندی؛ با شوینده مجاز صنایع غذایی." },
      { industry: "warehouses", note: "انبارهای با تردد لیفتراک و رد لاستیک." },
      { industry: "automotive", note: "خط مونتاژ و محوطه تعمیرگاه." },
    ],
    facets: {
      machineType: "walk-behind",
      powerSource: "battery",
      brushType: "cylindrical",
      areaMin: 1000,
      areaMax: 5000,
      workingWidth: 700,
    },
    fit: {
      surfaces: ["factory-floor", "warehouse", "production-line", "machinery"],
      dirt: ["dust", "oil", "grease", "food", "mud"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["برس رولی PPL ۷۰۰", "برس رولی ساینده", "سبد ضایعات یدک", "کیت شستشوی مخزن"],
    downloads: docs("S700"),
    faqs: commonFaqs("S700"),
    related: ["arta-s500", "vertex-r850", "nordline-rx1100"],
  },
  {
    slug: "vertex-r850",
    name: "اسکرابر سرنشین‌دار VERTEX R850",
    model: "R850",
    brand: "vertex",
    category: "floor-scrubbers",
    subcategory: "سرنشین‌دار",
    tagline: "نقطه سربه‌سر اقتصادی برای متراژ بالای ۳٬۰۰۰ متر",
    summary:
      "از این متراژ به بعد، هزینه نیروی انسانی از هزینه دستگاه پیشی می‌گیرد. R850 با عرض ۸۵۰ میلی‌متر و ۵.۵ ساعت کارکرد، یک شیفت کامل را بدون توقف پوشش می‌دهد.",
    badges: ["پیشنهاد ویژه متراژ بالا"],
    kpis: [
      s("coverage", "راندمان نظری", 5000, "m²/h", { highlight: true }),
      s("width", "عرض شستشو", 850, "mm", { highlight: true }),
      s("tank", "ظرفیت مخزن", 120, "L", { highlight: true }),
      s("runtime", "کارکرد با یک شارژ", 5.5, "h", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 5000, "m²/h"),
          s("coverageReal", "راندمان واقعی تخمینی", 3600, "m²/h"),
          s("width", "عرض شستشو", 850, "mm"),
          s("squeegee", "عرض تیغه مکش", 1120, "mm"),
          s("speed", "حداکثر سرعت حرکت", 7, "km/h"),
          s("pressure", "فشار برس روی سطح", 70, "kg"),
        ],
      },
      {
        title: "مخزن و انرژی",
        specs: [
          s("tank", "مخزن آب تمیز", 120, "L"),
          s("recovery", "مخزن آب کثیف", 130, "L"),
          t("battery", "نوع باتری", "لیتیوم-یون ۳۶V / ۲۱۰Ah"),
          s("runtime", "کارکرد با یک شارژ", 5.5, "h"),
          s("charge", "زمان شارژ کامل", 4, "h"),
        ],
      },
      {
        title: "ابعاد و محیط",
        specs: [
          s("weight", "وزن با باتری", 320, "kg"),
          s("noise", "تراز صدا", 68, "dB(A)"),
          s("gradient", "حداکثر شیب کاری", 10, "%"),
          s("turning", "شعاع گردش", 1650, "mm"),
        ],
      },
    ],
    features: [
      {
        title: "یک اپراتور، یک شیفت، ۱۸ هزار متر",
        body: "در سه شیفت کاری، دستگاه جای چند نفر نیروی نظافت را در سطوح باز می‌گیرد؛ بازگشت سرمایه معمولاً زیر ۱۸ ماه محاسبه می‌شود.",
      },
      {
        title: "بازیافت آب",
        body: "فیلتر و بازگردانی آب مخزن، مصرف آب را تا ۴۰٪ کم می‌کند — در سایت‌هایی که تخلیه پساب محدودیت دارد تعیین‌کننده است.",
      },
      {
        title: "ایمنی سرنشین",
        body: "سنسور صندلی، بوق دنده‌عقب و محدودکننده سرعت در گردش؛ الزام رایج HSE کارخانه‌ها.",
      },
    ],
    applications: [
      { industry: "warehouses", note: "انبارهای بزرگ لجستیک و مراکز توزیع." },
      { industry: "factories", note: "سالن‌های تولید با متراژ بالا و تردد دائم." },
      { industry: "retail", note: "هایپرمارکت و پارکینگ طبقاتی." },
      { industry: "automotive", note: "سالن رنگ، مونتاژ و محوطه." },
      { industry: "construction", note: "نظافت پایان کار پروژه‌های بزرگ." },
    ],
    facets: {
      machineType: "ride-on",
      powerSource: "battery",
      brushType: "disc",
      areaMin: 3000,
      areaMax: 12000,
      workingWidth: 850,
    },
    fit: {
      surfaces: ["factory-floor", "warehouse", "parking", "production-line"],
      dirt: ["dust", "oil", "grease", "mud"],
      frequency: ["daily"],
    },
    priceMode: "rfq",
    accessories: ["برس دیسکی جفت ۴۳۰", "پد هولدر", "کیت بازیافت آب", "چراغ گردان ایمنی"],
    downloads: docs("R850"),
    faqs: [
      ...commonFaqs("R850"),
      {
        q: "برای پارکینگ شیب‌دار مناسب است؟",
        a: "بله؛ حداکثر شیب کاری ۱۰٪ و ترمز الکترومغناطیسی روی رمپ نگه‌دارنده است. برای رمپ‌های تندتر مدل RX1100 پیشنهاد می‌شود.",
      },
    ],
    related: ["nordline-rx1100", "arta-s700", "vertex-ax60"],
  },
  {
    slug: "nordline-rx1100",
    name: "اسکرابر سرنشین‌دار NORDLINE RX1100",
    model: "RX1100",
    brand: "nordline",
    category: "floor-scrubbers",
    subcategory: "سرنشین‌دار سنگین",
    tagline: "برای سالن‌های بالای ۱۰٬۰۰۰ متر و کار پیوسته چندشیفتی",
    summary:
      "کلاس سنگین با عرض ۱۱۰۰ میلی‌متر و مخزن ۲۴۰ لیتری؛ طراحی‌شده برای سایت‌هایی که توقف برای پرکردن مخزن، خودش یک هزینه است.",
    kpis: [
      s("coverage", "راندمان نظری", 8200, "m²/h", { highlight: true }),
      s("width", "عرض شستشو", 1100, "mm", { highlight: true }),
      s("tank", "ظرفیت مخزن", 240, "L", { highlight: true }),
      s("runtime", "کارکرد با یک شارژ", 6, "h", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 8200, "m²/h"),
          s("coverageReal", "راندمان واقعی تخمینی", 6000, "m²/h"),
          s("width", "عرض شستشو", 1100, "mm"),
          s("squeegee", "عرض تیغه مکش", 1400, "mm"),
          s("speed", "حداکثر سرعت حرکت", 8, "km/h"),
          s("pressure", "فشار برس روی سطح", 130, "kg"),
        ],
      },
      {
        title: "مخزن و انرژی",
        specs: [
          s("tank", "مخزن آب تمیز", 240, "L"),
          s("recovery", "مخزن آب کثیف", 250, "L"),
          t("battery", "نوع باتری", "لیتیوم-یون ۴۸V / ۳۰۰Ah"),
          s("runtime", "کارکرد با یک شارژ", 6, "h"),
          s("charge", "زمان شارژ کامل", 4.5, "h"),
        ],
      },
      {
        title: "ابعاد و محیط",
        specs: [
          s("weight", "وزن با باتری", 690, "kg"),
          s("noise", "تراز صدا", 70, "dB(A)"),
          s("gradient", "حداکثر شیب کاری", 16, "%"),
          s("turning", "شعاع گردش", 2100, "mm"),
        ],
      },
    ],
    features: [
      {
        title: "برس رولی سنگین",
        body: "برای بتن ساب‌خورده، رد لاستیک لیفتراک و آلودگی چسبیده طراحی شده و فشار ۱۳۰ کیلوگرمی روی سطح اعمال می‌کند.",
      },
      {
        title: "توقف کمتر",
        body: "۲۴۰ لیتر مخزن یعنی حدود ۲.۵ ساعت شستشو بدون رفتن سراغ شیر آب.",
      },
      {
        title: "تله‌متری ناوگان",
        body: "ساعت کارکرد، مصرف آب و خطاها روی داشبورد مدیریت ثبت می‌شود — برای مجموعه‌های چنددستگاهی.",
      },
    ],
    applications: [
      { industry: "warehouses", note: "مراکز توزیع و انبارهای مکانیزه." },
      { industry: "factories", note: "سالن‌های تولید سنگین." },
      { industry: "automotive", note: "کارخانه‌های خودروسازی." },
      { industry: "parking", note: "پارکینگ‌های طبقاتی بزرگ با رمپ تند." },
    ],
    facets: {
      machineType: "ride-on",
      powerSource: "battery",
      brushType: "cylindrical",
      areaMin: 8000,
      areaMax: 40000,
      workingWidth: 1100,
    },
    fit: {
      surfaces: ["factory-floor", "warehouse", "parking", "production-line"],
      dirt: ["dust", "oil", "grease", "mud", "chemical"],
      frequency: ["daily"],
    },
    priceMode: "rfq",
    accessories: ["برس رولی ساینده", "کیت تله‌متری", "سایبان اپراتور", "شارژر سریع"],
    downloads: docs("RX1100"),
    faqs: commonFaqs("RX1100"),
    related: ["vertex-r850", "nordline-sr1600"],
  },

  /* ------------------------------------------------------------------ ربات */
  {
    slug: "vertex-ax60",
    name: "اسکرابر خودران VERTEX AX60",
    model: "AX60",
    brand: "vertex",
    category: "robotic-cleaning",
    subcategory: "خودران",
    tagline: "برای مسیرهای تکراری که هر شب دقیقاً همان مسیر است",
    summary:
      "ناوبری لیزری + دوربین عمق. مسیر یک‌بار آموزش داده می‌شود و دستگاه هر شب همان را اجرا می‌کند؛ اپراتور فقط مخزن را پر و خالی می‌کند.",
    badges: ["جدید"],
    kpis: [
      s("coverage", "راندمان نظری", 2800, "m²/h", { highlight: true }),
      s("width", "عرض شستشو", 600, "mm", { highlight: true }),
      s("tank", "ظرفیت مخزن", 70, "L", { highlight: true }),
      s("runtime", "کارکرد با یک شارژ", 4, "h", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 2800, "m²/h"),
          s("width", "عرض شستشو", 600, "mm"),
          s("speed", "سرعت کاری", 4, "km/h"),
        ],
      },
      {
        title: "ناوبری",
        specs: [
          t("nav", "روش ناوبری", "LiDAR + دوربین عمق + IMU"),
          s("obstacle", "تشخیص مانع", 30, "mm"),
          t("maps", "تعداد نقشه ذخیره‌شده", "تا ۲۰ مسیر"),
          t("safety", "ایمنی", "توقف اضطراری، سنسور پرتگاه، بامپر"),
        ],
      },
      {
        title: "انرژی و ابعاد",
        specs: [
          t("battery", "نوع باتری", "لیتیوم-یون ۲۴V / ۱۵۰Ah"),
          s("runtime", "کارکرد با یک شارژ", 4, "h"),
          s("weight", "وزن", 165, "kg"),
          s("noise", "تراز صدا", 60, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "شیفت شب بدون نیروی انسانی",
        body: "برنامه‌ریزی زمانی روی داشبورد؛ دستگاه خودش شروع می‌کند، به داک برمی‌گردد و گزارش می‌دهد.",
      },
      {
        title: "گزارش پوشش",
        body: "نقشه مناطق شسته‌شده و نشسته پس از هر شیفت — چیزی که با نیروی انسانی قابل اندازه‌گیری نیست.",
      },
      {
        title: "حالت دستی",
        body: "در محیط شلوغ روز مثل یک اسکرابر معمولی دستی هدایت می‌شود.",
      },
    ],
    applications: [
      { industry: "warehouses", note: "راهروهای ثابت قفسه‌بندی." },
      { industry: "retail", note: "مراکز خرید در ساعات تعطیل." },
      { industry: "offices", note: "لابی و سالن‌های بزرگ اداری." },
      { industry: "hotels", note: "سالن‌های عمومی و راهروهای طبقات." },
    ],
    facets: {
      machineType: "robotic",
      powerSource: "battery",
      brushType: "disc",
      areaMin: 2000,
      areaMax: 9000,
      workingWidth: 600,
    },
    fit: {
      surfaces: ["warehouse", "factory-floor", "parking"],
      dirt: ["dust", "food"],
      frequency: ["daily"],
    },
    priceMode: "rfq",
    accessories: ["ایستگاه شارژ خودکار", "کیت پر و تخلیه خودکار مخزن", "برس دیسکی ۶۰۰"],
    downloads: docs("AX60"),
    faqs: [
      ...commonFaqs("AX60"),
      {
        q: "اگر چیدمان انبار عوض شود چه می‌شود؟",
        a: "دستگاه موانع جدید را دور می‌زند و همان مسیر را ادامه می‌دهد؛ برای تغییر اساسی چیدمان، مسیر در حدود ۲۰ دقیقه دوباره آموزش داده می‌شود.",
      },
    ],
    related: ["vertex-r850", "arta-s500"],
  },

  /* ----------------------------------------------------------------- سویپر */
  {
    slug: "arta-w800",
    name: "سویپر دستی ARTA W800",
    model: "W800",
    brand: "arta",
    category: "sweepers",
    subcategory: "دستی — باتری",
    tagline: "جمع‌آوری خشک ضایعات درشت پیش از شستشو",
    summary:
      "جاروی صنعتی باتری‌خور با عرض ۸۰۰ میلی‌متر و مخزن ضایعات ۵۰ لیتری. فیلتر پارچه‌ای با تکاننده برقی، گرد و غبار را در محیط پخش نمی‌کند.",
    kpis: [
      s("coverage", "راندمان نظری", 4000, "m²/h", { highlight: true }),
      s("width", "عرض جارو با برس کناری", 800, "mm", { highlight: true }),
      s("hopper", "مخزن ضایعات", 50, "L", { highlight: true }),
      s("runtime", "کارکرد با یک شارژ", 3, "h", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 4000, "m²/h"),
          s("width", "عرض جارو با برس کناری", 800, "mm"),
          s("mainBrush", "طول برس اصلی", 600, "mm"),
          s("filter", "سطح فیلتر", 4, "m²"),
        ],
      },
      {
        title: "انرژی و ابعاد",
        specs: [
          t("battery", "نوع باتری", "ژل ۲۴V / ۷۶Ah"),
          s("runtime", "کارکرد با یک شارژ", 3, "h"),
          s("hopper", "مخزن ضایعات", 50, "L"),
          s("weight", "وزن با باتری", 105, "kg"),
          s("noise", "تراز صدا", 65, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "فیلتر با تکاننده برقی",
        body: "یک دکمه، فیلتر تکانده می‌شود و مکش برمی‌گردد — بدون باز کردن مخزن و بلند شدن گرد و خاک.",
      },
      {
        title: "برس کناری برای گوشه‌ها",
        body: "کنار دیوار و پای قفسه، جایی که اسکرابر نمی‌رسد.",
      },
      {
        title: "مکمل اسکرابر",
        body: "در سایت‌های با ضایعات بسته‌بندی، ترکیب سویپر + اسکرابر از یک دستگاه ترکیبی گران‌تر مقرون‌به‌صرفه‌تر است.",
      },
    ],
    applications: [
      { industry: "warehouses", note: "ضایعات کارتن، نایلون و خرده چوب پالت." },
      { industry: "factories", note: "براده و خرده‌ریز خط تولید." },
      { industry: "construction", note: "گرد و خاک و نخاله سبک پایان کار." },
      { industry: "parking", note: "برگ، شن و خاک محوطه." },
    ],
    facets: {
      machineType: "walk-behind",
      powerSource: "battery",
      brushType: "cylindrical",
      areaMin: 500,
      areaMax: 6000,
      workingWidth: 800,
    },
    fit: {
      surfaces: ["warehouse", "factory-floor", "parking"],
      dirt: ["dust", "mud"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["برس اصلی PPL", "برس کناری", "فیلتر پلی‌استر یدک"],
    downloads: docs("W800"),
    faqs: commonFaqs("W800"),
    related: ["nordline-sr1600", "arta-s500"],
  },
  {
    slug: "nordline-sr1600",
    name: "سویپر سرنشین‌دار NORDLINE SR1600",
    model: "SR1600",
    brand: "nordline",
    category: "sweepers",
    subcategory: "سرنشین‌دار دیزلی",
    tagline: "محوطه باز، مسیر تردد کامیون و متراژ چند ده هزار متری",
    summary:
      "سویپر دیزلی با عرض ۱۶۰۰ میلی‌متر و مخزن ۲۴۰ لیتری برای محوطه‌های باز؛ آنجا که باتری کفاف نمی‌دهد و آلودگی درشت است.",
    kpis: [
      s("coverage", "راندمان نظری", 12000, "m²/h", { highlight: true }),
      s("width", "عرض جارو با دو برس کناری", 1600, "mm", { highlight: true }),
      s("hopper", "مخزن ضایعات", 240, "L", { highlight: true }),
      t("power", "منبع انرژی", "دیزل", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 12000, "m²/h"),
          s("width", "عرض جارو با دو برس کناری", 1600, "mm"),
          s("speed", "حداکثر سرعت", 12, "km/h"),
          s("dumpHeight", "ارتفاع تخلیه بالابر", 1450, "mm"),
        ],
      },
      {
        title: "موتور و ابعاد",
        specs: [
          t("engine", "موتور", "دیزل ۳ سیلندر، ۱۸ کیلووات"),
          s("tankFuel", "باک سوخت", 30, "L"),
          s("hopper", "مخزن ضایعات", 240, "L"),
          s("weight", "وزن", 1250, "kg"),
          s("noise", "تراز صدا", 82, "dB(A)"),
          s("gradient", "حداکثر شیب کاری", 20, "%"),
        ],
      },
    ],
    features: [
      {
        title: "تخلیه از ارتفاع",
        body: "مخزن مستقیم داخل کانتینر ضایعات تخلیه می‌شود؛ بدون جابه‌جایی دستی.",
      },
      {
        title: "سیستم مهار گرد و غبار",
        body: "پاشش آب روی برس‌ها در محوطه خاکی، از ابر گرد و غبار جلوگیری می‌کند.",
      },
      {
        title: "کابین اختیاری",
        body: "کابین بسته با بخاری و کولر برای کار در فضای باز و سرما.",
      },
    ],
    applications: [
      { industry: "factories", note: "محوطه صنعتی و مسیر تردد کامیون." },
      { industry: "construction", note: "کارگاه و جاده‌های دسترسی." },
      { industry: "warehouses", note: "محوطه بارانداز و یارد." },
    ],
    facets: {
      machineType: "ride-on",
      powerSource: "diesel",
      brushType: "cylindrical",
      areaMin: 10000,
      areaMax: 80000,
      workingWidth: 1600,
    },
    fit: {
      surfaces: ["parking", "warehouse", "factory-floor"],
      dirt: ["dust", "mud"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["کابین بسته", "برس کناری سوم", "کیت مهار غبار", "چراغ کار LED"],
    downloads: docs("SR1600"),
    faqs: commonFaqs("SR1600"),
    related: ["arta-w800", "nordline-rx1100"],
  },

  /* ----------------------------------------------------------- مکنده صنعتی */
  {
    slug: "arta-v40",
    name: "مکنده صنعتی ARTA V40",
    model: "V40",
    brand: "arta",
    category: "industrial-vacuum-cleaners",
    subcategory: "خشک و تر",
    tagline: "مکنده کارگاهی خشک و تر با فیلتر قابل شست‌وشو",
    summary:
      "۴۰ لیتر مخزن استیل، دو موتور مکش و فیلتر پلی‌استر قابل شست‌وشو. کار روزمره تعمیرگاه، کارگاه و خط تولید کوچک.",
    kpis: [
      s("airflow", "دبی هوا", 220, "m³/h", { highlight: true }),
      s("vacuum", "مکش", 250, "mbar", { highlight: true }),
      s("tank", "ظرفیت مخزن", 40, "L", { highlight: true }),
      s("motorPower", "توان", 2400, "W", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("airflow", "دبی هوا", 220, "m³/h"),
          s("vacuum", "مکش", 250, "mbar"),
          s("motorPower", "توان", 2400, "W"),
          t("motors", "تعداد موتور", "۲ عدد، قابل تفکیک"),
        ],
      },
      {
        title: "فیلتر و مخزن",
        specs: [
          t("filter", "فیلتر", "پلی‌استر قابل شست‌وشو، کلاس M"),
          s("filterArea", "سطح فیلتر", 1.2, "m²"),
          s("tank", "ظرفیت مخزن", 40, "L"),
          t("body", "جنس مخزن", "استیل ضدزنگ"),
        ],
      },
      {
        title: "ابعاد",
        specs: [
          s("weight", "وزن", 21, "kg"),
          s("hose", "طول شیلنگ", 3, "m"),
          s("noise", "تراز صدا", 72, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "خشک و تر بدون تعویض فیلتر",
        body: "شناور قطع خودکار، مکش مایعات را بدون آسیب به موتور ممکن می‌کند.",
      },
      {
        title: "دو موتور مستقل",
        body: "برای کار سبک یک موتور کافی است؛ مصرف برق نصف می‌شود.",
      },
      {
        title: "خروجی ابزار برقی",
        body: "پریز همگام‌شده برای سنگ و اره؛ با روشن شدن ابزار، مکنده هم روشن می‌شود.",
      },
    ],
    applications: [
      { industry: "factories", note: "براده، خرده‌ریز و مایعات ریخته‌شده کنار دستگاه." },
      { industry: "automotive", note: "تعمیرگاه و مکش روغن ریخته‌شده." },
      { industry: "construction", note: "گرد و خاک ساختمانی و برش." },
    ],
    facets: {
      machineType: "handheld",
      powerSource: "electric",
      brushType: "none",
      areaMin: 0,
      areaMax: 1500,
    },
    fit: {
      surfaces: ["machinery", "production-line", "factory-floor"],
      dirt: ["dust", "oil", "mud"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["نازل مایعات", "برس گرد", "کیسه فیلتر یک‌بارمصرف", "شیلنگ ۵ متری"],
    downloads: docs("V40"),
    faqs: commonFaqs("V40"),
    related: ["vertex-tv90", "nordline-ex50"],
  },
  {
    slug: "vertex-tv90",
    name: "مکنده سه‌فاز VERTEX TV90",
    model: "TV90",
    brand: "vertex",
    category: "industrial-vacuum-cleaners",
    subcategory: "سه‌فاز صنعتی",
    tagline: "کار پیوسته چندشیفتی روی خط تولید",
    summary:
      "مکنده سه‌فاز با موتور جانبی (side channel) برای کار ۲۴ ساعته؛ مخزن ۱۰۰ لیتری چرخ‌دار و سیستم تکان فیلتر دستی.",
    kpis: [
      s("airflow", "دبی هوا", 480, "m³/h", { highlight: true }),
      s("vacuum", "مکش", 320, "mbar", { highlight: true }),
      s("tank", "ظرفیت مخزن", 100, "L", { highlight: true }),
      s("motorPower", "توان", 4000, "W", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("airflow", "دبی هوا", 480, "m³/h"),
          s("vacuum", "مکش", 320, "mbar"),
          s("motorPower", "توان", 4000, "W"),
          t("motorType", "نوع موتور", "Side channel، بدون زغال"),
          t("duty", "چرخه کاری", "پیوسته ۲۴ ساعته"),
        ],
      },
      {
        title: "فیلتر و مخزن",
        specs: [
          t("filter", "فیلتر", "کارتریج ستاره‌ای، کلاس M (اختیاری H)"),
          s("filterArea", "سطح فیلتر", 4.5, "m²"),
          s("tank", "ظرفیت مخزن", 100, "L"),
          t("dump", "تخلیه", "مخزن چرخ‌دار جداشونده"),
        ],
      },
      {
        title: "ابعاد",
        specs: [
          s("weight", "وزن", 145, "kg"),
          s("inlet", "قطر ورودی", 70, "mm"),
          s("noise", "تراز صدا", 74, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "بدون زغال، بدون توقف",
        body: "موتور side channel برای کارکرد دائم ساخته شده؛ نگهداری آن به بازرسی سالانه محدود است.",
      },
      {
        title: "اتصال مستقیم به ماشین‌آلات",
        body: "قابل اتصال به خروجی غبار دستگاه‌های تولید به‌عنوان مکش نقطه‌ای.",
      },
      {
        title: "ارتقا به فیلتر HEPA",
        body: "برای گرد و غبار ریز و مضر، کارتریج کلاس H قابل نصب است.",
      },
    ],
    applications: [
      { industry: "factories", note: "مکش نقطه‌ای غبار ماشین‌آلات." },
      { industry: "food-industry", note: "پودر و مواد خشک در سالن تولید." },
      { industry: "automotive", note: "غبار سنباده و رنگ در سالن آماده‌سازی." },
    ],
    facets: {
      machineType: "stationary",
      powerSource: "electric",
      brushType: "none",
      areaMin: 0,
      areaMax: 5000,
    },
    fit: {
      surfaces: ["machinery", "production-line", "factory-floor"],
      dirt: ["dust", "food", "chemical"],
      frequency: ["daily"],
    },
    priceMode: "rfq",
    accessories: ["کارتریج HEPA کلاس H", "کیت لوله‌کشی مکش", "مخزن یدک", "شیلنگ آنتی‌استاتیک"],
    downloads: docs("TV90"),
    faqs: commonFaqs("TV90"),
    related: ["arta-v40", "nordline-ex50"],
  },
  {
    slug: "nordline-ex50",
    name: "مکنده ضدانفجار NORDLINE EX50 ATEX",
    model: "EX50",
    brand: "nordline",
    category: "industrial-vacuum-cleaners",
    subcategory: "ضدانفجار (ATEX)",
    tagline: "بادی، بدون برق، برای زون‌های قابل اشتعال",
    summary:
      "مکنده تمام‌بادی و آنتی‌استاتیک با گواهی ATEX زون ۲۲؛ برای غبار قابل اشتعال، حلال و محیط‌هایی که هیچ جرقه‌ای مجاز نیست.",
    badges: ["ATEX Zone 22"],
    kpis: [
      s("airflow", "دبی هوا", 300, "m³/h", { highlight: true }),
      s("vacuum", "مکش", 280, "mbar", { highlight: true }),
      s("tank", "ظرفیت مخزن", 50, "L", { highlight: true }),
      t("power", "منبع انرژی", "هوای فشرده", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("airflow", "دبی هوا", 300, "m³/h"),
          s("vacuum", "مکش", 280, "mbar"),
          s("airConsumption", "مصرف هوا", 1800, "l/min"),
          s("airPressure", "فشار هوای ورودی", 6, "bar"),
        ],
      },
      {
        title: "ایمنی و گواهی",
        specs: [
          t("atex", "گواهی", "ATEX II 3D — زون ۲۲"),
          t("earthing", "اتصال زمین", "کابل ارت و اجزای آنتی‌استاتیک"),
          t("filter", "فیلتر", "کلاس H، آنتی‌استاتیک"),
          t("body", "جنس بدنه", "استیل ۳۰۴ کامل"),
        ],
      },
      {
        title: "ابعاد",
        specs: [
          s("tank", "ظرفیت مخزن", 50, "L"),
          s("weight", "وزن", 62, "kg"),
          s("noise", "تراز صدا", 76, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "هیچ منبع جرقه‌ای ندارد",
        body: "موتور بادی است؛ در محیطی که کابل برق خودش ریسک محسوب می‌شود، تنها گزینه استاندارد.",
      },
      {
        title: "کاملاً آنتی‌استاتیک",
        body: "شیلنگ، لوله و مخزن همه به ارت متصل‌اند تا بار الکترواستاتیک تخلیه شود.",
      },
      {
        title: "استیل قابل شست‌وشو",
        body: "برای حلال و مواد شیمیایی، بدنه استیل در برابر خوردگی مقاوم است.",
      },
    ],
    applications: [
      { industry: "food-industry", note: "غبار آرد و پودر قابل اشتعال." },
      { industry: "factories", note: "صنایع شیمیایی، رنگ و پودر فلزی." },
      { industry: "automotive", note: "سالن رنگ و منطقه حلال." },
    ],
    facets: {
      machineType: "handheld",
      powerSource: "pneumatic",
      brushType: "none",
      areaMin: 0,
      areaMax: 2000,
    },
    fit: {
      surfaces: ["machinery", "production-line"],
      dirt: ["dust", "chemical", "food"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["شیلنگ آنتی‌استاتیک ۵ متری", "کیت نازل استیل", "فیلتر H یدک"],
    downloads: docs("EX50"),
    faqs: [
      ...commonFaqs("EX50"),
      {
        q: "برای زون ۱ یا ۲۱ هم مناسب است؟",
        a: "این مدل برای زون ۲۲ گواهی دارد. برای زون ۱ و ۲۱ پیکربندی متفاوتی لازم است؛ مشخصات محیط را برای ما بفرستید تا مدل مطابق را پیشنهاد کنیم.",
      },
    ],
    related: ["vertex-tv90", "arta-v40"],
  },

  /* --------------------------------------------------------------- واترجت */
  {
    slug: "arta-hp200",
    name: "واترجت صنعتی ARTA HP200",
    model: "HP200",
    brand: "arta",
    category: "pressure-washers",
    subcategory: "آب سرد",
    tagline: "۲۰۰ بار برای شستشوی روزمره محوطه و ماشین‌آلات",
    summary:
      "واترجت آب سرد سه‌فاز با پمپ سرامیکی و موتور دورپایین؛ ساخته‌شده برای کار روزانه، نه برای استفاده خانگی.",
    kpis: [
      s("pressure", "فشار کاری", 200, "bar", { highlight: true }),
      s("flow", "دبی آب", 900, "l/h", { highlight: true }),
      s("motorPower", "توان موتور", 5500, "W", { highlight: true }),
      t("water", "دمای آب", "سرد", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("pressure", "فشار کاری", 200, "bar"),
          s("pressureMax", "حداکثر فشار", 220, "bar"),
          s("flow", "دبی آب", 900, "l/h"),
          s("motorPower", "توان موتور", 5500, "W"),
          s("rpm", "دور موتور", 1450, "rpm"),
        ],
      },
      {
        title: "پمپ و اجزا",
        specs: [
          t("pump", "پمپ", "سه‌پیستون، پیستون سرامیکی"),
          t("head", "سرسیلندر", "برنجی"),
          s("hose", "طول شیلنگ فشار قوی", 10, "m"),
          t("supply", "برق ورودی", "سه‌فاز ۳۸۰V"),
        ],
      },
      {
        title: "ابعاد",
        specs: [
          s("weight", "وزن", 78, "kg"),
          s("noise", "تراز صدا", 78, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "موتور دورپایین",
        body: "۱۴۵۰ دور در دقیقه یعنی عمر پمپ چند برابر مدل‌های ۲۸۰۰ دور — تفاوت اصلی دستگاه صنعتی با خانگی.",
      },
      {
        title: "توقف خودکار",
        body: "با رها کردن ماشه، پمپ متوقف می‌شود؛ مصرف برق و سایش کم می‌شود.",
      },
      {
        title: "تزریق مواد شوینده",
        body: "مکش مستقیم چربی‌زدا از مخزن، با تنظیم درصد.",
      },
    ],
    applications: [
      { industry: "automotive", note: "شستشوی ماشین‌آلات و کف تعمیرگاه." },
      { industry: "factories", note: "چربی‌زدایی قطعات و کف سالن." },
      { industry: "construction", note: "شستشوی داربست، قالب بتن و ماشین‌آلات سنگین." },
      { industry: "food-industry", note: "شستشوی محوطه و تجهیزات مقاوم." },
    ],
    facets: {
      machineType: "stationary",
      powerSource: "electric",
      brushType: "none",
      areaMin: 0,
      areaMax: 5000,
    },
    fit: {
      surfaces: ["machinery", "vertical", "parking", "factory-floor"],
      dirt: ["oil", "grease", "mud", "dust"],
      frequency: ["daily", "weekly", "monthly"],
    },
    priceMode: "rfq",
    accessories: ["لنس توربو", "برس دوار", "شیلنگ ۲۰ متری", "قرقره شیلنگ"],
    downloads: docs("HP200"),
    faqs: commonFaqs("HP200"),
    related: ["vertex-ht160", "vertex-st8"],
  },
  {
    slug: "vertex-ht160",
    name: "واترجت آب‌گرم VERTEX HT160",
    model: "HT160",
    brand: "vertex",
    category: "pressure-washers",
    subcategory: "آب گرم",
    tagline: "چربی و گریس با آب گرم، نه با فشار بیشتر",
    summary:
      "واترجت آب‌گرم با مشعل گازوئیلی تا ۸۰ درجه؛ برای آلودگی چرب که آب سرد فقط جابه‌جایش می‌کند.",
    kpis: [
      s("pressure", "فشار کاری", 160, "bar", { highlight: true }),
      s("flow", "دبی آب", 1000, "l/h", { highlight: true }),
      s("temp", "حداکثر دمای آب", 80, "°C", { highlight: true }),
      s("motorPower", "توان موتور", 5000, "W", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("pressure", "فشار کاری", 160, "bar"),
          s("flow", "دبی آب", 1000, "l/h"),
          s("temp", "حداکثر دمای آب", 80, "°C"),
          s("steam", "حالت بخار", 140, "°C"),
        ],
      },
      {
        title: "مشعل و پمپ",
        specs: [
          t("burner", "مشعل", "گازوئیلی، با کنترل ترموستات"),
          s("fuelTank", "باک سوخت", 20, "L"),
          t("pump", "پمپ", "سه‌پیستون با روغن‌کاری اجباری"),
          t("supply", "برق ورودی", "سه‌فاز ۳۸۰V"),
        ],
      },
      {
        title: "ابعاد",
        specs: [
          s("weight", "وزن", 185, "kg"),
          s("noise", "تراز صدا", 80, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "آب گرم = زمان کمتر",
        body: "روی آلودگی چرب، آب ۸۰ درجه زمان شستشو را نسبت به آب سرد تا نصف کم می‌کند و مصرف شوینده را هم پایین می‌آورد.",
      },
      {
        title: "حالت بخار",
        body: "برای واکس‌زدایی و آلودگی پخته‌شده روی ماشین‌آلات.",
      },
      {
        title: "مقاوم برای کار در محوطه",
        body: "بدنه فولادی رنگ کوره‌ای و شاسی چرخ‌دار برای جابه‌جایی در سایت.",
      },
    ],
    applications: [
      { industry: "food-industry", note: "چربی‌زدایی تجهیزات و کف سالن تولید." },
      { industry: "automotive", note: "موتورشویی و شستشوی قطعات روغنی." },
      { industry: "factories", note: "ماشین‌آلات با گریس و روغن پخته." },
      { industry: "restaurants", note: "هود، فیلتر و کف آشپزخانه صنعتی." },
    ],
    facets: {
      machineType: "stationary",
      powerSource: "electric",
      brushType: "none",
      areaMin: 0,
      areaMax: 4000,
    },
    fit: {
      surfaces: ["machinery", "vertical", "production-line", "factory-floor"],
      dirt: ["oil", "grease", "food"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["لنس بخار", "کف‌ساز (Foam Lance)", "شیلنگ مقاوم حرارتی", "کیت لوله‌بازکن"],
    downloads: docs("HT160"),
    faqs: commonFaqs("HT160"),
    related: ["arta-hp200", "vertex-st8"],
  },

  /* --------------------------------------------------------------- بخارشوی */
  {
    slug: "vertex-st8",
    name: "بخارشوی صنعتی VERTEX ST8",
    model: "ST8",
    brand: "vertex",
    category: "steam-cleaners",
    subcategory: "بخار خشک",
    tagline: "ضدعفونی بدون مواد شیمیایی، با بخار ۱۷۵ درجه",
    summary:
      "بخار خشک اشباع ۸ بار برای ضدعفونی سطوح، درزها و تجهیزاتی که نباید خیس بمانند؛ گزینه رایج صنایع غذایی و مراکز درمانی.",
    kpis: [
      s("pressure", "فشار بخار", 8, "bar", { highlight: true }),
      s("temp", "دمای بخار", 175, "°C", { highlight: true }),
      s("boiler", "حجم بویلر", 4.5, "L", { highlight: true }),
      s("motorPower", "توان", 3400, "W", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("pressure", "فشار بخار", 8, "bar"),
          s("temp", "دمای بخار", 175, "°C"),
          s("heatUp", "زمان آماده‌سازی", 8, "min"),
          t("mode", "حالت‌ها", "بخار / بخار + مکش / تزریق شوینده"),
        ],
      },
      {
        title: "بویلر و مخزن",
        specs: [
          s("boiler", "حجم بویلر", 4.5, "L"),
          t("boilerBody", "جنس بویلر", "استیل ضدزنگ AISI 304"),
          s("tank", "مخزن آب", 5, "L"),
          t("refill", "پرکردن", "پیوسته، بدون خاموش کردن"),
        ],
      },
      {
        title: "ابعاد",
        specs: [
          s("weight", "وزن", 42, "kg"),
          s("noise", "تراز صدا", 68, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "بدون مواد شیمیایی",
        body: "برای محیط‌هایی که باقی‌مانده شوینده روی سطح مسئله است — سالن تولید مواد غذایی، اتاق درمان.",
      },
      {
        title: "بخار خشک، خشک‌شدن سریع",
        body: "رطوبت پایین بخار یعنی سطح تقریباً بلافاصله قابل استفاده است.",
      },
      {
        title: "مکش هم‌زمان",
        body: "آلودگی جداشده در همان لحظه مکیده می‌شود و روی سطح جابه‌جا نمی‌شود.",
      },
    ],
    applications: [
      { industry: "food-industry", note: "ضدعفونی تجهیزات، درزها و نوار نقاله." },
      { industry: "hospitals", note: "اتاق‌ها، سرویس بهداشتی و تجهیزات." },
      { industry: "hotels", note: "حمام، سرویس و مبلمان." },
      { industry: "restaurants", note: "آشپزخانه، هود و کف چرب." },
    ],
    facets: {
      machineType: "handheld",
      powerSource: "electric",
      brushType: "none",
      areaMin: 0,
      areaMax: 1500,
    },
    fit: {
      surfaces: ["production-line", "machinery", "vertical"],
      dirt: ["grease", "food", "chemical", "dust"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "rfq",
    accessories: ["نازل نقطه‌ای", "برس استیل", "کیت شیشه", "شیلنگ ۵ متری"],
    downloads: docs("ST8"),
    faqs: commonFaqs("ST8"),
    related: ["vertex-ht160", "arta-ce35"],
  },

  /* ------------------------------------------------------- موکت‌شوی و پولیشر */
  {
    slug: "arta-ce35",
    name: "مبل و موکت‌شوی ARTA CE35",
    model: "CE35",
    brand: "arta",
    category: "carpet-extractors",
    subcategory: "تزریق-استخراج",
    tagline: "شستشوی عمقی فرش، موکت و مبلمان",
    summary:
      "دستگاه تزریق-استخراج با مخزن ۳۵ لیتری؛ محلول را به عمق الیاف تزریق و بلافاصله همراه آلودگی استخراج می‌کند.",
    kpis: [
      s("tank", "مخزن آب تمیز", 35, "L", { highlight: true }),
      s("pumpPressure", "فشار پمپ تزریق", 4, "bar", { highlight: true }),
      s("vacuum", "مکش", 240, "mbar", { highlight: true }),
      s("coverage", "راندمان نظری", 180, "m²/h", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("coverage", "راندمان نظری", 180, "m²/h"),
          s("pumpPressure", "فشار پمپ تزریق", 4, "bar"),
          s("vacuum", "مکش", 240, "mbar"),
          s("width", "عرض کار ابزار کف", 300, "mm"),
        ],
      },
      {
        title: "مخزن و تغذیه",
        specs: [
          s("tank", "مخزن آب تمیز", 35, "L"),
          s("recovery", "مخزن آب کثیف", 30, "L"),
          s("motorPower", "توان", 1600, "W"),
          t("heater", "هیتر", "اختیاری — تا ۶۰°C"),
        ],
      },
      {
        title: "ابعاد",
        specs: [
          s("weight", "وزن", 34, "kg"),
          s("hose", "طول شیلنگ", 4, "m"),
          s("noise", "تراز صدا", 70, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "خشک‌شدن سریع‌تر",
        body: "مکش قوی، رطوبت باقی‌مانده را کم می‌کند؛ فرش هتل تا شیفت بعد قابل استفاده است.",
      },
      {
        title: "ابزار دستی مبلمان",
        body: "شفافیت ابزار دستی اجازه می‌دهد اپراتور ببیند چه زمانی آب خروجی تمیز شده است.",
      },
      {
        title: "هیتر اختیاری",
        body: "آب گرم بازدهی شوینده روی لکه‌های قدیمی را بالا می‌برد.",
      },
    ],
    applications: [
      { industry: "hotels", note: "اتاق‌ها، راهرو و لابی." },
      { industry: "offices", note: "موکت فضاهای اداری." },
      { industry: "retail", note: "فرش نمایشگاه و بخش‌های VIP." },
    ],
    facets: {
      machineType: "walk-behind",
      powerSource: "electric",
      brushType: "none",
      areaMin: 50,
      areaMax: 1500,
    },
    fit: {
      surfaces: ["carpet"],
      dirt: ["dust", "food", "mud"],
      frequency: ["weekly", "monthly", "seasonal"],
    },
    priceMode: "rfq",
    accessories: ["ابزار دستی مبلمان", "ابزار کف ۴۰۰", "هیتر", "شوینده موکت"],
    downloads: docs("CE35"),
    faqs: commonFaqs("CE35"),
    related: ["arta-sd430", "vertex-st8"],
  },
  {
    slug: "arta-sd430",
    name: "پولیشر تک‌دیسک ARTA SD430",
    model: "SD430",
    brand: "arta",
    category: "single-disc-machines",
    subcategory: "تک‌سرعته",
    tagline: "ساب، پولیش و شستشوی نقطه‌ای سطوح سخت",
    summary:
      "دستگاه تک‌دیسک ۴۳۰ میلی‌متری با ۱۵۴ دور در دقیقه؛ کار سنگین احیای کف که اسکرابر انجام نمی‌دهد.",
    kpis: [
      s("width", "قطر دیسک", 430, "mm", { highlight: true }),
      s("rpm", "دور کاری", 154, "rpm", { highlight: true }),
      s("motorPower", "توان موتور", 1500, "W", { highlight: true }),
      s("weight", "وزن", 48, "kg", { highlight: true }),
    ],
    specGroups: [
      {
        title: "عملکرد",
        specs: [
          s("width", "قطر دیسک", 430, "mm"),
          s("rpm", "دور کاری", 154, "rpm"),
          s("motorPower", "توان موتور", 1500, "W"),
          s("pressure", "فشار روی سطح", 42, "g/cm²"),
        ],
      },
      {
        title: "تجهیزات",
        specs: [
          t("tank", "مخزن محلول", "۱۲ لیتر (اختیاری)"),
          t("handle", "دسته", "قابل تنظیم ارتفاع، کنترل دو دستی"),
          s("cable", "طول کابل", 15, "m"),
          s("noise", "تراز صدا", 60, "dB(A)"),
        ],
      },
    ],
    features: [
      {
        title: "احیای کف فرسوده",
        body: "با پد ساینده، لایه واکس و آلودگی کهنه برداشته می‌شود؛ کاری که هیچ اسکرابری جایگزینش نیست.",
      },
      {
        title: "چندکاره با تعویض پد",
        body: "ساب، پولیش، شستشوی موکت با بونت و لکه‌گیری نقطه‌ای با یک دستگاه.",
      },
      {
        title: "کنترل دو دستی ایمن",
        body: "رها شدن دسته، دستگاه را متوقف می‌کند.",
      },
    ],
    applications: [
      { industry: "hotels", note: "لابی سنگی و راهروها." },
      { industry: "offices", note: "احیای دوره‌ای کف سنگ و سرامیک." },
      { industry: "retail", note: "پولیش کف فروشگاه." },
      { industry: "hospitals", note: "احیای کف اپوکسی و PVC." },
    ],
    facets: {
      machineType: "walk-behind",
      powerSource: "electric",
      brushType: "disc",
      areaMin: 50,
      areaMax: 2000,
      workingWidth: 430,
    },
    fit: {
      surfaces: ["factory-floor", "carpet"],
      dirt: ["dust", "grease", "oil"],
      frequency: ["weekly", "monthly", "seasonal"],
    },
    priceMode: "rfq",
    accessories: ["پد هولدر", "پد مشکی ساینده", "برس ساب", "مخزن محلول"],
    downloads: docs("SD430"),
    faqs: commonFaqs("SD430"),
    related: ["arta-c430", "arta-ce35"],
  },

  /* --------------------------------------------------------------- مصرفی */
  {
    slug: "arta-deg-x1",
    name: "چربی‌زدای صنعتی ARTA DEG-X1",
    model: "DEG-X1",
    brand: "arta",
    category: "cleaning-chemicals",
    subcategory: "چربی‌زدا قلیایی",
    tagline: "روغن و گریس روی بتن و اپوکسی",
    summary:
      "شوینده قلیایی کم‌کف، مخصوص اسکرابر. کم‌کف بودن برای دستگاه ضروری است؛ شوینده معمولی مخزن مکش را پر از کف می‌کند.",
    kpis: [
      s("volume", "حجم", 20, "L", { highlight: true }),
      t("ph", "pH", "۱۱.۵", { highlight: true }),
      t("dilution", "نسبت رقت", "۱:۲۰ تا ۱:۵۰", { highlight: true }),
      t("foam", "کف", "کم‌کف — مناسب اسکرابر", { highlight: true }),
    ],
    specGroups: [
      {
        title: "مشخصات",
        specs: [
          s("volume", "حجم بسته", 20, "L"),
          t("ph", "pH محلول غلیظ", "۱۱.۵"),
          t("dilution", "نسبت رقت پیشنهادی", "۱:۲۰ (سنگین) تا ۱:۵۰ (نگهداری روزانه)"),
          t("surfaces", "سطوح مجاز", "بتن، اپوکسی، سرامیک صنعتی، فلز"),
          t("avoid", "سطوح نامناسب", "آلومینیوم رنگ‌نشده، سنگ طبیعی اسیدحساس"),
        ],
      },
    ],
    features: [
      {
        title: "کم‌کف، سازگار با دستگاه",
        body: "بدون کف اضافه در مخزن بازیافت؛ عمر شناور و توربین حفظ می‌شود.",
      },
      {
        title: "تجزیه‌پذیر",
        body: "مطابق الزامات رایج تصفیه پساب صنعتی.",
      },
      {
        title: "صرفه در مصرف",
        body: "در رقت ۱:۵۰، هر بشکه ۲۰ لیتری حدود ۱٬۰۰۰ لیتر محلول کاری می‌دهد.",
      },
    ],
    applications: [
      { industry: "factories", note: "کف سالن تولید با روغن ماشین‌آلات." },
      { industry: "automotive", note: "تعمیرگاه و سالن مونتاژ." },
      { industry: "warehouses", note: "رد لاستیک لیفتراک." },
    ],
    facets: {
      machineType: "handheld",
      powerSource: "electric",
      brushType: "none",
      areaMin: 0,
      areaMax: 100000,
    },
    fit: {
      surfaces: ["factory-floor", "warehouse", "parking", "machinery"],
      dirt: ["oil", "grease"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "listed",
    price: 4850000,
    accessories: ["پمپ دستی بشکه", "دستگاه رقیق‌ساز خودکار"],
    downloads: [
      { title: "برگه اطلاعات ایمنی (MSDS)", kind: "certificate", size: "PDF · 260KB", href: "#" },
      { title: "دیتاشیت DEG-X1", kind: "datasheet", size: "PDF · 180KB", href: "#" },
    ],
    faqs: [
      {
        q: "با هر اسکرابری قابل استفاده است؟",
        a: "بله، تا زمانی که سازنده دستگاه شوینده قلیایی را منع نکرده باشد. برای دستگاه‌های با اجزای آلومینیومی، نسبت رقت را از ۱:۴۰ شروع کنید.",
      },
      {
        q: "روی کف اپوکسی مات‌شدگی ایجاد می‌کند؟",
        a: "در رقت پیشنهادی خیر. استفاده غلیظ و بدون آبکشی روی اپوکسی توصیه نمی‌شود.",
      },
    ],
    related: ["arta-neu-n2", "arta-s700"],
  },
  {
    slug: "arta-neu-n2",
    name: "شوینده خنثی ARTA NEU-N2",
    model: "NEU-N2",
    brand: "arta",
    category: "cleaning-chemicals",
    subcategory: "شوینده خنثی",
    tagline: "نگهداری روزانه سطوح حساس",
    summary:
      "شوینده pH خنثی برای سنگ، PVC و کف‌های پولیش‌شده؛ بدون آسیب به لایه محافظ و بدون باقی‌مانده لغزنده.",
    kpis: [
      s("volume", "حجم", 20, "L", { highlight: true }),
      t("ph", "pH", "۷.۵", { highlight: true }),
      t("dilution", "نسبت رقت", "۱:۱۰۰ تا ۱:۲۰۰", { highlight: true }),
      t("residue", "باقی‌مانده", "بدون رگه", { highlight: true }),
    ],
    specGroups: [
      {
        title: "مشخصات",
        specs: [
          s("volume", "حجم بسته", 20, "L"),
          t("ph", "pH محلول غلیظ", "۷.۵"),
          t("dilution", "نسبت رقت پیشنهادی", "۱:۱۰۰ تا ۱:۲۰۰"),
          t("surfaces", "سطوح مجاز", "سنگ طبیعی، سرامیک، PVC، لینولئوم، اپوکسی"),
        ],
      },
    ],
    features: [
      {
        title: "بی‌خطر برای لایه محافظ",
        body: "واکس و پوشش کف را برنمی‌دارد؛ برای برنامه نگهداری روزانه ساخته شده.",
      },
      {
        title: "بدون رگه",
        body: "روی سنگ پولیش و لابی هتل، رد خشک‌شدن باقی نمی‌گذارد.",
      },
      {
        title: "ضدلغزش",
        body: "باقی‌مانده لغزنده ندارد — الزام رایج ایمنی در فضاهای عمومی.",
      },
    ],
    applications: [
      { industry: "hotels", note: "لابی، راهرو و سالن‌های عمومی." },
      { industry: "hospitals", note: "کف بخش‌ها و راهروها." },
      { industry: "offices", note: "نظافت روزانه." },
      { industry: "retail", note: "کف فروشگاه در ساعات کاری." },
    ],
    facets: {
      machineType: "handheld",
      powerSource: "electric",
      brushType: "none",
      areaMin: 0,
      areaMax: 100000,
    },
    fit: {
      surfaces: ["factory-floor", "warehouse"],
      dirt: ["dust", "food"],
      frequency: ["daily", "weekly"],
    },
    priceMode: "listed",
    price: 3200000,
    accessories: ["پمپ دستی بشکه", "دستگاه رقیق‌ساز خودکار"],
    downloads: [
      { title: "برگه اطلاعات ایمنی (MSDS)", kind: "certificate", size: "PDF · 240KB", href: "#" },
    ],
    faqs: [
      {
        q: "برای سنگ طبیعی بی‌خطر است؟",
        a: "بله، pH خنثی است و روی مرمر و تراورتن سطح را مات نمی‌کند.",
      },
    ],
    related: ["arta-deg-x1", "arta-c430"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function productsByBrand(brand: string): Product[] {
  return products.filter((p) => p.brand === brand);
}

export function productsByIndustry(industry: string): Product[] {
  return products.filter((p) => p.applications.some((a) => a.industry === industry));
}
