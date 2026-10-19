"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createSession,
  createUser,
  currentUser,
  destroySession,
  ensureFirstAdmin,
  findUserByEmail,
  verifyPassword,
} from "@/lib/auth";
import { getSchema } from "@/lib/admin/schemas";
import { getSettingsSchema } from "@/lib/admin/settings-schemas";
import {
  deleteRow,
  getRow,
  moveRow,
  renameRow,
  setPublished,
  upsertRow,
  writeSetting,
} from "@/lib/db/content";
import { setQuoteStatus } from "@/lib/db/queries";
import { storeImage } from "@/lib/images";

export interface ActionState {
  error?: string;
  ok?: boolean;
  message?: string;
  /** پس از ساخت رکورد تازه، پنل به صفحه ویرایش همان رکورد می‌رود. */
  slug?: string;
}

/** هر action تغییردهنده، خودش نشست را بررسی می‌کند — نه فقط صفحه‌ای که فرم را نشان داده. */
async function requireUser() {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  return user;
}

/**
 * بعد از هر تغییر محتوا، همه صفحات عمومی باید بازسازی شوند.
 *
 * دقیق‌تر کردنش ممکن است (مثلاً فقط مسیر همان محصول)، ولی عملاً بی‌فایده:
 * یک محصول در صفحه اصلی، فهرست دسته، صفحه برند، صفحه صنعت، مقایسه و
 * sitemap هم دیده می‌شود. هزینه بازسازی کل سایت در این مقیاس ناچیز است و
 * حالتِ «جایی قدیمی مانده» بدترین نتیجه ممکن برای ویرایشگر محتواست.
 */
function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ───────────────────────────────────────────────────────── ورود */

export async function loginAction(_prev: ActionState, form: FormData): Promise<ActionState> {
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

/* ─────────────────────────────────────────────────────── کاربران */

export async function createUserAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (!email || !name || !password) return { error: "همه فیلدها لازم است." };
  if (password.length < 10) return { error: "رمز عبور باید حداقل ۱۰ نویسه باشد." };
  if (await findUserByEmail(email)) return { error: "این ایمیل قبلاً ثبت شده است." };

  await createUser({ email, name, password });
  revalidatePath("/admin/users");
  return { ok: true, message: `حساب ${name} ساخته شد.` };
}

/* ─────────────────────────────────────────────────────── محتوا */

const SLUG_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}._-]*$/u;

function cleanSlug(raw: string): string {
  return raw.trim().replace(/\s+/g, "-");
}

/**
 * ذخیره یک رکورد محتوا.
 *
 * بدنه به‌صورت یک JSON می‌آید (فیلد `payload`) چون شکلش تودرتو و متغیر است.
 * اعتبارسنجی نوعِ عمیق اینجا انجام نمی‌شود و لازم هم نیست: هر خواننده‌ای در
 * `src/lib/content.ts` رکورد را از normalize رد می‌کند، پس حتی بدنه دست‌کاری‌شده
 * هم نمی‌تواند صفحه‌ای را بیندازد. چیزی که اینجا کنترل می‌شود، همان چیزهایی
 * است که normalize نمی‌تواند جبرانشان کند: مجموعه معتبر، شناسه معتبر، و
 * جلوگیری از بازنویسی ناخواسته رکورد دیگر.
 */
export async function saveContentAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const collection = String(form.get("collection") ?? "");
  const schema = getSchema(collection);
  if (!schema) return { error: "مجموعه نامعتبر است." };

  const slug = cleanSlug(String(form.get("slug") ?? ""));
  const original = String(form.get("original") ?? "");

  if (!slug) return { error: `${schema.slugLabel} را وارد کنید.` };
  if (!SLUG_PATTERN.test(slug)) {
    return { error: "شناسه فقط می‌تواند حرف، رقم، نقطه، زیرخط و خط تیره داشته باشد." };
  }

  let data: unknown;
  try {
    data = JSON.parse(String(form.get("payload") ?? "{}"));
  } catch {
    return { error: "داده فرم خوانده نشد. صفحه را دوباره بار کنید." };
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { error: "داده فرم نامعتبر است." };
  }

  const isNew = !original;
  const renaming = !isNew && original !== slug;

  if ((isNew || renaming) && getRow(collection, slug)) {
    return { error: `رکورد دیگری با شناسه «${slug}» وجود دارد.` };
  }

  const published = schema.publishable ? form.get("published") === "on" : true;

  if (renaming) {
    // ابتدا تغییر نام، تا جایگاه رکورد در ترتیب حفظ شود و بعد بدنه بنشیند.
    renameRow(collection, original, slug);
  }

  const record = data as Record<string, unknown>;

  // شناسه در بدنه هم تکرار می‌شود چون بعضی خواننده‌ها (قطعه با شماره فنی)
  // آن را از بدنه می‌خوانند؛ هم‌خوان نگه داشتنش از اینجا ارزان‌تر است.
  if (collection === "parts") record.partNo = slug;

  const existing = getRow(collection, slug);
  upsertRow({
    collection,
    slug,
    data: record,
    published,
    position: existing?.position,
  });

  revalidateSite();

  if (isNew || renaming) return { ok: true, message: "ذخیره شد.", slug };
  return { ok: true, message: "تغییرات ذخیره شد." };
}

