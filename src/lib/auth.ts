import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";

import { db } from "@/lib/db/client";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEYLEN = 64;
const SESSION_COOKIE = "artaclean_session";
const SESSION_DAYS = 7;

/* ───────────────────────────────────────────────────────── رمز عبور */

/**
 * هش رمز با scrypt.
 * نمک برای هر کاربر جداگانه تولید می‌شود و کنار هش ذخیره می‌شود؛
 * قالب: scrypt$<salt-hex>$<hash-hex>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, KEYLEN);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const derived = await scryptAsync(password, Buffer.from(saltHex, "hex"), KEYLEN);
  const expected = Buffer.from(hashHex, "hex");

  // مقایسه با زمان ثابت: مقایسه معمولی رشته، طول پیشوند مشترک را لو می‌دهد.
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

/* ───────────────────────────────────────────────────────────── نشست */

export interface SessionUser {
  id: number;
  email: string;
  name: string;
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;

  db()
    .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
    .run(token, userId, expiresAt);

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) db().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  jar.delete(SESSION_COOKIE);
}

export async function currentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = db()
    .prepare(
      `SELECT u.id AS id, u.email AS email, u.name AS name, s.expires_at AS expires_at
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token = ?`,
    )
    .get(token) as { id: number; email: string; name: string; expires_at: number } | undefined;

  if (!row) return null;

  if (row.expires_at < Date.now()) {
    db().prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }

  return { id: row.id, email: row.email, name: row.name };
}

/* ─────────────────────────────────────────────── ساخت اولین کاربر */

/**
 * نخستین حساب مدیر.
 *
 * عمداً فقط وقتی ساخته می‌شود که جدول کاربران خالی باشد و هر دو متغیر محیطی
 * ست شده باشند. بدون این شرط، یک رمز پیش‌فرض در کد می‌ماند که روی هر نصبی
 * یکسان است — یعنی عملاً بدون احراز هویت.
 */
export async function ensureFirstAdmin(): Promise<void> {
  const { count } = db().prepare("SELECT COUNT(*) AS count FROM users").get() as {
    count: number;
  };
  if (count > 0) return;

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  db()
    .prepare("INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)")
    .run(email.toLowerCase().trim(), process.env.ADMIN_NAME ?? "مدیر", await hashPassword(password));
}

export async function hasAnyUser(): Promise<boolean> {
  const { count } = db().prepare("SELECT COUNT(*) AS count FROM users").get() as {
    count: number;
  };
  return count > 0;
}

export async function findUserByEmail(email: string) {
  return db()
    .prepare("SELECT id, email, name, password_hash FROM users WHERE email = ?")
    .get(email.toLowerCase().trim()) as
    | { id: number; email: string; name: string; password_hash: string }
    | undefined;
}
