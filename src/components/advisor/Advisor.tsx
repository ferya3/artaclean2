"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import ProductCard from "@/components/product/ProductCard";
import { adviseAction, type AdviceResponse } from "@/lib/actions/advisor";
import type { AdvisorAnswers } from "@/lib/advisor";
import { areaLabels, dirtLabels, frequencyLabels, surfaceLabels } from "@/lib/data/taxonomy";
import { fa } from "@/lib/format";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StepKey = keyof AdvisorAnswers;

const STEPS: { key: StepKey; question: string; hint: string; options: Record<string, string> }[] = [
  {
    key: "surface",
    question: "چه چیزی را تمیز می‌کنید؟",
    hint: "سطح غالب را انتخاب کنید؛ اگر چند سطح دارید، آن که بیشترین متراژ را دارد.",
    options: surfaceLabels as Record<string, string>,
  },
  {
    key: "dirt",
    question: "نوع آلودگی چیست؟",
    hint: "آلودگی اصلی، نه هر چیزی که ممکن است پیش بیاید. این پاسخ نوع برس و مواد شوینده را تعیین می‌کند.",
    options: dirtLabels as Record<string, string>,
  },
  {
    key: "area",
    question: "چه متراژی باید تمیز شود؟",
    hint: "متراژ قابل شستشو در هر نوبت — نه کل مساحت سند.",
    options: areaLabels as Record<string, string>,
  },
  {
    key: "frequency",
    question: "هر چند وقت یک‌بار؟",
    hint: "تناوب استفاده، انتخاب بین باتری و کابل و کلاس دستگاه را تعیین می‌کند.",
    options: frequencyLabels as Record<string, string>,
  },
];

/**
 * امتیازدهی سمت سرور انجام می‌شود و فقط همان چند نتیجه برمی‌گردد —
 * کاتالوگ به کلاینت نمی‌آید. نتیجه نخستین رندر از صفحه سرور می‌رسد تا
 * لینکِ از پیش پاسخ‌دار (مثلاً از جست‌وجو) بی‌درنگ نتیجه نشان دهد.
 */
