import type { Industry } from "@/lib/types";

export const industries: Industry[] = [
  {
    slug: "factories",
    name: "کارخانه‌ها",
    latin: "Manufacturing",
    blurb:
      "کف سالن تولید هم‌زمان گرد و خاک، براده و روغن دارد و توقف خط برای نظافت هزینه مستقیم است. راهکار معمولاً ترکیب سویپر + اسکرابر است، نه یک دستگاه.",
    problems: [
      {
        key: "dust",
        title: "گرد و غبار و براده",
        body: "غبار معلق روی محصول و تجهیزات می‌نشیند و به سنسورها آسیب می‌زند. مکش نقطه‌ای کنار ماشین‌آلات به‌همراه جاروی دوره‌ای کف، مؤثرترین ترکیب است.",
        dirt: ["dust"],
      },
      {
        key: "oil",
        title: "روغن و گریس روی کف",
        body: "خطر لغزش و آلودگی محصول. اسکرابر با برس رولی و چربی‌زدای قلیایی کم‌کف؛ برای لکه‌های پخته، واترجت آب‌گرم.",
        dirt: ["oil", "grease"],
      },
      {
        key: "chemical",
        title: "مواد شیمیایی و پودر قابل اشتعال",
        body: "در محیط ATEX هیچ منبع جرقه‌ای مجاز نیست. مکنده بادی آنتی‌استاتیک با گواهی زون، تنها گزینه استاندارد است.",
        dirt: ["chemical", "dust"],
      },
      {
        key: "line",
        title: "آلودگی خط تولید",
        body: "نظافت بین شیفت‌ها باید سریع و بدون رطوبت باقی‌مانده باشد؛ بخارشوی و مکنده صنعتی به‌جای شستشوی آبی.",
        dirt: ["food", "dust", "grease"],
      },
    ],
    recommendedCategories: [
      "floor-scrubbers",
      "sweepers",
      "industrial-vacuum-cleaners",
      "pressure-washers",
    ],
    metrics: [
      { label: "کاهش زمان نظافت", value: "تا ۶۵٪" },
      { label: "بازگشت سرمایه معمول", value: "۱۲ تا ۲۴ ماه" },
      { label: "مصرف آب", value: "تا ۴۰٪ کمتر" },
    ],
  },
  {
    slug: "warehouses",
    name: "انبار و لجستیک",
    latin: "Warehousing & Logistics",
    blurb:
      "متراژ زیاد، راهروهای باریک و تردد دائم لیفتراک. مسئله اصلی، پوشش متراژ در پنجره زمانی کوتاه است.",
    problems: [
      {
        key: "debris",
        title: "ضایعات بسته‌بندی",
        body: "کارتن، نایلون و خرده چوب پالت اسکرابر را می‌گیرد. سویپر قبل از شستشو، یا اسکرابر با برس رولی و سبد ضایعات.",
        dirt: ["dust", "mud"],
      },
      {
        key: "tyre",
        title: "رد لاستیک لیفتراک",
        body: "لکه سیاه چسبنده که فقط با فشار برس و شوینده قلیایی برداشته می‌شود؛ کلاس سرنشین‌دار با فشار بالای برس.",
        dirt: ["oil", "grease"],
      },
      {
        key: "coverage",
        title: "متراژ زیاد، وقت کم",
        body: "بالای ۵٬۰۰۰ متر، دستگاه دستی جواب نمی‌دهد. سرنشین‌دار یا خودران برای مسیرهای ثابت شبانه.",
        dirt: ["dust"],
      },
    ],
    recommendedCategories: ["floor-scrubbers", "sweepers", "robotic-cleaning"],
    metrics: [
      { label: "پوشش یک شیفت", value: "تا ۱۸٬۰۰۰ m²" },
      { label: "نیروی نظافت", value: "تا ۳ برابر کمتر" },
      { label: "شیفت شب بدون اپراتور", value: "با مدل خودران" },
    ],
  },
  {
    slug: "hospitals",
    name: "بیمارستان و مراکز درمانی",
    latin: "Healthcare",
    blurb:
      "کنترل عفونت، صدای پایین و ایمنی سطح لغزنده. دستگاه باید در ساعات کاری و کنار بیمار قابل استفاده باشد.",
    problems: [
      {
        key: "infection",
        title: "کنترل عفونت",
        body: "بخار خشک ۱۷۵ درجه برای ضدعفونی بدون باقی‌مانده شیمیایی؛ مکنده با فیلتر HEPA برای جلوگیری از انتشار مجدد ذرات.",
        dirt: ["chemical", "dust"],
      },
      {
        key: "noise",
        title: "صدا در بخش‌های بستری",
        body: "دستگاه‌های زیر ۶۵ دسی‌بل برای کار در ساعات روز و کنار اتاق بیمار.",
        dirt: ["dust"],
      },
      {
        key: "slip",
        title: "کف خیس و خطر لغزش",
        body: "اسکرابر با تیغه مکش مناسب، کف را در همان پاس خشک می‌کند؛ نه تی و سطل و تابلوی «کف خیس».",
        dirt: ["dust", "food"],
      },
    ],
    recommendedCategories: [
      "floor-scrubbers",
      "steam-cleaners",
      "industrial-vacuum-cleaners",
      "single-disc-machines",
    ],
    metrics: [
      { label: "تراز صدا", value: "از ۶۰ dB(A)" },
      { label: "ضدعفونی", value: "بدون مواد شیمیایی" },
      { label: "خشک‌شدن سطح", value: "بلافاصله" },
    ],
  },
  {
    slug: "hotels",
    name: "هتل و اقامتگاه",
    latin: "Hospitality",
    blurb:
      "کیفیت دیده‌شده مستقیماً روی رضایت مهمان اثر دارد. تنوع سطوح از سنگ لابی تا موکت اتاق، ابزار متنوع می‌خواهد.",
    problems: [
      {
        key: "carpet",
        title: "موکت اتاق و راهرو",
        body: "شستشوی تزریق-استخراج دوره‌ای؛ مکش قوی برای اینکه اتاق تا شیفت بعد قابل واگذاری باشد.",
        dirt: ["dust", "food"],
      },
      {
        key: "lobby",
        title: "سنگ لابی",
        body: "پولیش تک‌دیسک برای احیای براقیت و شوینده خنثی برای نگهداری روزانه بدون رگه.",
        dirt: ["dust"],
      },
      {
        key: "bath",
        title: "حمام و سرویس",
        body: "بخار برای درزها و جرم، بدون مواد شیمیایی تند در فضای بسته.",
        dirt: ["grease", "chemical"],
      },
    ],
    recommendedCategories: [
      "carpet-extractors",
      "single-disc-machines",
      "steam-cleaners",
      "floor-scrubbers",
    ],
    metrics: [
      { label: "زمان آماده‌سازی اتاق", value: "کوتاه‌تر" },
      { label: "کار در ساعات مهمان", value: "بله، مدل‌های کم‌صدا" },
      { label: "احیای سنگ", value: "دوره‌ای" },
    ],
  },
  {
    slug: "retail",
    name: "مراکز خرید و فروشگاه",
    latin: "Retail",
    blurb:
      "نظافت باید در حضور مشتری یا در پنجره کوتاه شبانه انجام شود. کف براق، مستقیماً بخشی از تجربه خرید است.",
    problems: [
      {
        key: "traffic",
        title: "تردد بالا و لکه دائمی",
        body: "اسکرابر کم‌صدا در ساعات کاری و سرنشین‌دار در شیفت شب برای متراژ کل.",
        dirt: ["dust", "food", "mud"],
      },
      {
        key: "night",
        title: "پنجره کوتاه شبانه",
        body: "مدل خودران کل مسیر ثابت را بدون اپراتور اجرا می‌کند و گزارش پوشش می‌دهد.",
        dirt: ["dust"],
      },
      {
        key: "parking",
        title: "پارکینگ طبقاتی",
        body: "سویپر برای خاک و برگ، اسکرابر سرنشین‌دار برای رد لاستیک و روغن روی رمپ.",
        dirt: ["mud", "oil", "dust"],
      },
    ],
    recommendedCategories: ["floor-scrubbers", "robotic-cleaning", "sweepers"],
    metrics: [
      { label: "کار در ساعات فروش", value: "بله" },
      { label: "گزارش پوشش", value: "با مدل خودران" },
      { label: "پارکینگ", value: "سویپر + اسکرابر" },
    ],
  },
  {
    slug: "offices",
    name: "ساختمان‌های اداری",
    latin: "Offices",
    blurb:
      "ترکیب سنگ، موکت و شیشه با بودجه نظافت محدود و انتظار کیفیت بالا؛ اینجا انتخاب درست اندازه دستگاه از قدرت آن مهم‌تر است.",
    problems: [
      {
        key: "mixed",
        title: "تنوع سطوح",
        body: "یک اسکرابر کوچک برای سنگ راهرو و یک موکت‌شوی برای فضاهای فرش‌شده، به‌جای یک دستگاه بزرگ بلااستفاده.",
        dirt: ["dust"],
      },
      {
        key: "hours",
        title: "نظافت در ساعات اداری",
        body: "دستگاه‌های کم‌صدا و بدون کابل مزاحم در راهرو.",
        dirt: ["dust", "food"],
      },
    ],
    recommendedCategories: ["floor-scrubbers", "carpet-extractors", "single-disc-machines"],
    metrics: [
      { label: "اندازه مناسب", value: "کلاس ۴۳۰–۵۱۰ mm" },
      { label: "تراز صدا", value: "زیر ۶۵ dB(A)" },
      { label: "تنوع سطوح", value: "سنگ + موکت" },
    ],
  },
  {
    slug: "restaurants",
    name: "رستوران و آشپزخانه صنعتی",
    latin: "Food Service",
    blurb:
      "چربی، کف لغزنده و بازرسی بهداشتی. مسئله اصلی چربی است، و چربی با آب سرد پاک نمی‌شود.",
    problems: [
      {
        key: "grease",
        title: "چربی کف و لغزندگی",
        body: "اسکرابر اوربیتال با شوینده چربی‌زدا؛ برای درزهای کاشی، بخارشوی.",
        dirt: ["grease", "oil", "food"],
      },
      {
        key: "hood",
        title: "هود و فیلتر",
        body: "واترجت آب‌گرم یا بخار برای چربی پخته‌شده روی فیلترها.",
        dirt: ["grease"],
      },
    ],
    recommendedCategories: ["floor-scrubbers", "steam-cleaners", "pressure-washers"],
    metrics: [
      { label: "کاهش لغزندگی", value: "محسوس" },
      { label: "بدون شیمیایی", value: "با بخار" },
      { label: "زمان نظافت پایان شیفت", value: "کوتاه‌تر" },
    ],
  },
  {
    slug: "automotive",
    name: "خودروسازی و تعمیرگاه",
    latin: "Automotive",
    blurb:
      "روغن، گریس، غبار سنباده و حلال. سالن رنگ الزامات ایمنی جداگانه دارد.",
    problems: [
      {
        key: "oil",
        title: "روغن و ضدیخ ریخته‌شده",
        body: "مکنده خشک و تر برای جمع‌آوری فوری، اسکرابر برای پاک‌سازی لکه باقی‌مانده.",
        dirt: ["oil", "grease"],
      },
      {
        key: "paint",
        title: "غبار سنباده و سالن رنگ",
        body: "مکنده سه‌فاز با فیلتر H؛ در منطقه حلال، مدل بادی ATEX.",
        dirt: ["dust", "chemical"],
      },
      {
        key: "parts",
        title: "شستشوی قطعات",
        body: "واترجت آب‌گرم با چربی‌زدا برای قطعات روغنی و موتور.",
        dirt: ["grease", "oil"],
      },
    ],
    recommendedCategories: [
      "industrial-vacuum-cleaners",
      "pressure-washers",
      "floor-scrubbers",
      "cleaning-chemicals",
    ],
    metrics: [
      { label: "سالن رنگ", value: "مدل ATEX" },
      { label: "شستشوی قطعات", value: "آب‌گرم ۸۰°C" },
      { label: "کف تعمیرگاه", value: "برس رولی" },
    ],
  },
  {
    slug: "food-industry",
    name: "صنایع غذایی",
    latin: "Food & Beverage",
    blurb:
      "بهداشت قابل ممیزی، سطوح استیل و ریسک آلودگی متقاطع. انتخاب مواد شوینده به‌اندازه انتخاب دستگاه اهمیت دارد.",
    problems: [
      {
        key: "hygiene",
        title: "بهداشت و ممیزی",
        body: "بخار خشک برای ضدعفونی بدون باقی‌مانده، همراه با ثبت برنامه نظافت.",
        dirt: ["food", "chemical"],
      },
      {
        key: "powder",
        title: "پودر و آرد قابل اشتعال",
        body: "مکنده بادی ATEX زون ۲۲؛ مکنده معمولی در این محیط ریسک انفجار غبار دارد.",
        dirt: ["dust", "chemical"],
      },
      {
        key: "wet",
        title: "کف خیس و چرب",
        body: "اسکرابر با برس رولی و تیغه مقاوم شیمیایی، همراه با شوینده مجاز صنایع غذایی.",
        dirt: ["food", "grease", "oil"],
      },
    ],
    recommendedCategories: [
      "steam-cleaners",
      "industrial-vacuum-cleaners",
      "floor-scrubbers",
      "pressure-washers",
    ],
    metrics: [
      { label: "ضدعفونی", value: "۱۷۵°C بخار" },
      { label: "محیط ATEX", value: "زون ۲۲" },
      { label: "سطوح", value: "استیل و اپوکسی" },
    ],
  },
  {
    slug: "construction",
    name: "ساختمان و پروژه",
    latin: "Construction",
    blurb:
      "نظافت پایان کار، گرد و خاک ساختمانی و محوطه خاکی. دستگاه باید جابه‌جاشدنی و مقاوم باشد.",
    problems: [
      {
        key: "handover",
        title: "نظافت پایان کار",
        body: "ترکیب سویپر برای نخاله سبک، مکنده برای غبار و اسکرابر برای شستشوی نهایی قبل از تحویل.",
        dirt: ["dust", "mud"],
      },
      {
        key: "site",
        title: "محوطه و جاده دسترسی",
        body: "سویپر دیزلی با مهار غبار برای مسیر تردد ماشین‌آلات.",
        dirt: ["mud", "dust"],
      },
      {
        key: "formwork",
        title: "قالب و داربست",
        body: "واترجت ۲۰۰ بار برای دوغاب بتن خشک‌شده روی قالب و تجهیزات.",
        dirt: ["mud"],
      },
    ],
    recommendedCategories: ["sweepers", "industrial-vacuum-cleaners", "pressure-washers", "floor-scrubbers"],
    metrics: [
      { label: "نظافت پایان کار", value: "پکیج سه‌دستگاهی" },
      { label: "اجاره", value: "روزانه / ماهانه" },
      { label: "محوطه باز", value: "سویپر دیزلی" },
    ],
  },
  {
    slug: "parking",
    name: "پارکینگ و محوطه",
    latin: "Parking & Outdoor",
    blurb:
      "رمپ شیب‌دار، رد لاستیک، روغن و خاک. دستگاه باید هم شیب را بگیرد هم آلودگی چسبنده را.",
    problems: [
      {
        key: "ramp",
        title: "رمپ و شیب",
        body: "مدل‌های سرنشین‌دار با ترمز الکترومغناطیسی و شیب کاری بالای ۱۰٪.",
        dirt: ["oil", "mud"],
      },
      {
        key: "tyre",
        title: "رد لاستیک و روغن",
        body: "فشار برس بالا به‌همراه چربی‌زدای قلیایی؛ برای لکه‌های قدیمی، واترجت آب‌گرم.",
        dirt: ["oil", "grease"],
      },
      {
        key: "outdoor",
        title: "خاک و برگ محوطه",
        body: "سویپر با مهار غبار قبل از هر شستشوی آبی.",
        dirt: ["mud", "dust"],
      },
    ],
    recommendedCategories: ["sweepers", "floor-scrubbers", "pressure-washers"],
    metrics: [
      { label: "حداکثر شیب", value: "تا ۲۰٪" },
      { label: "محوطه باز", value: "دیزلی" },
      { label: "رد لاستیک", value: "برس رولی" },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
