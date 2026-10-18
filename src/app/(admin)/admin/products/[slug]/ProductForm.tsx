"use client";

import { Save } from "lucide-react";
import { useActionState, useState } from "react";

import { saveProductAction, type ActionState } from "@/app/(admin)/admin/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/field";
import type { Product } from "@/lib/types";

export default function ProductForm({
  product,
  published,
  image,
}: {
  product: Product;
  published: boolean;
  image: string | null;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveProductAction,
    {},
  );
  const [priceMode, setPriceMode] = useState(product.priceMode);
  const [preview, setPreview] = useState<string | null>(image);

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-12">
      <input type="hidden" name="slug" value={product.slug} />
      <input type="hidden" name="currentImage" value={image ?? ""} />

      <div className="space-y-6 lg:col-span-8">
        <Card className="space-y-5 p-6">
          <h2 className="font-bold">متن‌های نمایشی</h2>

          <Field label="نام محصول">
            <Input name="name" defaultValue={product.name} />
          </Field>

          <Field label="شعار (یک خط زیر نام)">
            <Input name="tagline" defaultValue={product.tagline} />
          </Field>

          <Field label="خلاصه (پاراگراف صفحه محصول)">
            <Textarea name="summary" rows={5} defaultValue={product.summary} />
          </Field>

          <Field
            label="برچسب‌ها"
            hint="با ویرگول فارسی «،» جدا کنید. مثال: پرفروش، جدید"
          >
            <Input name="badges" defaultValue={product.badges?.join("، ") ?? ""} />
          </Field>
        </Card>

        <Card className="space-y-5 p-6">
          <h2 className="font-bold">قیمت</h2>

          <Field label="نحوه نمایش قیمت">
            <Select
              name="priceMode"
              filled
              value={priceMode}
              onChange={(e) => setPriceMode(e.target.value as Product["priceMode"])}
            >
              <option value="rfq">استعلامی — دکمه «درخواست پیش‌فاکتور»</option>
              <option value="listed">قیمت مستقیم — دکمه «ثبت سفارش»</option>
            </Select>
          </Field>

          {priceMode === "listed" && (
            <Field label="قیمت (تومان)" required>
              <Input
                name="price"
                inputMode="numeric"
                dir="ltr"
                className="num"
                defaultValue={product.price ?? ""}
              />
            </Field>
          )}
        </Card>
      </div>

      <div className="space-y-6 lg:col-span-4">
        <Card className="space-y-5 p-6">
          <h2 className="font-bold">انتشار</h2>
          <Checkbox
            name="published"
            defaultChecked={published}
            label="در سایت نمایش داده شود"
          />
          <p className="text-xs leading-6 text-muted">
            محصول پیش‌نویس از فهرست‌ها، جستجو و مشاور حذف می‌شود و صفحه‌اش ۴۰۴
            می‌دهد.
          </p>
        </Card>

        <Card className="space-y-4 p-6">
          <h2 className="font-bold">تصویر</h2>

          <div className="overflow-hidden rounded-xl border border-line bg-canvas">
            {preview ? (
              // تصویر آپلودی ابعاد از پیش معلومی ندارد؛ next/image اینجا سود
              // چندانی ندارد و فقط پیکربندی اضافه می‌خواهد.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="پیش‌نمایش" className="aspect-4/3 w-full object-cover" />
            ) : (
              <div className="grid aspect-4/3 place-items-center text-xs text-muted">
                بدون تصویر — تصویر برداری دستگاه نمایش داده می‌شود
              </div>
            )}
          </div>

          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setPreview(file ? URL.createObjectURL(file) : image);
            }}
            className="w-full text-xs text-muted file:me-3 file:rounded-lg file:border-0 file:bg-ink file:px-3 file:py-2 file:text-xs file:text-white"
          />
          <p className="text-[11px] leading-5 text-muted">
            هر تصویری که آپلود شود به WebP تبدیل و تا ۱۶۰۰ پیکسل کوچک می‌شود.
          </p>
        </Card>

        <div className="sticky bottom-4 space-y-3">
          {state.error && (
            <p
              role="alert"
              className="rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm text-accent-2"
            >
              {state.error}
            </p>
          )}
          {state.ok && (
            <p className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
              {state.message}
            </p>
          )}

          <Button type="submit" variant="accent" block disabled={pending}>
            <Save className="size-4" aria-hidden />
            {pending ? "در حال ذخیره…" : "ذخیره تغییرات"}
          </Button>
        </div>
      </div>
    </form>
  );
}
