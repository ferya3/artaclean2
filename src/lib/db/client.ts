import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

/**
 * اتصال SQLite.
 *
 * از node:sqlite خود Node استفاده می‌شود — بدون وابستگی بومی، بدون مرحله
 * کامپایل هنگام نصب، و بدون چیزی که روی ارتقای Node بشکند.
 *
 * فایل دیتابیس عمداً بیرون از پوشه پروژه قابل تنظیم است (DATABASE_PATH):
 * اگر داخل .next یا public بماند، یک build یا deploy آن را پاک می‌کند.
 */

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "artaclean.db");

let instance: DatabaseSync | null = null;

export function db(): DatabaseSync {
  if (instance) return instance;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  const connection = new DatabaseSync(DB_PATH);

  // busy_timeout باید اولین دستور باشد، نه بعد از بقیه pragmaها:
  // خودِ «PRAGMA journal_mode = WAL» یک نوشتن است و قفل می‌خواهد. اگر
  // timeout هنوز ست نشده باشد، در لحظه رقابت بلافاصله SQLITE_BUSY می‌دهد.
  connection.exec("PRAGMA busy_timeout = 10000");

  // WAL: خواندن و نوشتن هم‌زمان را ممکن می‌کند. بدون آن، یک نوشتن طولانی
  // کل درخواست‌های خواندن را بلاک می‌کند.
  connection.exec("PRAGMA journal_mode = WAL");
  connection.exec("PRAGMA foreign_keys = ON");

  migrate(connection);

  instance = connection;
  return connection;
}

/** آخرین جدولی که migrate می‌سازد — وجودش یعنی schema کامل است. */
const SENTINEL_TABLE = "media";

function schemaIsCurrent(connection: DatabaseSync): boolean {
  const row = connection
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(SENTINEL_TABLE);
  return Boolean(row);
}

/**
 * مهاجرت‌ها.
 *
 * اول با یک «خواندن» بررسی می‌شود که آیا اصلاً نیازی هست.
 *
 * دلیلش: Next صفحات را هنگام build در چند worker موازی prerender می‌کند و
 * هر worker یک پروسه جداست. اگر همه بدون قید DDL بزنند، روی یک فایل
 * SQLite به هم قفل می‌خورند و build با «database is locked» می‌افتد.
 * با این بررسی، فقط نخستین پروسه می‌نویسد و بقیه صرفاً می‌خوانند.
 */
function migrate(connection: DatabaseSync) {
  if (schemaIsCurrent(connection)) return;

  try {
    connection.exec(SCHEMA);
  } catch (error) {
    // اگر پروسه دیگری هم‌زمان همین را ساخته باشد، دوباره بررسی می‌کنیم؛
    // وجود schema یعنی کار انجام شده و خطا بی‌اهمیت است.
    if (!schemaIsCurrent(connection)) throw error;
  }
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);

  /*
    بازنویسی فیلدهای نمایشی محصول.
    مشخصات فنی عمیق (specGroups، facets، fit) همچنان در کاتالوگ کد می‌ماند،
    چون موتور فیلتر و مشاور سمت کلاینت هم به آن نیاز دارند. این جدول فقط
    همان چیزهایی را نگه می‌دارد که واحد فروش باید بدون دیپلوی عوض کند.
  */
  CREATE TABLE IF NOT EXISTS product_overrides (
    slug       TEXT PRIMARY KEY,
    name       TEXT,
    tagline    TEXT,
    summary    TEXT,
    badges     TEXT,
    price_mode TEXT,
    price      INTEGER,
    image      TEXT,
    published  INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    company       TEXT NOT NULL,
    contact_name  TEXT NOT NULL,
    phone         TEXT NOT NULL,
    email         TEXT,
    industry      TEXT,
    surface       TEXT,
    dirt          TEXT,
    area          TEXT,
    site_city     TEXT,
    interest      TEXT,
    quantity      TEXT,
    needs_training INTEGER NOT NULL DEFAULT 0,
    needs_service  INTEGER NOT NULL DEFAULT 0,
    timeline      TEXT,
    budget        TEXT,
    notes         TEXT,
    status        TEXT NOT NULL DEFAULT 'new',
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS quotes_status ON quotes(status, created_at DESC);

  /* باید آخرین جدول بماند — وجودش معیار «schema کامل است» در migrate(). */
  CREATE TABLE IF NOT EXISTS media (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    filename   TEXT NOT NULL,
    width      INTEGER NOT NULL,
    height     INTEGER NOT NULL,
    bytes      INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;
