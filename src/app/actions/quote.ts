"use server";

import { insertQuote } from "@/lib/db/queries";

export interface QuoteResult {
  ok: boolean;
  error?: string;
}

const str = (form: FormData, key: string): string =>
  String(form.get(key) ?? "").trim().slice(0, 2000);

/**
 * ثبت درخواست پیش‌فاکتور.
 *
 * اعتبارسنجی دوباره روی سرور انجام می‌شود، حتی با اینکه فرم کلاینت هم چک
 * می‌کند: Server Action یک endpoint عمومی است و هرکسی می‌تواند مستقیم
 * صدایش بزند.
 */
export async function submitQuote(form: FormData): Promise<QuoteResult> {
  const company = str(form, "company");
  const contactName = str(form, "contactName");
  const phone = str(form, "phone");

  if (!company || !contactName || !phone) {
    return { ok: false, error: "نام شرکت، نام تماس و شماره تلفن الزامی است." };
  }

  // شماره ایران با ارقام فارسی هم وارد می‌شود؛ برای ذخیره یکدست می‌شود.
  const normalizedPhone = phone.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
  if (normalizedPhone.replace(/\D/g, "").length < 8) {
    return { ok: false, error: "شماره تماس معتبر نیست." };
  }

  const email = str(form, "email");
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, error: "ایمیل معتبر نیست." };
  }

  try {
    insertQuote({
      company,
      contact_name: contactName,
      phone: normalizedPhone,
      email: email || null,
      industry: str(form, "industry") || null,
      surface: str(form, "surface") || null,
      dirt: str(form, "dirt") || null,
      area: str(form, "area") || null,
      site_city: str(form, "siteCity") || null,
      interest: str(form, "interest") || null,
      quantity: str(form, "quantity") || null,
      needs_training: form.get("needsTraining") ? 1 : 0,
      needs_service: form.get("needsService") ? 1 : 0,
      timeline: str(form, "timeline") || null,
      budget: str(form, "budget") || null,
      notes: str(form, "notes") || null,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "ثبت درخواست ممکن نشد. لطفاً تلفنی تماس بگیرید." };
  }
}
