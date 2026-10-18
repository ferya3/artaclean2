"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createSession,
  currentUser,
  destroySession,
  ensureFirstAdmin,
  findUserByEmail,
  verifyPassword,
} from "@/lib/auth";
import { saveOverride, setQuoteStatus } from "@/lib/db/queries";
import { storeImage } from "@/lib/images";

export interface ActionState {
  error?: string;
  ok?: boolean;
  message?: string;
}

/** هر action تغییردهنده، خودش نشست را بررسی می‌کند — نه فقط صفحه‌ای که فرم را نشان داده. */
async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/* ───────────────────────────────────────────────────────── ورود */

export async function loginAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await ensureFirstAdmin();

  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (!email || !password) return { error: "ایمیل و رمز عبور را وارد کنید." };

  const user = await findUserByEmail(email);

  // پیام خطا عمداً برای «کاربر نیست» و «رمز غلط» یکسان است، وگرنه می‌شود
  // فهمید کدام ایمیل‌ها حساب دارند.
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return { error: "ایمیل یا رمز عبور نادرست است." };
  }

  await createSession(user.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

/* ─────────────────────────────────────────────────────── محصول */

export async function saveProductAction(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await requireUser();

  const slug = String(form.get("slug") ?? "").trim();
  if (!slug) return { error: "شناسه محصول نامعتبر است." };

  const priceRaw = String(form.get("price") ?? "").replace(/[^\d]/g, "");
  const priceMode = String(form.get("priceMode") ?? "rfq");

  if (priceMode === "listed" && !priceRaw) {
    return { error: "برای حالت «قیمت مستقیم» باید قیمت وارد شود." };
  }

  let image = String(form.get("currentImage") ?? "") || null;
  const upload = form.get("image");

  if (upload instanceof File && upload.size > 0) {
    try {
      const stored = await storeImage(upload);
      image = `/uploads/${stored.filename}`;
    } catch (error) {
      return { error: error instanceof Error ? error.message : "آپلود تصویر ناموفق بود." };
    }
  }

  const value = (key: string) => {
    const v = String(form.get(key) ?? "").trim();
    return v ? v : null;
  };

  saveOverride({
    slug,
    name: value("name"),
    tagline: value("tagline"),
    summary: value("summary"),
    badges: value("badges"),
    priceMode,
    price: priceRaw ? Number(priceRaw) : null,
    image,
    published: form.get("published") === "on",
  });

  // صفحات عمومی از همین داده می‌خوانند؛ بدون این، تغییر تا رندر بعدی دیده نمی‌شود.
  revalidatePath("/", "layout");

  return { ok: true, message: "تغییرات ذخیره شد." };
}

/* ───────────────────────────────────────────── درخواست پیش‌فاکتور */

export async function updateQuoteStatusAction(form: FormData) {
  await requireUser();

  const id = Number(form.get("id"));
  const status = String(form.get("status") ?? "");

  if (!Number.isInteger(id) || !["new", "contacted", "quoted", "won", "lost"].includes(status)) {
    return;
  }

  setQuoteStatus(id, status);
  revalidatePath("/admin/quotes");
}
