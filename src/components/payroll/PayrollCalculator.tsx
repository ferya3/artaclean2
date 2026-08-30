"use client";

import { useEffect, useMemo, useState } from "react";

import { fa } from "@/lib/format";
import { calculatePayroll, defaultPayrollInput, type PayrollInput } from "@/lib/payroll/calc";
import { latestPayrollYear, payrollYears, shiftOptions } from "@/lib/payroll/config";
import {
  moneyPlain,
  parseMoney,
  parseNumber,
  pct,
  factor,
  unitLabel,
  type MoneyUnit,
} from "@/lib/payroll/money";

/**
 * محاسبه‌گر حقوق ماهانه.
 *
 * تقسیم کار عمدی: این کامپوننت فقط فرم و نمایش است؛ هر عددی که «قانون» تعیینش
 * می‌کند در `lib/payroll/config.ts` است و هر فرمولی در `lib/payroll/calc.ts`.
 * بنابراین به‌روزرسانی سالانه = ویرایش یک بلوک در config، بدون دست‌زدن به UI.
 *
 * ورودی‌ها در localStorage می‌مانند تا ماه بعد فقط کارکرد عوض شود.
 */

const STORAGE_KEY = "payroll-input-v1";

export default function PayrollCalculator() {
  const [unit, setUnit] = useState<MoneyUnit>("toman");
  const [input, setInput] = useState<PayrollInput>(() => defaultPayrollInput(latestPayrollYear.year));
  const [restored, setRestored] = useState(false);

  // بازیابی آخرین ورودی‌ها (بعد از mount، تا رندر سرور و کلاینت یکی بماند).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<PayrollInput>;
        setInput((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      // localStorage در دسترس نیست — با مقادیر پیش‌فرض ادامه می‌دهیم.
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
    } catch {
      // ذخیره نشد؛ محاسبه به آن وابسته نیست.
    }
  }, [input, restored]);

  const result = useMemo(() => calculatePayroll(input), [input]);
  const year = result.year;

  const set = <K extends keyof PayrollInput>(key: K, value: PayrollInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));

  /** تعویض سال، مزد پایه را هم به حداقل مزد همان سال می‌برد اگر روی حداقل بوده. */
  const changeYear = (next: number) => {
    setInput((prev) => {
      const prevYear = payrollYears.find((y) => y.year === prev.year);
      const onMinimum = !prevYear || prev.dailyWage === prevYear.minDailyWage;
      const nextYear = payrollYears.find((y) => y.year === next) ?? latestPayrollYear;
      return {
        ...prev,
        year: next,
        dailyWage: onMinimum ? nextYear.minDailyWage : prev.dailyWage,
      };
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* ------------------------------------------------------------ فرم */}
      <div className="space-y-6 lg:col-span-7">
        <section className="card p-6">
          <Head title="سال و پرسنل" note="ارقام پایه از بخشنامه همان سال خوانده می‌شود." />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="سال محاسبه">
              <select
                value={input.year}
                onChange={(e) => changeYear(Number(e.target.value))}
                className={inputCls}
              >
                {[...payrollYears]
                  .sort((a, b) => b.year - a.year)
                  .map((y) => (
                    <option key={y.year} value={y.year}>
                      {fa(y.year)}
                      {y.draft ? " (پیش‌نویس)" : ""}
                    </option>
                  ))}
              </select>
            </Field>

            <Field label="نام پرسنل (اختیاری)">
              <input
                value={input.name}
                onChange={(e) => set("name", e.target.value)}
                className={inputCls}
                placeholder="برای درج روی فیش"
              />
            </Field>

            <Field
              label={`مزد روزانه شغل (${unitLabel[unit]})`}
              hint={`حداقل مزد ${fa(year.year)}: ${moneyPlain(year.minDailyWage, unit)}`}
            >
              <div className="flex gap-2">
                <MoneyInput
                  value={input.dailyWage}
                  unit={unit}
                  onChange={(v) => set("dailyWage", v)}
                />
                <button
                  type="button"
                  onClick={() => set("dailyWage", year.minDailyWage)}
                  className="btn-ghost btn-sm shrink-0"
                >
                  حداقل
                </button>
              </div>
            </Field>

            <Field label="سابقه کار (سال)" hint="یک سال و بیشتر ← پایه سنوات">
              <NumberInput
                value={input.seniorityYears}
                onChange={(v) => set("seniorityYears", v)}
                step={1}
                max={50}
              />
            </Field>

            <Field label="تعداد فرزند" hint="با حداقل دو سال سابقه، مشمول حق اولاد">
              <NumberInput value={input.children} onChange={(v) => set("children", v)} step={1} max={12} />
            </Field>
          </div>

          {year.draft && (
            <p className="mt-5 rounded-lg border border-accent/30 bg-accent-soft px-4 py-3 text-xs leading-6 text-ink">
              ارقام سال {fa(year.year)} هنوز با بخشنامه رسمی به‌روز نشده‌اند. برای اصلاح، فایل{" "}
              <code className="num rounded bg-ink/[0.06] px-1">src/lib/payroll/config.ts</code> را ویرایش
              کنید.
            </p>
          )}
          {year.note && !year.draft && (
            <p className="mt-5 text-xs leading-6 text-muted">یادداشت سال {fa(year.year)}: {year.note}</p>
          )}
        </section>

        <section className="card p-6">
          <Head title="کارکرد ماه" note="عدد کارکرد را وارد کنید؛ بقیه محاسبه می‌شود." />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="روز کارکرد" hint={`ماه کامل = ${fa(year.monthDays)} روز`}>
              <NumberInput value={input.workedDays} onChange={(v) => set("workedDays", v)} max={31} />
            </Field>

            <Field label="ساعت اضافه‌کاری" hint={`ضریب ${factor(year.rates.overtime)}`}>
              <NumberInput
                value={input.overtimeHours}
                onChange={(v) => set("overtimeHours", v)}
                max={400}
              />
            </Field>

            <Field label="ساعت شب‌کاری" hint={`فوق‌العاده ${pct(year.rates.night)}٪`}>
              <NumberInput value={input.nightHours} onChange={(v) => set("nightHours", v)} max={400} />
            </Field>

            <Field label="ساعت جمعه‌کاری" hint={`فوق‌العاده ${pct(year.rates.friday)}٪`}>
              <NumberInput value={input.fridayHours} onChange={(v) => set("fridayHours", v)} max={400} />
            </Field>

            <Field label="ساعت تعطیل‌کاری" hint={`ضریب ${factor(year.rates.holiday)}`}>
              <NumberInput
                value={input.holidayHours}
                onChange={(v) => set("holidayHours", v)}
                max={400}
              />
            </Field>

            <Field label="نوبت‌کاری">
              <select
                value={input.shift}
                onChange={(e) => set("shift", e.target.value as PayrollInput["shift"])}
                className={inputCls}
              >
                {shiftOptions.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                    {o.rate(year) > 0 ? ` — ${pct(o.rate(year))}٪` : ""}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <p className="mt-5 text-xs leading-6 text-muted">
            مزد ساعتی این پرسنل: <span className="num">{moneyPlain(result.hourlyWage, unit)}</span>{" "}
            {unitLabel[unit]} — مزد روزانه ÷ {factor(year.dailyHours)} ساعت.
          </p>
        </section>

        <section className="card p-6">
          <Head title="مزایا و کسور دیگر" note="مواردی که هر ماه فرق می‌کنند." />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label={`مزایای دیگر (${unitLabel[unit]})`}
              hint="پاداش، فوق‌العاده شغل، مأموریت — مشمول بیمه و مالیات"
            >
              <MoneyInput
                value={input.otherEarnings}
                unit={unit}
                onChange={(v) => set("otherEarnings", v)}
              />
            </Field>

            <Field label={`کسور دیگر (${unitLabel[unit]})`} hint="مساعده، قسط وام، جریمه">
              <MoneyInput
                value={input.otherDeductions}
                unit={unit}
                onChange={(v) => set("otherDeductions", v)}
              />
            </Field>
          </div>

          <div className="mt-5 space-y-2 border-t border-line pt-5">
            <Check
              checked={input.prorateBenefits}
              onChange={(v) => set("prorateBenefits", v)}
              label="حق مسکن، بن و حق اولاد به نسبت روز کارکرد"
            />
            <Check
              checked={input.includeHousing}
              onChange={(v) => set("includeHousing", v)}
              label="حق مسکن پرداخت شود"
            />
            <Check
              checked={input.includeFood}
              onChange={(v) => set("includeFood", v)}
              label="بن کارگری پرداخت شود"
            />
            <Check
              checked={input.insured}
              onChange={(v) => set("insured", v)}
              label={`کسر بیمه سهم کارگر (${pct(year.insurance.employee)}٪)`}
            />
            <Check checked={input.taxed} onChange={(v) => set("taxed", v)} label="کسر مالیات حقوق" />
          </div>

          <button
            type="button"
            onClick={() => setInput(defaultPayrollInput(input.year))}
            className="btn-quiet btn-sm mt-5"
          >
            بازنشانی فرم
          </button>
        </section>
      </div>

      {/* ---------------------------------------------------------- خروجی */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="inline-flex rounded-lg border border-line bg-surface p-1 text-xs">
              {(["toman", "rial"] as MoneyUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`rounded-md px-3 py-1.5 font-semibold ${
                    unit === u ? "bg-ink text-white" : "text-muted"
                  }`}
                >
                  {unitLabel[u]}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => window.print()} className="btn-ghost btn-sm">
              چاپ فیش
            </button>
          </div>

          <div className="payslip card overflow-hidden">
            <div className="border-b border-line bg-canvas px-6 py-4">
              <p className="text-xs text-muted">فیش حقوقی — سال {fa(year.year)}</p>
              <p className="mt-1 font-bold">{input.name || "بدون نام"}</p>
              <p className="mt-1 text-xs text-muted">
                کارکرد {fa(input.workedDays)} روز از {fa(year.monthDays)} روز
              </p>
            </div>

            <Rows title="مزایا" lines={result.earnings} unit={unit} total={result.grossPay} totalLabel="جمع ناخالص" />

            {result.deductions.length > 0 ? (
              <Rows
                title="کسورات"
                lines={result.deductions}
                unit={unit}
                total={result.totalDeductions}
                totalLabel="جمع کسورات"
                negative
              />
            ) : (
              <div className="border-t border-line px-6 py-4 text-xs text-muted">کسوراتی ثبت نشده است.</div>
            )}

            <div className="border-t border-line bg-ink px-6 py-5 text-white">
              <p className="text-xs text-white/60">خالص پرداختی</p>
              <p className="num mt-1 text-2xl font-extrabold">{moneyPlain(result.netPay, unit)}</p>
              <p className="mt-1 text-xs text-white/60">{unitLabel[unit]}</p>
            </div>

            <dl className="divide-y divide-line text-xs">
              <Meta label="مبنای مشمول بیمه" value={moneyPlain(result.insurableBase, unit)} />
              <Meta label="درآمد مشمول مالیات" value={moneyPlain(result.taxableIncome, unit)} />
              <Meta
                label={`سهم کارفرما (${pct(year.insurance.employer + year.insurance.unemployment)}٪)`}
                value={moneyPlain(result.employerShare, unit)}
              />
              <Meta label="هزینه کل پرسنل" value={moneyPlain(result.totalCost, unit)} />
            </dl>
          </div>

          <div className="card mt-6 p-6">
            <p className="text-sm font-bold">برآورد پایان سال</p>
            <p className="mt-1 text-xs leading-6 text-muted">
              با فرض یک سال کامل کار با همین مزد.
            </p>
            <dl className="mt-4 divide-y divide-line text-xs">
              <Meta label="عیدی و پاداش" value={moneyPlain(result.yearEnd.bonus, unit)} />
              <Meta label="سنوات (هر سال کار)" value={moneyPlain(result.yearEnd.severance, unit)} />
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ اجزا */

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink/40";

function Head({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold">{title}</h2>
      {note && <p className="mt-1 text-xs text-muted">{note}</p>}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

function Check({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted hover:text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[rgb(var(--c-accent))]"
      />
      {label}
    </label>
  );
}

/** ورودی عددی ساده (روز/ساعت/تعداد) که خالی‌کردن فیلد را هم تحمل می‌کند. */
function NumberInput({
  value,
  onChange,
  step = 0.5,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  max?: number;
}) {
  const [text, setText] = useState(String(value));
  const [editing, setEditing] = useState(false);

  return (
    <input
      inputMode="decimal"
      className={`${inputCls} num`}
      value={editing ? text : String(value)}
      onFocus={() => {
        setText(String(value));
        setEditing(true);
      }}
      onBlur={() => setEditing(false)}
      onChange={(e) => {
        setText(e.target.value);
        const n = parseNumber(e.target.value);
        onChange(max ? Math.min(n, max) : n);
      }}
      step={step}
    />
  );
}

/** ورودی مبلغ: نمایش با جداکننده هزارگان، ذخیره به ریال. */
function MoneyInput({
  value,
  unit,
  onChange,
}: {
  value: number;
  unit: MoneyUnit;
  onChange: (rial: number) => void;
}) {
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  return (
    <input
      inputMode="numeric"
      className={`${inputCls} num`}
      value={editing ? text : moneyPlain(value, unit)}
      onFocus={() => {
        setText(moneyPlain(value, unit));
        setEditing(true);
      }}
      onBlur={() => setEditing(false)}
      onChange={(e) => {
        setText(e.target.value);
        onChange(parseMoney(e.target.value, unit));
      }}
    />
  );
}

function Rows({
  title,
  lines,
  unit,
  total,
  totalLabel,
  negative,
}: {
  title: string;
  lines: { key: string; label: string; amount: number; hint?: string }[];
  unit: MoneyUnit;
  total: number;
  totalLabel: string;
  negative?: boolean;
}) {
  return (
    <div className="border-t border-line first:border-t-0">
      <p className="eyebrow px-6 pt-5">{title}</p>
      <ul className="mt-3 divide-y divide-line">
        {lines.map((line) => (
          <li key={line.key} className="flex items-start justify-between gap-4 px-6 py-3">
            <div>
              <p className="text-sm">{line.label}</p>
              {line.hint && <p className="mt-0.5 text-[11px] text-muted">{fa(line.hint)}</p>}
            </div>
            <span className={`num shrink-0 text-sm font-semibold ${negative ? "text-accent" : ""}`}>
              {negative ? "−" : ""}
              {moneyPlain(line.amount, unit)}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-4 bg-canvas px-6 py-3">
        <span className="text-xs font-semibold text-muted">{totalLabel}</span>
        <span className="num text-sm font-bold">
          {negative ? "−" : ""}
          {moneyPlain(total, unit)}
        </span>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-2.5">
      <dt className="text-muted">{label}</dt>
      <dd className="num font-semibold">{value}</dd>
    </div>
  );
}
