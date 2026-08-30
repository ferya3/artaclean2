import {
  getPayrollYear,
  shiftOptions,
  type PayrollYear,
  type ShiftKey,
  type TaxBracket,
} from "@/lib/payroll/config";

/**
 * موتور محاسبه حقوق — توابع خالص، بدون وابستگی به React.
 * ورودی: کارکرد یک ماه. خروجی: ریز مزایا، کسورات و خالص پرداختی.
 *
 * همه مبالغ به ریال است (همان واحد بخشنامه). گرد کردن فقط در لایه نمایش
 * انجام می‌شود تا جمع ستون‌ها با هم بخواند.
 *
 * قاعده‌های محاسبه در یک نگاه:
 *   مزد ساعتی      = (مزد روزانه + پایه سنوات روزانه) ÷ ۷.۳۳
 *   اضافه‌کاری      = مزد ساعتی × ۱.۴ × ساعت
 *   شب‌کاری         = مزد ساعتی × ۰.۳۵ × ساعت      (فوق‌العاده، نه اصل مزد)
 *   جمعه‌کاری       = مزد ساعتی × ۰.۴۰ × ساعت      (فوق‌العاده)
 *   تعطیل‌کاری      = مزد ساعتی × ۱.۴ × ساعت
 *   نوبت‌کاری       = درصد × مزد ماهانه
 *   بیمه سهم کارگر = ۷٪ مزایای مشمول بیمه (حق اولاد معاف است)
 *   درآمد مشمول مالیات = مزایای مشمول − بیمه سهم کارگر − معافیت ماهانه
 */

export interface PayrollInput {
  year: number;
  /** نام پرسنل — فقط برای نمایش در فیش. */
  name: string;
  /** مزد روزانه شغل؛ اگر خالی بماند حداقل مزد سال استفاده می‌شود. */
  dailyWage: number;
  /** سابقه کار به سال — مبنای پایه سنوات و حق اولاد. */
  seniorityYears: number;
  /** تعداد فرزند مشمول حق اولاد. */
  children: number;

  // ------------------------------------------------------------- کارکرد
  /** روز کارکرد در ماه (شامل جمعه و تعطیلات با حقوق). */
  workedDays: number;
  overtimeHours: number;
  nightHours: number;
  fridayHours: number;
  holidayHours: number;
  shift: ShiftKey;

  // ------------------------------------------------- مزایا و کسور دیگر
  /** مزایای دیگر مشمول بیمه و مالیات (پاداش، فوق‌العاده شغل، …). */
  otherEarnings: number;
  /** کسور دیگر (مساعده، قسط وام، …). */
  otherDeductions: number;

  // -------------------------------------------------------------- سوییچ‌ها
  /** حق مسکن، بن و حق اولاد به نسبت روز کارکرد پرداخت شود. */
  prorateBenefits: boolean;
  includeHousing: boolean;
  includeFood: boolean;
  /** مشمول بیمه تأمین اجتماعی. */
  insured: boolean;
  /** مشمول کسر مالیات حقوق. */
  taxed: boolean;
}

export interface PayrollLine {
  key: string;
  label: string;
  amount: number;
  /** توضیح کوتاه نحوه محاسبه — زیر عنوان ردیف نمایش داده می‌شود. */
  hint?: string;
}

export interface PayrollResult {
  year: PayrollYear;
  /** مزد روزانه مؤثر (مزد شغل + پایه سنوات). */
  dailyTotal: number;
  hourlyWage: number;
  earnings: PayrollLine[];
  deductions: PayrollLine[];
  grossPay: number;
  /** جمع مزایای مشمول بیمه و مالیات (بدون حق اولاد). */
  insurableBase: number;
  taxableIncome: number;
  totalDeductions: number;
  netPay: number;
  /** سهم کارفرما — در فیش کسر نمی‌شود، برای برآورد هزینه پرسنل است. */
  employerShare: number;
  totalCost: number;
  /** برآورد عیدی و سنوات یک سال کامل با همین مزد. */
  yearEnd: { bonus: number; severance: number };
}