export async function deleteContentAction(form: FormData) {
  await requireUser();

  const collection = String(form.get("collection") ?? "");
  const slug = String(form.get("slug") ?? "");
  if (!getSchema(collection) || !slug) return;

  deleteRow(collection, slug);
  revalidateSite();
  redirect(`/admin/c/${collection}`);
}

/** کپی یک رکورد — ساده‌ترین راه ساختن مدل بعدی یک خانواده محصول. */
export async function duplicateContentAction(form: FormData) {
  await requireUser();

  const collection = String(form.get("collection") ?? "");
  const slug = String(form.get("slug") ?? "");
  const schema = getSchema(collection);
  if (!schema) return;

  const row = getRow(collection, slug);
  if (!row) return;

  let candidate = `${slug}-copy`;
  let counter = 2;
  while (getRow(collection, candidate)) candidate = `${slug}-copy-${counter++}`;

  const data = { ...(row.data as Record<string, unknown>) };
  if (collection === "parts") data.partNo = candidate;

  // کپی به‌صورت پیش‌نویس ساخته می‌شود: نسخه دوم یک محصول تا کامل نشده
  // نباید در فهرست عمومی دیده شود.
  upsertRow({ collection, slug: candidate, data, published: false });
  revalidateSite();
  redirect(`/admin/c/${collection}/${encodeURIComponent(candidate)}`);
}

export async function togglePublishedAction(form: FormData) {
  await requireUser();

  const collection = String(form.get("collection") ?? "");
  const slug = String(form.get("slug") ?? "");
  const schema = getSchema(collection);
  if (!schema?.publishable || !slug) return;

  const row = getRow(collection, slug);
  if (!row) return;

  setPublished(collection, slug, !row.published);
  revalidateSite();
  revalidatePath(`/admin/c/${collection}`);
}

export async function moveContentAction(form: FormData) {
  await requireUser();

  const collection = String(form.get("collection") ?? "");
  const slug = String(form.get("slug") ?? "");
  const direction = Number(form.get("direction"));
  if (!getSchema(collection) || !slug || (direction !== -1 && direction !== 1)) return;

  moveRow(collection, slug, direction);
  revalidateSite();
  revalidatePath(`/admin/c/${collection}`);
}

/* ────────────────────────────────────────────────────── تنظیمات */

export async function saveSettingsAction(_prev: ActionState, form: FormData): Promise<ActionState> {
  await requireUser();

  const key = String(form.get("settings") ?? "");
  if (!getSettingsSchema(key)) return { error: "بخش تنظیمات نامعتبر است." };

  let data: unknown;
  try {
    data = JSON.parse(String(form.get("payload") ?? "{}"));
  } catch {
    return { error: "داده فرم خوانده نشد. صفحه را دوباره بار کنید." };
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { error: "داده فرم نامعتبر است." };
  }

  // کلیدهای ناشناس و مقادیر بدنوع هنگام خواندن کنار گذاشته می‌شوند
  // (`merge` در src/lib/site.ts)، پس ذخیره کل سند بی‌خطر است.
  writeSetting(key, data);
  revalidateSite();

  return { ok: true, message: "تنظیمات ذخیره شد." };
}

/* ───────────────────────────────────────────────────────── رسانه */

export async function uploadImageAction(
  form: FormData,
): Promise<{ url?: string; error?: string }> {
  await requireUser();

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "فایلی انتخاب نشده است." };

  try {
    const stored = await storeImage(file);
    revalidatePath("/admin/media");
    return { url: `/uploads/${stored.filename}` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "آپلود ناموفق بود." };
  }
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
