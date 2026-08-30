/**
 * ============================================================================
 *  ثابت‌های حقوق و دستمزد — تنها فایلی که هر سال باید دست بخورد
 * ============================================================================
 *
 *  هر سال بعد از انتشار «بخشنامه مزد» وزارت کار، فقط کافی است یک بلوک جدید
 *  به آرایه `payrollYears` اضافه شود؛ هیچ کد دیگری تغییر نمی‌کند. صفحه
 *  محاسبه‌گر خودش جدیدترین سال را پیش‌فرض می‌گیرد.
 *
 *  واحد همه مبالغ «ریال» است — دقیقاً همان عددی که در بخشنامه نوشته می‌شود،
 *  تا موقع به‌روزرسانی لازم نباشد چیزی تقسیم بر ۱۰ شود. نمایش در رابط کاربری
 *  به تومان است و آنجا تبدیل می‌شود.
 *
 *  ⚠️ ارقام زیر باید پیش از استفاده رسمی با متن بخشنامه سال جاری و بخشنامه
 *  مالیاتی سازمان امور مالیاتی تطبیق داده شود. هر سالی که `draft: true` باشد،
 *  در رابط کاربری با هشدار نمایش داده می‌شود.
 */

/** یک پله از جدول مالیات حقوق (ماهانه). */
export interface TaxBracket {
  /** سقف این پله؛ `null` یعنی «مازاد بر پله قبل». */
  upTo: number | null;
  /** نرخ به‌صورت کسری — ۰.۱ یعنی ۱۰٪. */
  rate: number;
}

export interface PayrollYear {
  /** سال شمسی. */
  year: number;

  // ------------------------------------------------------------ مزد پایه
  /** حداقل مزد روزانه کارگر (بخشنامه مزد). */
  minDailyWage: number;
  /** پایه سنوات روزانه — به کارگر با حداقل یک سال سابقه تعلق می‌گیرد. */
  seniorityDaily: number;

  // ------------------------------------------------ مزایای ثابت ماهانه
  /** حق مسکن ماهانه (مصوبه هیئت وزیران). */
  housingMonthly: number;
  /** بن کارگری / کمک‌هزینه اقلام مصرفی ماهانه. */
  foodMonthly: number;
  /**
   * حق اولاد ماهانه به ازای هر فرزند.
   * قانوناً معادل سه روز حداقل مزد است؛ عدد را صریح نوشته‌ایم تا اگر
   * فرمول قانون تغییر کرد فقط همین‌جا عوض شود.
   */
  childMonthly: number;
  /** حداقل سابقه لازم (روز) برای تعلق حق اولاد — طبق قانون ۷۲۰ روز. */
  childMinDays: number;
  /** حداکثر تعداد فرزند مشمول؛ `null` یعنی بدون سقف. */
  childMaxCount: number | null;

  // --------------------------------------------------------- ساعت کاری
  /** ساعت کار روزانه قانونی (۷ ساعت و ۲۰ دقیقه). */
  dailyHours: number;
  /** روزهای ماه برای محاسبه مزایای ماهانه. */
  monthDays: number;

  // ----------------------------------------------------- ضرایب اضافه‌کار
  rates: {
    /** اضافه‌کاری: ۴۰٪ اضافه بر مزد ساعتی. */
    overtime: number;
    /** فوق‌العاده شب‌کاری: ۳۵٪ مزد ساعتی. */
    night: number;
    /** فوق‌العاده جمعه‌کاری: ۴۰٪ مزد ساعتی. */
    friday: number;
    /** تعطیل‌کاری رسمی: مثل اضافه‌کاری. */
    holiday: number;
    /** فوق‌العاده نوبت‌کاری — درصدی از مزد ماهانه. */
    shiftMorningEvening: number;
    shiftMorningEveningNight: number;
    shiftMorningNight: number;
  };

  // -------------------------------------------------------------- بیمه
  insurance: {
    /** سهم کارگر از حق بیمه. */
    employee: number;
    /** سهم کارفرما. */
    employer: number;
    /** بیمه بیکاری (سهم کارفرما). */
    unemployment: number;
  };

  // ------------------------------------------------------------ مالیات
  tax: {
    /** معافیت مالیاتی ماهانه حقوق. */
    monthlyExemption: number;
    /** پله‌های مالیات روی مازاد بر معافیت — به ترتیب صعودی. */
    brackets: TaxBracket[];
  };

