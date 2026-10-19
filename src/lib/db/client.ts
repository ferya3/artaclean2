import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

import { seedRows } from "@/lib/content/seed";

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
  //
  // تغییر journal_mode تنها دستوری است که busy_timeout شاملش نمی‌شود: به قفل
  // انحصاری نیاز دارد و اگر اتصال دیگری باز باشد، بی‌درنگ SQLITE_BUSY می‌دهد.
  // این در build رخ می‌دهد، چون Next صفحات را در چند پروسه موازی prerender
  // می‌کند و همه هم‌زمان وصل می‌شوند. شکستش هم بی‌اهمیت است: این مقدار در
  // خود فایل دیتابیس ذخیره می‌شود، پس یک بار که ست شد برای همیشه WAL می‌ماند
  // و پروسه‌ای که اینجا ناکام می‌ماند، یعنی پروسه دیگری همین حالا ستش کرده.
  try {
    connection.exec("PRAGMA journal_mode = WAL");
  } catch {
    // عمداً نادیده — توضیح بالا.
  }

  connection.exec("PRAGMA foreign_keys = ON");

  migrate(connection);

  instance = connection;
  return connection;
}

/**
 * نسخه schema.
 *
 * با هر تغییر ساختار یک واحد بالا می‌رود. چون همه دستورهای SCHEMA به‌صورت
 * «IF NOT EXISTS» نوشته شده‌اند، اجرای دوباره‌شان روی دیتابیس موجود بی‌خطر
 * است و فقط چیزهای تازه ساخته می‌شوند. برای تغییر یک جدول موجود (ALTER)،
 * دستور را در stepUp() و زیر شماره نسخه خودش بگذارید.
 */
const SCHEMA_VERSION = 2;

function schemaVersion(connection: DatabaseSync): number {
  const row = connection.prepare("PRAGMA user_version").get() as { user_version?: number };
  return Number(row?.user_version ?? 0);
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
  if (schemaVersion(connection) >= SCHEMA_VERSION) return;

  try {
    connection.exec("BEGIN IMMEDIATE");
    // بین بررسی اول و گرفتن قفل، ممکن است پروسه دیگری کار را تمام کرده باشد.
    if (schemaVersion(connection) >= SCHEMA_VERSION) {
      connection.exec("ROLLBACK");
      return;
    }
    connection.exec(SCHEMA);
    seedContent(connection);
    connection.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
    connection.exec("COMMIT");
  } catch (error) {
    try {
      connection.exec("ROLLBACK");
    } catch {
      // اگر تراکنشی باز نبوده، ROLLBACK خودش خطا می‌دهد — بی‌اهمیت است.
    }
    // اگر پروسه دیگری هم‌زمان همین را ساخته باشد، کار انجام شده و خطا
    // صرفاً نتیجه رقابت بوده است.
    if (schemaVersion(connection) < SCHEMA_VERSION) throw error;
  }
}

/**
 * پر کردن اولیه جدول content از داده کد.
 *
 * داده `src/lib/data/*` از اینجا به بعد نقش «کارخانه‌ای» دارد: یک بار کپی
 * می‌شود و از آن پس مرجع، دیتابیس است.
 */
function seedContent(connection: DatabaseSync) {
  const insert = connection.prepare(
    `INSERT OR IGNORE INTO content (collection, slug, data, position, published)
     VALUES (?, ?, ?, ?, 1)`,
  );

  for (const row of seedRows()) {
    insert.run(row.collection, row.slug, JSON.stringify(row.data), row.position);
  }

  carryOverProductEdits(connection);
}

/**
 * نسخه قبلی پنل فقط چند فیلد نمایشی محصول را در جدول product_overrides
 * نگه می‌داشت. روی سایتی که از قبل بالا بوده، آن ردیف‌ها کار واحد فروش
 * هستند و نباید با seed از بین بروند — پس روی رکورد تازه سوار می‌شوند.
 */
function carryOverProductEdits(connection: DatabaseSync) {
  // روی نصب تازه این جدول هرگز ساخته نمی‌شود؛ فقط دیتابیس‌هایی که از نسخه
  // قبلی پنل آمده‌اند آن را دارند.
  const legacy = connection
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'product_overrides'")
    .get();
  if (!legacy) return;

  const overrides = connection.prepare("SELECT * FROM product_overrides").all() as unknown as {
    slug: string;
    name: string | null;
    tagline: string | null;
    summary: string | null;
    badges: string | null;
    price_mode: string | null;
    price: number | null;
    image: string | null;
    published: number;
  }[];
  if (overrides.length === 0) return;

  const read = connection.prepare("SELECT data FROM content WHERE collection = 'products' AND slug = ?");
  const write = connection.prepare(
    "UPDATE content SET data = ?, published = ? WHERE collection = 'products' AND slug = ?",
  );

  for (const o of overrides) {
    const row = read.get(o.slug) as { data: string } | undefined;
    if (!row) continue;

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(row.data) as Record<string, unknown>;
    } catch {
      continue;
    }

    if (o.name) data.name = o.name;
    if (o.tagline) data.tagline = o.tagline;
    if (o.summary) data.summary = o.summary;
    if (o.badges) data.badges = o.badges.split("،").map((b) => b.trim()).filter(Boolean);
    if (o.price_mode) data.priceMode = o.price_mode;
    if (o.price !== null) data.price = o.price;
    if (o.image) data.image = o.image;

    write.run(JSON.stringify(data), o.published, o.slug);
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
    محتوای سایت.

    یک جدول برای همه مجموعه‌ها (محصول، دسته، برند، صنعت، خدمت، مقاله،
    قطعه، پروژه، صفحه) با بدنه JSON. دلیلش همان دلیل Spec[] در مدل داده
    است: محصول صنعتی ۷۰ ویژگی دارد که از مدلی به مدل دیگر فرق می‌کند، و
    هر «فیلد تازه» نباید یک ALTER TABLE و یک دیپلوی بخواهد. شکل هر بدنه
    با schema فیلدها در src/lib/admin/schemas.ts کنترل می‌شود و هنگام
    خواندن با normalize* اعتبارسنجی می‌شود — پس یک رکورد خراب، صفحه را
    نمی‌اندازد.
  */
  CREATE TABLE IF NOT EXISTS content (
    collection TEXT NOT NULL,
    slug       TEXT NOT NULL,
    data       TEXT NOT NULL,
    position   INTEGER NOT NULL DEFAULT 0,
    published  INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (collection, slug)
  );
  CREATE INDEX IF NOT EXISTS content_order ON content(collection, position, slug);

  /* تنظیمات سایت: نام، تماس، شبکه‌های اجتماعی، متن‌های صفحه اصلی، منوها. */
  CREATE TABLE IF NOT EXISTS settings (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
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
`;