export const defaultPayrollInput = (year: number): PayrollInput => {
  const y = getPayrollYear(year);
  return {
    year: y.year,
    name: "",
    dailyWage: y.minDailyWage,
    seniorityYears: 0,
    children: 0,
    workedDays: y.monthDays,
    overtimeHours: 0,
    nightHours: 0,
    fridayHours: 0,
    holidayHours: 0,
    shift: "none",
    otherEarnings: 0,
    otherDeductions: 0,
    prorateBenefits: true,
    includeHousing: true,
    includeFood: true,
    insured: true,
    taxed: true,
  };
};

/** مالیات پلکانی روی مازاد بر معافیت ماهانه. */
export function monthlyTax(taxableIncome: number, brackets: TaxBracket[], exemption: number): number {
  const over = taxableIncome - exemption;
  if (over <= 0) return 0;

  let tax = 0;
  let floor = exemption;
  for (const bracket of brackets) {
    const ceiling = bracket.upTo ?? Infinity;
    const slice = Math.min(taxableIncome, ceiling) - floor;
    if (slice > 0) tax += slice * bracket.rate;
    if (taxableIncome <= ceiling) break;
    floor = ceiling;
  }
  return tax;
}

export function calculatePayroll(input: PayrollInput): PayrollResult {
  const y = getPayrollYear(input.year);

  const days = clamp(input.workedDays, 0, 31);
  const ratio = input.prorateBenefits ? days / y.monthDays : 1;

  // پایه سنوات فقط با حداقل یک سال سابقه.
  const seniorityDaily = input.seniorityYears >= 1 ? y.seniorityDaily : 0;
  const dailyTotal = input.dailyWage + seniorityDaily;
  const hourlyWage = dailyTotal / y.dailyHours;
  const monthlyWage = dailyTotal * y.monthDays;

  const eligibleChildren = y.childMaxCount ? Math.min(input.children, y.childMaxCount) : input.children;
  const childEligible = input.seniorityYears * 365 >= y.childMinDays && eligibleChildren > 0;

  const shiftRate = shiftOptions.find((o) => o.key === input.shift)?.rate(y) ?? 0;

  const earnings: PayrollLine[] = [
    {
      key: "base",
      label: "مزد پایه کارکرد",
      amount: input.dailyWage * days,
      hint: `مزد روزانه × ${fmtNum(days)} روز`,
    },
  ];

  if (seniorityDaily > 0) {
    earnings.push({
      key: "seniority",
      label: "پایه سنوات",
      amount: seniorityDaily * days,
      hint: `پایه سنوات روزانه × ${fmtNum(days)} روز`,
    });
  }

  if (input.includeHousing) {
    earnings.push({
      key: "housing",
      label: "حق مسکن",
      amount: y.housingMonthly * ratio,
      hint: input.prorateBenefits ? `به نسبت ${fmtNum(days)} روز کارکرد` : "ماهانه مقطوع",
    });
  }

  if (input.includeFood) {
    earnings.push({
      key: "food",
      label: "بن کارگری (خواربار)",
      amount: y.foodMonthly * ratio,
      hint: input.prorateBenefits ? `به نسبت ${fmtNum(days)} روز کارکرد` : "ماهانه مقطوع",
    });
  }

  if (childEligible) {
    earnings.push({
      key: "child",
      label: "حق اولاد",
      amount: y.childMonthly * eligibleChildren * ratio,
      hint: `${fmtNum(eligibleChildren)} فرزند — معاف از بیمه و مالیات`,
    });
  }

  if (input.overtimeHours > 0) {
    earnings.push({
      key: "overtime",
      label: "اضافه‌کاری",
      amount: hourlyWage * y.rates.overtime * input.overtimeHours,
      hint: `${fmtNum(input.overtimeHours)} ساعت × ${y.rates.overtime} مزد ساعتی`,
    });
  }

  if (input.nightHours > 0) {
    earnings.push({
      key: "night",
      label: "فوق‌العاده شب‌کاری",
      amount: hourlyWage * y.rates.night * input.nightHours,
      hint: `${fmtNum(input.nightHours)} ساعت × ${y.rates.night} مزد ساعتی`,
    });
  }

  if (input.fridayHours > 0) {
    earnings.push({
      key: "friday",
      label: "فوق‌العاده جمعه‌کاری",
      amount: hourlyWage * y.rates.friday * input.fridayHours,
      hint: `${fmtNum(input.fridayHours)} ساعت × ${y.rates.friday} مزد ساعتی`,
    });
  }

  if (input.holidayHours > 0) {
    earnings.push({
      key: "holiday",
      label: "تعطیل‌کاری",
      amount: hourlyWage * y.rates.holiday * input.holidayHours,
      hint: `${fmtNum(input.holidayHours)} ساعت × ${y.rates.holiday} مزد ساعتی`,
    });
  }

  if (shiftRate > 0) {
    earnings.push({
      key: "shift",
      label: "فوق‌العاده نوبت‌کاری",
      amount: monthlyWage * shiftRate * ratio,
      hint: `${fmtNum(shiftRate * 100)}٪ مزد ماهانه`,
    });
  }

  if (input.otherEarnings > 0) {
    earnings.push({ key: "other", label: "مزایای دیگر", amount: input.otherEarnings });
  }

  const grossPay = sum(earnings);

  // حق اولاد از بیمه و مالیات معاف است؛ بقیه اقلام مشمول‌اند.
  const childAmount = earnings.find((l) => l.key === "child")?.amount ?? 0;
  const insurableBase = grossPay - childAmount;

  const employeeInsurance = input.insured ? insurableBase * y.insurance.employee : 0;
  const taxableIncome = Math.max(0, insurableBase - employeeInsurance);
  const tax = input.taxed ? monthlyTax(taxableIncome, y.tax.brackets, y.tax.monthlyExemption) : 0;

  const deductions: PayrollLine[] = [];
  if (employeeInsurance > 0) {
    deductions.push({
      key: "insurance",
      label: "بیمه سهم کارگر",
      amount: employeeInsurance,
      hint: `${fmtNum(y.insurance.employee * 100)}٪ مزایای مشمول بیمه`,
    });
  }
  if (tax > 0) {
    deductions.push({
      key: "tax",
      label: "مالیات حقوق",
      amount: tax,
      hint: "پس از کسر معافیت ماهانه",
    });
  }
  if (input.otherDeductions > 0) {
    deductions.push({ key: "otherDeduction", label: "کسور دیگر", amount: input.otherDeductions });
  }

  const totalDeductions = sum(deductions);
  const employerShare = input.insured
    ? insurableBase * (y.insurance.employer + y.insurance.unemployment)
    : 0;

  // عیدی: دو برابر مزد ماهانه، با سقف سه برابر حداقل مزد ماهانه.
  const minMonthly = (y.minDailyWage + seniorityDaily) * y.monthDays;
  const bonus = Math.min(
    monthlyWage * y.yearEnd.bonusMultiplier,
    minMonthly * y.yearEnd.bonusCapMultiplier,
  );

  return {
    year: y,
    dailyTotal,
    hourlyWage,
    earnings,
    deductions,
    grossPay,
    insurableBase,
    taxableIncome,
    totalDeductions,
    netPay: grossPay - totalDeductions,
    employerShare,
    totalCost: grossPay + employerShare,
    yearEnd: { bonus, severance: monthlyWage * y.yearEnd.severanceMultiplier },
  };
}

const sum = (lines: PayrollLine[]) => lines.reduce((t, l) => t + l.amount, 0);
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const fmtNum = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);
