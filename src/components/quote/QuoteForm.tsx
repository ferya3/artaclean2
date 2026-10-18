"use client";

import Link from "next/link";
import { useState } from "react";

import { areaLabels, dirtLabels, surfaceLabels } from "@/lib/data/taxonomy";
import { industries } from "@/lib/data/industries";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * جریان B2B: خرید دستگاه صنعتی با «افزودن به سبد» تمام نمی‌شود.
 * فرم عمداً مرحله‌ای است تا هر گام یک تصمیم بگیرد، و اطلاعات تماس آخر باشد —
 * وقتی کاربر پیش از آن، پنج مرحله زمان گذاشته، نرخ رهاکردن فرم پایین می‌آید.
 *
 * ارسال فعلاً سمت کلاینت شبیه‌سازی می‌شود؛ نقطه اتصال به CRM در handleSubmit است.
 */

const STEPS = ["مشخصات پروژه", "دستگاه و تعداد", "زمان و بودجه", "اطلاعات شرکت"] as const;

interface FormData {
  industry: string;
  surface: string;
  dirt: string;
  area: string;
  siteCity: string;
  interest: string;
  quantity: string;
  needsTraining: boolean;
  needsService: boolean;
  timeline: string;
  budget: string;
  company: string;
  contactName: string;
  phone: string;
  email: string;
  notes: string;
}

const EMPTY: FormData = {
  industry: "",
  surface: "",
  dirt: "",
  area: "",
  siteCity: "",
  interest: "",
  quantity: "1",
  needsTraining: false,
  needsService: false,
  timeline: "",
  budget: "",
  company: "",
  contactName: "",
  phone: "",
  email: "",
  notes: "",
};

const TIMELINES = ["فوری — این ماه", "یک تا سه ماه آینده", "سه تا شش ماه آینده", "در حال بررسی و بودجه‌ریزی"];
const BUDGETS = ["هنوز مشخص نیست", "زیر ۵۰۰ میلیون تومان", "۵۰۰ میلیون تا ۲ میلیارد", "بالای ۲ میلیارد"];

export default function QuoteForm({ presetProduct }: { presetProduct?: string }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>({ ...EMPTY, interest: presetProduct ?? "" });
  const [sent, setSent] = useState(false);

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const canContinue =
    step === 0
      ? Boolean(data.industry && data.area)
      : step === 3
        ? Boolean(data.company && data.contactName && data.phone)
        : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // نقطه اتصال: POST به CRM / صف پیش‌فاکتور.
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card px-6 py-16 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-2xl text-accent">
          ✓
        </div>
        <h2 className="mt-5 text-xl font-bold">درخواست شما ثبت شد</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
          کارشناس فروش تا یک روز کاری با شما تماس می‌گیرد. اگر شرایط سایت را کامل نوشته باشید، در همان
          تماس اول پیشنهاد فنی و برآورد زمان نظافت ارائه می‌شود.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className={buttonVariants({ variant: "outline" })}>
            ادامه مرور تجهیزات
          </Link>
          <Link href="/knowledge" className={buttonVariants({ variant: "primary" })}>
            راهنمای خرید
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card overflow-hidden">
      <ol className="grid grid-cols-4 border-b border-line text-center text-xs">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`border-e border-line px-2 py-3 last:border-e-0 ${
              i === step ? "bg-canvas font-semibold text-ink" : "text-muted"
            }`}
          >
            <span className="num me-1">{fa(i + 1)}.</span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        ))}
      </ol>

      <div className="p-6">
        {step === 0 && (
          <div className="space-y-5">
            <Field label="صنعت / نوع مجموعه" required>
              <select value={data.industry} onChange={(e) => set("industry", e.target.value)} className={inputCls}>
                <option value="">انتخاب کنید</option>
                {industries.map((i) => (
                  <option key={i.slug} value={i.slug}>
                    {i.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="سطح غالب">
                <select value={data.surface} onChange={(e) => set("surface", e.target.value)} className={inputCls}>
                  <option value="">انتخاب کنید</option>
                  {Object.entries(surfaceLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="نوع آلودگی">
                <select value={data.dirt} onChange={(e) => set("dirt", e.target.value)} className={inputCls}>
                  <option value="">انتخاب کنید</option>
                  {Object.entries(dirtLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="متراژ محل استفاده" required>
                <select value={data.area} onChange={(e) => set("area", e.target.value)} className={inputCls}>
                  <option value="">انتخاب کنید</option>
                  {Object.entries(areaLabels).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="شهر محل استفاده">
                <input
                  value={data.siteCity}
                  onChange={(e) => set("siteCity", e.target.value)}
                  className={inputCls}
                  placeholder="مثلاً اصفهان"
                />
              </Field>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <Field label="دستگاه یا دسته مورد نظر">
              <input
                value={data.interest}
                onChange={(e) => set("interest", e.target.value)}
                className={inputCls}
                placeholder="اگر مدل خاصی مدنظر دارید بنویسید؛ در غیر این صورت خالی بگذارید"
              />
            </Field>

            <Field label="تعداد دستگاه">
              <div className="flex flex-wrap gap-2">
                {["1", "2", "3", "4+"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => set("quantity", q)}
                    className={`num rounded-full border px-4 py-2 text-sm ${
                      data.quantity === q ? "border-ink bg-ink text-white" : "border-line text-muted"
                    }`}
                  >
                    {fa(q)}
                  </button>
                ))}
              </div>
            </Field>

            <div className="space-y-2">
              <Check
                checked={data.needsTraining}
                onChange={(v) => set("needsTraining", v)}
                label="آموزش اپراتور در محل لازم دارم"
              />
              <Check
                checked={data.needsService}
                onChange={(v) => set("needsService", v)}
                label="قرارداد سرویس دوره‌ای می‌خواهم"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <Field label="زمان تقریبی خرید">
              <div className="grid gap-2 sm:grid-cols-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("timeline", t)}
                    className={`rounded-lg border px-3 py-2.5 text-start text-sm ${
                      data.timeline === t ? "border-ink bg-canvas" : "border-line text-muted"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="بازه بودجه (اختیاری)">
              <div className="grid gap-2 sm:grid-cols-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set("budget", b)}
                    className={`rounded-lg border px-3 py-2.5 text-start text-sm ${
                      data.budget === b ? "border-ink bg-canvas" : "border-line text-muted"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="نام شرکت" required>
                <input value={data.company} onChange={(e) => set("company", e.target.value)} className={inputCls} />
              </Field>
              <Field label="نام و نام خانوادگی" required>
                <input
                  value={data.contactName}
                  onChange={(e) => set("contactName", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="شماره تماس" required>
                <input
                  value={data.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={`${inputCls} num`}
                  dir="ltr"
                  inputMode="tel"
                />
              </Field>
              <Field label="ایمیل">
                <input
                  value={data.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={`${inputCls} num`}
                  dir="ltr"
                  type="email"
                />
              </Field>
            </div>

            <Field label="توضیحات">
              <textarea
                value={data.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={4}
                className={inputCls}
                placeholder="هر چیزی که به انتخاب دستگاه کمک می‌کند: نوع کف، شیفت کاری، محدودیت‌ها…"
              />
            </Field>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas px-6 py-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={cn(buttonVariants({ variant: "quiet" }), "text-sm")}
        >
          مرحله قبل
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue}
            className={buttonVariants({ variant: "primary" })}
          >
            مرحله بعد
          </button>
        ) : (
          <button type="submit" disabled={!canContinue} className={buttonVariants({ variant: "accent" })}>
            ارسال درخواست پیش‌فاکتور
          </button>
        )}
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ink/40";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
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
