import { Card } from "@/components/ui/card";
import { listMedia } from "@/lib/db/queries";
import { fa } from "@/lib/format";

export default function MediaPage() {
  const files = listMedia(120);

  const kb = (bytes: number) =>
    bytes >= 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${Math.round(bytes / 1024)} KB`;

  return (
    <>
      <h1 className="text-2xl font-black">رسانه</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
        هر تصویری که از فرم‌های پنل آپلود شود اینجا فهرست می‌شود. نام فایل از هش محتوا ساخته
        می‌شود، پس آپلود دوباره یک تصویر، نسخه تکراری نمی‌سازد.
      </p>

      {files.length === 0 ? (
        <Card className="mt-8 px-6 py-16 text-center">
          <p className="font-semibold">هنوز تصویری آپلود نشده است</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
            از بخش «تصویر» در فرم هر محصول، تصویر آپلود کنید.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden p-0">
              {/* ابعاد از پیش معلوم نیست و این صفحه از سایت عمومی جدا است. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/uploads/${file.filename}`}
                alt=""
                className="aspect-4/3 w-full bg-canvas object-cover"
              />
              <div className="p-3">
                <p className="num truncate text-[11px] text-muted" dir="ltr">
                  {file.filename}
                </p>
                <p className="num mt-1 text-[11px] text-muted/70" dir="ltr">
                  {file.width}×{file.height} · {kb(file.bytes)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted">
        <span className="num">{fa(files.length)}</span> فایل
      </p>
    </>
  );
}
