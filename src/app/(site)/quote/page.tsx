import type { Metadata } from "next";

import QuoteForm from "@/components/quote/QuoteForm";
import { Breadcrumbs, PageHeader } from "@/components/ui/Primitives";
import { getIndustries, getPage, getProduct } from "@/lib/content";
import { siteSettings } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function generateMetadata(): Metadata {
  const page = getPage("quote");
  return { title: page.metaTitle, description: page.metaDescription };
}

type Search = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function QuotePage({ searchParams }: Search) {
  const sp = await searchParams;
  const productSlug = one(sp.product);
  const part = one(sp.part);
  const product = productSlug ? getProduct(productSlug) : undefined;

  const preset = product ? `${product.name} (${product.model})` : part ? `قطعه ${part}` : undefined;
  const page = getPage("quote");
  const site = siteSettings();
  const industries = getIndustries().map((i) => ({ slug: i.slug, name: i.name }));

  return (
    <>
      <PageHeader eyebrow={page.eyebrow} title={page.title} lead={page.lead} />

      <div className="shell py-6">
        <Breadcrumbs trail={[{ label: "خانه", href: "/" }, { label: "درخواست پیش‌فاکتور" }]} />
      </div>

      <div className="shell grid gap-10 pb-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <QuoteForm presetProduct={preset} industries={industries} />
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
            <a
              href={`tel:${site.phone}`}
              className={cn(buttonVariants({ variant: "primary" }), "num mt-4 w-full")}
              dir="ltr"
            >
              {site.phoneDisplay}
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
