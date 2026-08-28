import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-24 text-center">
      <p className="num text-6xl font-bold tracking-tight text-line">404</p>
      <h1 className="mt-6 text-2xl font-bold">این صفحه پیدا نشد</h1>
      <p className="mx-auto mt-3 max-w-md text-muted">
        شاید آدرس تغییر کرده باشد. از اینجا ادامه دهید:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn-primary">
          تجهیزات
        </Link>
        <Link href="/advisor" className="btn-accent">
          پیدا کردن دستگاه
        </Link>
        <Link href="/spare-parts" className="btn-ghost">
          قطعات یدکی
        </Link>
      </div>
    </div>
  );
}