  // ------------------------------------------------- عیدی و سنوات پایان سال
  yearEnd: {
    /** عیدی = این ضریب × مزد ماهانه. */
    bonusMultiplier: number;
    /** سقف عیدی = این ضریب × حداقل مزد ماهانه. */
    bonusCapMultiplier: number;
    /** سنوات = این ضریب × مزد ماهانه به ازای هر سال کار. */
    severanceMultiplier: number;
  };

  /** مقادیر هنوز با بخشنامه رسمی تطبیق داده نشده‌اند. */
  draft?: boolean;
  /** یادداشت کوتاهی که کنار انتخاب سال نمایش داده می‌شود. */
  note?: string;
}

/** بخش‌هایی که در همه سال‌ها یکسان‌اند؛ برای کوتاه ماندن بلوک هر سال. */
const common = {
  dailyHours: 7.33,
  monthDays: 30,
  childMinDays: 720,
  childMaxCount: null,
  rates: {
    overtime: 1.4,
    night: 0.35,
    friday: 0.4,
    holiday: 1.4,
    shiftMorningEvening: 0.1,
    shiftMorningEveningNight: 0.15,
    shiftMorningNight: 0.225,
  },
  insurance: {
    employee: 0.07,
    employer: 0.2,
    unemployment: 0.03,
  },
  yearEnd: {
    bonusMultiplier: 2,
    bonusCapMultiplier: 3,
    severanceMultiplier: 1,
  },
} satisfies Partial<PayrollYear>;

export const payrollYears: PayrollYear[] = [
  {
    ...common,
    year: 1403,
    minDailyWage: 2_388_728,
    seniorityDaily: 210_000,
    housingMonthly: 9_000_000,
    foodMonthly: 14_000_000,
    childMonthly: 7_166_184, // ۳ × حداقل مزد روزانه
    tax: {
      monthlyExemption: 100_000_000,
      brackets: [
        { upTo: 140_000_000, rate: 0.1 },
        { upTo: 230_000_000, rate: 0.15 },
        { upTo: 400_000_000, rate: 0.2 },
        { upTo: null, rate: 0.3 },
      ],
    },
  },
  {
    ...common,
    year: 1404,
    minDailyWage: 3_035_295,
    seniorityDaily: 300_000,
    housingMonthly: 9_000_000,
    foodMonthly: 22_000_000,
    childMonthly: 9_105_885, // ۳ × حداقل مزد روزانه
    tax: {
      monthlyExemption: 240_000_000,
      brackets: [
        { upTo: 340_000_000, rate: 0.1 },
        { upTo: 450_000_000, rate: 0.15 },
        { upTo: 560_000_000, rate: 0.2 },
        { upTo: null, rate: 0.3 },
      ],
    },
    note: "حق مسکن و پله‌های مالیاتی را با آخرین مصوبه تطبیق دهید.",
  },
  {
    ...common,
    year: 1405,
    // مقادیر ۱۴۰۵ هنوز از بخشنامه وارد نشده — فعلاً کپی ۱۴۰۴ است.
    minDailyWage: 3_035_295,
    seniorityDaily: 300_000,
    housingMonthly: 9_000_000,
    foodMonthly: 22_000_000,
    childMonthly: 9_105_885,
    tax: {
      monthlyExemption: 240_000_000,
      brackets: [
        { upTo: 340_000_000, rate: 0.1 },
        { upTo: 450_000_000, rate: 0.15 },
        { upTo: 560_000_000, rate: 0.2 },
        { upTo: null, rate: 0.3 },
      ],
    },
    draft: true,
    note: "ارقام ۱۴۰۵ هنوز وارد نشده و کپی ۱۴۰۴ است؛ از بخشنامه امسال جایگزین کنید.",
  },
];

/** جدیدترین سالِ تعریف‌شده — پیش‌فرض محاسبه‌گر. */
export const latestPayrollYear = payrollYears.reduce((a, b) => (b.year > a.year ? b : a));

export function getPayrollYear(year: number): PayrollYear {
  return payrollYears.find((y) => y.year === year) ?? latestPayrollYear;
}

/** کلیدهای نوبت‌کاری، با برچسب فارسی — رابط کاربری از همین می‌خواند. */
export const shiftOptions = [
  { key: "none", label: "بدون نوبت‌کاری", rate: (y: PayrollYear) => 0 },
  { key: "me", label: "صبح و عصر", rate: (y: PayrollYear) => y.rates.shiftMorningEvening },
  { key: "men", label: "صبح، عصر و شب", rate: (y: PayrollYear) => y.rates.shiftMorningEveningNight },
  { key: "mn", label: "صبح و شب", rate: (y: PayrollYear) => y.rates.shiftMorningNight },
] as const;

export type ShiftKey = (typeof shiftOptions)[number]["key"];
