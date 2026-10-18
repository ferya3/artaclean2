import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import LoginForm from "@/app/(auth)/admin/login/LoginForm";
import { currentUser, ensureFirstAdmin, hasAnyUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentUser()) redirect("/admin");

  // اگر ADMIN_EMAIL و ADMIN_PASSWORD در محیط باشند و هنوز کاربری نباشد،
  // همین‌جا نخستین حساب ساخته می‌شود.
  await ensureFirstAdmin();
  const ready = await hasAnyUser();

  return (
    <div className="section-deep grain grid min-h-screen place-items-center px-4 py-16">
      <div
        className="glow start-1/2 top-10 h-80 w-80 -translate-x-1/2 opacity-20"
        style={{ background: "var(--color-accent)" }}
      />
      <div className="absolute inset-0 blueprint opacity-70" aria-hidden />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-linear-to-br from-accent to-accent-2 text-sm font-black text-white">
            AC
          </span>
          <h1 className="mt-5 text-2xl font-black text-white">پنل مدیریت آرتا کلین</h1>
          <p className="mt-2 text-sm text-white/45">برای ادامه وارد شوید.</p>
        </div>

        <div className="rounded-xl2 border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl [&_span]:text-white/55">
          {ready ? (
            <LoginForm />
          ) : (
            <div className="space-y-3 text-sm leading-7 text-white/60">
              <p className="font-semibold text-white">هنوز حساب مدیری ساخته نشده است.</p>
              <p>
                دو متغیر محیطی زیر را تنظیم کنید و سرویس را یک بار ری‌استارت کنید؛ نخستین حساب
                در اولین بازدید همین صفحه ساخته می‌شود.
              </p>
              <pre className="num overflow-x-auto rounded-xl bg-deep/70 p-4 text-xs text-white/70" dir="ltr">
{`ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=<یک رمز قوی>`}
              </pre>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-xs text-white/35 transition-colors hover:text-white"
        >
          بازگشت به سایت
        </Link>
      </div>
    </div>
  );
}
