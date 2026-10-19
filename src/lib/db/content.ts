import "server-only";

import { db } from "@/lib/db/client";

/**
 * دسترسی خام به جدول content و settings.
 *
 * اینجا هیچ چیزی درباره شکل داده نمی‌داند — فقط ردیف و JSON. معنا دادن به
 * بدنه، کار `src/lib/content.ts` است که هر رکورد را normalize می‌کند.
 */

export interface ContentRow {
  collection: string;
  slug: string;
  data: unknown;
  position: number;
  published: boolean;
  updatedAt: string;
}

interface RawRow {
  collection: string;
  slug: string;
  data: string;
  position: number;
  published: number;
  updated_at: string;
}

function parse(row: RawRow): ContentRow {
  let data: unknown = {};
  try {
    data = JSON.parse(row.data);
  } catch {
    // یک رکورد خراب نباید کل صفحه را بیندازد؛ خالی برمی‌گردد و normalize
    // بقیه کار را با مقادیر پیش‌فرض انجام می‌دهد.
    data = {};
  }
  return {
    collection: row.collection,
    slug: row.slug,
    data,
    position: row.position,
    published: row.published === 1,
    updatedAt: row.updated_at,
  };
}

export function listRows(collection: string, includeDrafts = false): ContentRow[] {
  const sql = includeDrafts
    ? "SELECT * FROM content WHERE collection = ? ORDER BY position, slug"
    : "SELECT * FROM content WHERE collection = ? AND published = 1 ORDER BY position, slug";
  return (db().prepare(sql).all(collection) as unknown as RawRow[]).map(parse);
}

export function getRow(collection: string, slug: string): ContentRow | undefined {
  const row = db()
    .prepare("SELECT * FROM content WHERE collection = ? AND slug = ?")
    .get(collection, slug) as RawRow | undefined;
  return row ? parse(row) : undefined;
}

export function upsertRow(input: {
  collection: string;
  slug: string;
  data: unknown;
  published: boolean;
  position?: number;
}) {
  const position = input.position ?? nextPosition(input.collection);
  db()
    .prepare(
      `INSERT INTO content (collection, slug, data, position, published, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(collection, slug) DO UPDATE SET
         data = excluded.data,
         published = excluded.published,
         updated_at = datetime('now')`,
    )
    .run(
      input.collection,
      input.slug,
      JSON.stringify(input.data),
      position,
      input.published ? 1 : 0,
    );
}

/** تغییر شناسه یک رکورد؛ جای آن در ترتیب حفظ می‌شود. */
export function renameRow(collection: string, from: string, to: string) {
  db()
    .prepare("UPDATE content SET slug = ?, updated_at = datetime('now') WHERE collection = ? AND slug = ?")
    .run(to, collection, from);
}

export function deleteRow(collection: string, slug: string) {
  db().prepare("DELETE FROM content WHERE collection = ? AND slug = ?").run(collection, slug);
}

export function setPublished(collection: string, slug: string, published: boolean) {
  db()
    .prepare(
      "UPDATE content SET published = ?, updated_at = datetime('now') WHERE collection = ? AND slug = ?",
    )
    .run(published ? 1 : 0, collection, slug);
}

/** جابه‌جایی یک رکورد در ترتیب نمایش — با تعویض جای آن و همسایه‌اش. */
export function moveRow(collection: string, slug: string, direction: -1 | 1) {
  const rows = listRows(collection, true);
  const index = rows.findIndex((r) => r.slug === slug);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= rows.length) return;

  // ترتیب ذخیره‌شده ممکن است تکراری یا پراکنده باشد (مثلاً بعد از حذف)؛
  // به‌جای تعویض دو عدد، کل ستون بازنویسی می‌شود تا همیشه ۰..n-1 بماند.
  const ordered = [...rows];
  [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  setPositions(
    collection,
    ordered.map((r) => r.slug),
  );
}

export function setPositions(collection: string, slugs: string[]) {
  const stmt = db().prepare("UPDATE content SET position = ? WHERE collection = ? AND slug = ?");
  slugs.forEach((slug, index) => stmt.run(index, collection, slug));
}

export function nextPosition(collection: string): number {
  const row = db()
    .prepare("SELECT COALESCE(MAX(position), -1) + 1 AS next FROM content WHERE collection = ?")
    .get(collection) as { next?: number };
  return Number(row?.next ?? 0);
}

export function countRows(collection: string): { total: number; published: number } {
  const row = db()
    .prepare(
      "SELECT COUNT(*) AS total, SUM(published) AS published FROM content WHERE collection = ?",
    )
    .get(collection) as { total?: number; published?: number };
  return { total: Number(row?.total ?? 0), published: Number(row?.published ?? 0) };
}

/* ────────────────────────────────────────────────────────── تنظیمات */

export function readSetting(key: string): unknown {
  const row = db().prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  if (!row) return undefined;
  try {
    return JSON.parse(row.value);
  } catch {
    return undefined;
  }
}

export function writeSetting(key: string, value: unknown) {
  db()
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`,
    )
    .run(key, JSON.stringify(value));
}
