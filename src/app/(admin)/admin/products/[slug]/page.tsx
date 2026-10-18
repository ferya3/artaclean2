import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductForm from "@/app/(admin)/admin/products/[slug]/ProductForm";
import { buttonVariants } from "@/components/ui/button";
import { products } from "@/lib/data/products";
import { getOverride } from "@/lib/db/queries";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

export default async function AdminProductPage({ params }: Params) {
  const { slug } = await params;

  // عمداً از کاتالوگ خام خوانده می‌شود، نه catalog(): محصول پیش‌نویس هم باید
  // در پنل قابل ویرایش باشد.
  const base = products.find((p) => p.slug === slug);
  if (!base) notFound();

  const override = getOverride(slug);

  const merged = {
    ...base,
    name: override?.name ?? base.name,
    tagline: override?.tagline ?? base.tagline,
    summary: override?.summary ?? base.summary,
    badges: override?.badges
      ? override.badges.split("،").map((b) => b.trim()).filter(Boolean)
      : base.badges,
    priceMode: (override?.price_mode as typeof base.priceMode) ?? base.priceMode,
    price: override?.price ?? base.price,
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowRight className="size-4" aria-hidden />
            همه محصولات
          </Link>
          <h1 className="text-2xl font-black">{merged.name}</h1>
          <p className="num mt-1 text-sm text-muted">{base.model}</p>
        </div>

        <Link
          href={`/products/${base.category}/${base.slug}`}
          target="_blank"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <ExternalLink className="size-3.5" aria-hidden />
          مشاهده در سایت
        </Link>
      </div>

      <ProductForm
        product={merged}
        published={(override?.published ?? 1) === 1}
        image={override?.image ?? null}
      />
    </>
  );
}
