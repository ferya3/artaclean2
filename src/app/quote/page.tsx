import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getProduct } from "@/lib/data/products";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درخواست پیش‌فاکتور و مشاوره",
  description:
    "شرایط سایت، تعداد دستگاه و زمان خرید را وارد کنید تا کارشناس فروش با پیشنهاد فنی و پیش‌فاکتور تماس بگیرد.",
};

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function QuotePage({ searchParams }: Search) {
  const sp = await searchParams;
  const productSlug = one(sp.product);
  const part = one(sp.part);
  const product = productSlug ? getProduct(productSlug) : undefined;

  const preset = product ? `${product.name} (${product.model})` : part ? `قطعه ${part}` : undefined;

  return (
    <>
      <PageHeader
        eyebrow="درخواست پیش‌فاکتور"
        title="بگویید سایت شما چه شکلی است"
        lead="برای دستگاه چند صد میلیونی، «افزودن به سبد» پاسخ نمی‌دهد. چند پرسش کوتاه، تا پیشنهاد فنی درست و قیمت واقعی به شما برسد."
      />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "درخواست پیش‌فاکتور" }]} />
      </div>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <QuoteForm presetProduct={preset} />
        </div>

        <aside className="lg:col-span-4">
          <div className="card p-6">
            <p className="eyebrow mb-3">مسیر درخواست</p>
            <ol className="space-y-3 text-sm text-muted">
              {[
                "ثبت شرایط سایت و نیاز",
                "بررسی توسط کارشناس فنی",
                "پیشنهاد فنی + برآورد زمان نظافت",
                "پیش‌فاکتور با شرایط پرداخت",
                "بازدید یا دمو در محل (در صورت نیاز)",
              ].map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="num grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-ink">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>

          <div className="card mt-5 bg-canvas p-6">
            <p className="font-semibold">ترجیح می‌دهید تلفنی صحبت کنید؟</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              برای خرید صنعتی، یک تماس ده‌دقیقه‌ای معمولاً از پر کردن ده فرم مفیدتر است.
            </p>
            <a href="tel:+982100000000" className={cn(buttonVariants({ variant: "primary" }), "num mt-4 w-full")} dir="ltr">
              021-0000 0000
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
