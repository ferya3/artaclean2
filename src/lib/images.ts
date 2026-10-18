import "server-only";

import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { insertMedia } from "@/lib/db/queries";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export interface StoredImage {
  filename: string;
  width: number;
  height: number;
  bytes: number;
}

/**
 * ذخیره تصویر آپلودی.
 *
 * هر چه آپلود می‌شود به WebP تبدیل می‌شود، نه ذخیره خام. عکس محصول که از
 * کاتالوگ سازنده می‌آید معمولاً PNG چند مگابایتی است؛ روی صفحه‌ای که ۲۴ کارت
 * محصول دارد این تفاوت بین ۳۰ مگابایت و ۱.۵ مگابایت است.
 *
 * نام فایل از محتوا ساخته می‌شود (هش)، نه از نام اصلی: نام کاربر می‌تواند
 * «../../etc/passwd» یا یک نام تکراری باشد.
 */
export async function storeImage(file: File): Promise<StoredImage> {
  if (!ALLOWED.has(file.type)) {
    throw new Error("فرمت تصویر پشتیبانی نمی‌شود (JPEG، PNG، WebP یا AVIF).");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("حجم تصویر بیش از ۸ مگابایت است.");
  }

  const input = Buffer.from(await file.arrayBuffer());

  const output = await sharp(input)
    .rotate() // اعمال جهت EXIF، وگرنه عکس موبایل چرخیده ذخیره می‌شود
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const hash = crypto.createHash("sha256").update(output.data).digest("hex").slice(0, 16);
  const filename = `${hash}.webp`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), output.data);

  const stored: StoredImage = {
    filename,
    width: output.info.width,
    height: output.info.height,
    bytes: output.info.size,
  };

  insertMedia(stored);
  return stored;
}
