import { Pencil } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { catalogIncludingDrafts } from "@/lib/catalog";
import { getBrand } from "@/lib/data/brands";
import { getCategory } from "@/lib/data/taxonomy";
import { fa, toman } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const products = catalogIncludingDrafts();

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">محصولات</h1>
          <p className="mt-2 text-sm leading-7 text-muted">
            نام، شعار، خلاصه، قیمت، تصویر و وضعیت انتشار از اینجا قابل تغییر است.
            مشخصات فنی عمیق در کاتالوگ کد می‌ماند، چون موتور فیلتر و مشاور هم از
            آن می‌خوانند.
          </p>
        </div>
        <span className="num text-sm text-muted">{fa(products.length)} مدل</span>
      </div>

      <Card className="mt-8 overflow-x-auto p-0">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="px-5 py-3 text-start font-medium">محصول</th>
              <th className="px-5 py-3 text-start font-medium">دسته</th>
              <th className="px-5 py-3 text-start font-medium">برند</th>
              <th className="px-5 py-3 text-start font-medium">قیمت</th>
              <th className="px-5 py-3 text-start font-medium">وضعیت</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => (
              <tr key={p.slug}>
                <td className="px-5 py-3">
                  <span className="block font-medium">{p.name}</span>
                  <span className="num block text-xs text-muted">{p.model}</span>
                </td>
                <td className="px-5 py-3 text-muted">{getCategory(p.category)?.name ?? "—"}</td>
                <td className="px-5 py-3 text-muted">{getBrand(p.brand)?.name ?? p.brand}</td>
                <td className="px-5 py-3">
                  {p.priceMode === "listed" && p.price ? (
                    toman(p.price)
                  ) : (
                    <span className="text-xs text-muted">استعلامی</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <Badge variant={p.published ? "accent" : "outline"}>
                    {p.published ? "منتشرشده" : "پیش‌نویس"}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-end">
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    ویرایش
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