export default function Advisor({
  initial = {},
  initialAdvice,
}: {
  initial?: AdvisorAnswers;
  initialAdvice: AdviceResponse;
}) {
  const [answers, setAnswers] = useState<AdvisorAnswers>(initial);
  const [advice, setAdvice] = useState<AdviceResponse>(initialAdvice);
  const [pending, startTransition] = useTransition();

  // اولین پرسش بی‌پاسخ، مرحله جاری است — کاربر می‌تواند هر مرحله را هم عوض کند.
  const currentStep = STEPS.findIndex((s) => !answers[s.key]);
  const complete = currentStep === -1;
  const answeredCount = STEPS.filter((s) => answers[s.key]).length;

  // نخستین اجرا نتیجه‌اش را از سرور گرفته؛ دوباره نپرس.
  const [primed, setPrimed] = useState(true);

  useEffect(() => {
    if (primed) {
      setPrimed(false);
      return;
    }
    let active = true;
    startTransition(async () => {
      try {
        const next = await adviseAction(answers);
        if (active) setAdvice(next);
      } catch {
        // شکست شبکه نباید فهرست قبلی را پاک کند.
      }
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const { results, complements } = advice;

  const set = (key: StepKey, value: string) =>
    setAnswers(
      (prev) => ({ ...prev, [key]: prev[key] === value ? undefined : value }) as AdvisorAnswers,
    );

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${(answeredCount / STEPS.length) * 100}%` }}
              />
            </div>
            <span className="num text-xs text-muted">
              {fa(answeredCount)}/{fa(STEPS.length)}
            </span>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, i) => {
              const value = answers[step.key];
              const isOpen = i === currentStep || Boolean(value);
              return (
                <fieldset
                  key={step.key}
                  className={`card p-5 transition-opacity ${isOpen ? "" : "opacity-45"}`}
                >
                  <legend className="sr-only">{step.question}</legend>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{step.question}</p>
                      <p className="mt-1 text-xs leading-6 text-muted">{step.hint}</p>
                    </div>
                    {value && (
                      <button
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [step.key]: undefined }) as AdvisorAnswers)
                        }
                        className="shrink-0 text-xs text-muted hover:text-ink"
                      >
                        تغییر
                      </button>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(step.options).map(([key, label]) => {
                      const selected = value === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => set(step.key, key)}
                          aria-pressed={selected}
                          className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                            selected
                              ? "border-ink bg-ink text-white"
                              : "border-line bg-surface text-muted hover:border-ink/30 hover:text-ink"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          {answeredCount > 0 && (
            <button
              type="button"
              onClick={() => setAnswers({})}
              className={cn(buttonVariants({ variant: "quiet" }), "mt-4 w-full text-xs")}
            >
              شروع دوباره
            </button>
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
        {answeredCount === 0 ? (
          <div className="card flex h-full min-h-64 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-lg font-semibold">با اولین پاسخ، پیشنهادها اینجا ظاهر می‌شوند</p>
            <p className="mt-2 max-w-sm text-sm leading-7 text-muted">
              لازم نیست همه پرسش‌ها را پاسخ دهید؛ هرچه بیشتر بگویید، فهرست دقیق‌تر می‌شود.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="card px-6 py-16 text-center">
            <p className="text-lg font-semibold">با این ترکیب، دستگاه استانداردی پیدا نشد</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
              این معمولاً یعنی شرایط سایت شما راهکار ترکیبی می‌خواهد. شرایط را برای کارشناس بفرستید تا
              پیکربندی مناسب پیشنهاد شود.
            </p>
            <Link href="/quote" className={cn(buttonVariants({ variant: "accent" }), "mt-6")}>
              ارسال شرایط برای کارشناس
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-lg font-semibold">
                {complete ? "دستگاه‌های پیشنهادی" : "پیشنهادهای اولیه"}
                <span className="ms-2 text-sm font-normal text-muted">({fa(results.length)} مورد)</span>
              </h2>
              <p className="text-xs text-muted">
                {pending ? "در حال محاسبه…" : !complete ? "با پاسخ به پرسش‌های بعدی دقیق‌تر می‌شود" : ""}
              </p>
            </div>

            <div className="space-y-4">
              {results.map((result, i) => (
                <div key={result.product.slug} className="card overflow-hidden animate-fade-up">
                  <div className="flex items-center justify-between gap-3 border-b border-line bg-canvas px-4 py-2.5">
                    <span className="text-xs font-semibold">
                      {i === 0 && complete ? "بهترین تطابق" : `گزینه ${fa(i + 1)}`}
                    </span>
                    <span className="text-xs text-muted">{fa(result.match)}٪ تطابق</span>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div>
                      <ProductCard product={result.product} compact />
                    </div>
                    <div className="sm:w-56">
                      {result.reasons.length > 0 && (
                        <>
                          <p className="eyebrow mb-2">چرا این دستگاه</p>
                          <ul className="space-y-1.5 text-xs leading-6 text-muted">
                            {result.reasons.map((r) => (
                              <li key={r} className="flex gap-2">
                                <span className="text-accent">✓</span>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      {result.caveats.length > 0 && (
                        <>
                          <p className="eyebrow mb-2 mt-4">در نظر بگیرید</p>
                          <ul className="space-y-1.5 text-xs leading-6 text-muted">
                            {result.caveats.map((c) => (
                              <li key={c} className="flex gap-2">
                                <span className="text-muted">!</span>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {complements.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-1 text-base font-semibold">مواد و لوازم مکمل</h3>
                <p className="mb-4 text-sm text-muted">
                  انتخاب شوینده نامناسب، بازدهی دستگاه درست را هم پایین می‌آورد.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {complements.map((c) => (
                    <ProductCard key={c.product.slug} product={c.product} compact />
                  ))}
                </div>
              </div>
            )}

            <div className="card mt-6 flex flex-wrap items-center justify-between gap-4 bg-primary p-6 text-white">
              <div>
                <p className="font-semibold">مطمئن نیستید کدام؟</p>
                <p className="mt-1 text-sm text-white/70">
                  شرایط سایت را بفرستید؛ کارشناس با دیتاشیت و برآورد زمان نظافت پاسخ می‌دهد.
                </p>
              </div>
              <Link href="/quote" className={cn(buttonVariants(), "bg-white text-ink hover:bg-white/90")}>
                درخواست مشاوره
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
