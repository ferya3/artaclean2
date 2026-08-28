import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-deep grain py-32">
      <div
        className="glow start-1/2 top-10 h-80 w-80 -translate-x-1/2 opacity-25"
        style={{ background: "rgb(var(--c-accent))" }}
      />
      <div className="absolute inset-0 blueprint opacity-70" aria-hidden />
      <div className="shell relative text-center">
        <p className="num text-[7rem] font-black leading-none text-white/10">404</p>
        <h1 className="-mt-8 text-section font-black text-white">این صفحه پیدا نشد</h1>
        <p className="mx-auto mt-4 max-w-md leading-8 text-white/50">
          شاید آدرس تغییر کرده باشد. از اینجا ادامه دهید:
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/advisor" className="btn-accent px-6 py-3.5">
            پیدا کردن دستگاه
          </Link>
          <Link href="/products" className="btn-glass px-6 py-3.5">
            تجهیزات
          </Link>
          <Link href="/spare-parts" className="btn-glass px-6 py-3.5">
            قطعات یدکی
          </Link>
        </div>
      </div>
    </section>
  );
}
