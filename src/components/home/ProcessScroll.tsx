"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ClipboardList, Headset, PackageCheck, Truck, Wrench } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: ClipboardList,
    title: "بررسی سایت",
    body: "متراژ قابل شستشو، نوع کف، آلودگی غالب و پنجره زمانی نظافت اندازه‌گیری می‌شود — نه حدس زده.",
    meta: "۱ تا ۳ روز",
  },
  {
    icon: Headset,
    title: "پیشنهاد فنی",
    body: "فهرست کوتاه دستگاه‌های مناسب، با برآورد زمان نظافت، مصرف آب و هزینه مصرفی سالانه.",
    meta: "قابل مقایسه، نه شعاری",
  },
  {
    icon: Truck,
    title: "دمو در محل",
    body: "دستگاه روی کف خودتان تست می‌شود. ارزان‌ترین راه برای نخریدن دستگاه اشتباه.",
    meta: "یک روز اجاره",
  },
  {
    icon: PackageCheck,
    title: "نصب و آموزش",
    body: "تنظیم فشار برس، ارتفاع تیغه و دبی آب متناسب با کف سایت، و آموزش اپراتور.",
    meta: "همان روز تحویل",
  },
  {
    icon: Wrench,
    title: "سرویس و قطعات",
    body: "سرویس پیشگیرانه هر ۲۵۰ ساعت، تأمین مصرفی و قطعه تا ۱۰ سال پس از فروش.",
    meta: "قرارداد سالانه",
  },
];

/**
 * مسیر خرید، به‌صورت اسکرول افقی pin‌شده.
 *
 * این بخش عمداً افقی است: مسیر خرید صنعتی یک توالی است، و در یک شبکه عمودی
 * خواننده ترتیب را از دست می‌دهد. با pin کردن، اسکرول عمودی کاربر به حرکت
 * روی همان توالی ترجمه می‌شود.
 *
 * چند نکته اجرایی:
 * ـ در RTL باید به سمت راست حرکت کند، نه چپ.
 * ـ زیر ۱۰۲۴ پیکسل اصلاً pin نمی‌شود؛ روی موبایل به اسکرول افقی معمولی
 *   تبدیل می‌شود که با انگشت طبیعی‌تر است.
 * ـ در prefers-reduced-motion هیچ ScrollTrigger ساخته نمی‌شود.
 */
export default function ProcessScroll() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const el = track.current;
        if (!el) return;

        const distance = () => el.scrollWidth - el.clientWidth;
        if (distance() <= 0) return;

        const tween = gsap.to(el, {
          // در RTL محتوا از راست شروع می‌شود، پس جابه‌جایی مثبت است.
          x: () => distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(el, { x: 0 });
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section-deep grain overflow-hidden py-20 lg:h-screen lg:py-0">
      <div
        className="glow -top-20 start-[18%] h-96 w-96 opacity-20"
        style={{ background: "var(--color-accent)" }}
      />
      <div className="absolute inset-0 blueprint opacity-70" aria-hidden />

      <div className="relative flex h-full flex-col justify-center">
        <div className="shell mb-10 lg:mb-14">
          <p className="eyebrow-accent mb-4">
            <span className="h-px w-8 bg-accent" aria-hidden />
            مسیر کار
          </p>
          <h2 className="max-w-2xl text-section font-black text-white text-balance">
            از بازدید سایت تا قرارداد سرویس
          </h2>
          <p className="mt-4 max-w-xl leading-8 text-white/55">
            خرید دستگاه صنعتی یک معامله نیست، یک مسیر است. این پنج مرحله همان
            چیزی است که برای هر پروژه اجرا می‌شود.
          </p>
        </div>

        <div className="overflow-x-auto pb-4 lg:overflow-visible lg:pb-0">
          <div
            ref={track}
            className="flex w-max gap-5 px-4 sm:px-6 lg:px-8"
          >
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="card-deep flex w-[19rem] shrink-0 flex-col p-7 lg:w-[22rem]"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-accent/12 text-accent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="num text-3xl font-black text-white/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-white/50">{step.body}</p>

                  <p className="mt-6 border-t border-white/10 pt-5 text-xs text-accent">
                    {step.meta}
                  </p>
                </article>
              );
            })}

            <article className="card-deep flex w-[19rem] shrink-0 flex-col justify-center p-7 lg:w-[22rem]">
              <h3 className="text-xl font-bold text-white">مسیر را از اینجا شروع کنید</h3>
              <p className="mt-3 text-sm leading-7 text-white/50">
                شرایط سایت را بگویید تا بازدید و پیشنهاد فنی را برنامه‌ریزی کنیم.
              </p>
              <Link
                href="/quote"
                className={cn(buttonVariants({ variant: "accent", block: true }), "mt-6")}
              >
                درخواست بازدید
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
