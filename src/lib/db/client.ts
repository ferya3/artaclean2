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

  // WAL: خواندن و نوشتن هم‌زمان را ممکن می‌کند. بدون آن، یک نوشتن طولانی
  // کل درخواست‌های خواندن را بلاک می‌کند.
  connection.exec("PRAGMA journal_mode = WAL");
  connection.exec("PRAGMA foreign_keys = ON");
  connection.exec("PRAGMA busy_timeout = 5000");

  migrate(connection);

  instance = connection;
  return connection;
}

function migrate(connection: DatabaseSync) {
  connection.exec(`
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

    CREATE TABLE IF NOT EXISTS media (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      filename   TEXT NOT NULL,
      width      INTEGER NOT NULL,
      height     INTEGER NOT NULL,
      bytes      INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
