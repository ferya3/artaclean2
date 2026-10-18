import "server-only";

import { db } from "@/lib/db/client";

/* ──────────────────────────────────────────── بازنویسی‌های محصول */

export interface ProductOverride {
  slug: string;
  name: string | null;
  tagline: string | null;
  summary: string | null;
  badges: string | null;
  price_mode: string | null;
  price: number | null;
  image: string | null;
  published: number;
}

export function allOverrides(): Map<string, ProductOverride> {
  const rows = db()
    .prepare("SELECT * FROM product_overrides")
    .all() as unknown as ProductOverride[];
  return new Map(rows.map((r) => [r.slug, r]));
}

export function getOverride(slug: string): ProductOverride | undefined {
  return db().prepare("SELECT * FROM product_overrides WHERE slug = ?").get(slug) as
    | ProductOverride
    | undefined;
}

export function saveOverride(input: {
  slug: string;
  name: string | null;
  tagline: string | null;
  summary: string | null;
  badges: string | null;
  priceMode: string | null;
  price: number | null;
  image: string | null;
  published: boolean;
}) {
  db()
    .prepare(
      `INSERT INTO product_overrides
         (slug, name, tagline, summary, badges, price_mode, price, image, published, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(slug) DO UPDATE SET
         name = excluded.name,
         tagline = excluded.tagline,
         summary = excluded.summary,
         badges = excluded.badges,
         price_mode = excluded.price_mode,
         price = excluded.price,
         image = excluded.image,
         published = excluded.published,
         updated_at = datetime('now')`,
    )
    .run(
      input.slug,
      input.name,
      input.tagline,
      input.summary,
      input.badges,
      input.priceMode,
      input.price,
      input.image,
      input.published ? 1 : 0,
    );
}

/* ──────────────────────────────────────────────── درخواست پیش‌فاکتور */

export interface QuoteRow {
  id: number;
  company: string;
  contact_name: string;
  phone: string;
  email: string | null;
  industry: string | null;
  surface: string | null;
  dirt: string | null;
  area: string | null;
  site_city: string | null;
  interest: string | null;
  quantity: string | null;
  needs_training: number;
  needs_service: number;
  timeline: string | null;
  budget: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

export function insertQuote(input: Omit<QuoteRow, "id" | "status" | "created_at">): number {
  const result = db()
    .prepare(
      `INSERT INTO quotes
        (company, contact_name, phone, email, industry, surface, dirt, area, site_city,
         interest, quantity, needs_training, needs_service, timeline, budget, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.company,
      input.contact_name,
      input.phone,
      input.email,
      input.industry,
      input.surface,
      input.dirt,
      input.area,
      input.site_city,
      input.interest,
      input.quantity,
      input.needs_training,
      input.needs_service,
      input.timeline,
      input.budget,
      input.notes,
    );
  return Number(result.lastInsertRowid);
}

export function listQuotes(status?: string): QuoteRow[] {
  if (status && status !== "all") {
    return db()
      .prepare("SELECT * FROM quotes WHERE status = ? ORDER BY created_at DESC, id DESC")
      .all(status) as unknown as QuoteRow[];
  }
  return db()
    .prepare("SELECT * FROM quotes ORDER BY created_at DESC, id DESC")
    .all() as unknown as QuoteRow[];
}

export function quoteCounts(): Record<string, number> {
  const rows = db()
    .prepare("SELECT status, COUNT(*) AS count FROM quotes GROUP BY status")
    .all() as unknown as { status: string; count: number }[];
  return Object.fromEntries(rows.map((r) => [r.status, r.count]));
}

export function setQuoteStatus(id: number, status: string) {
  db().prepare("UPDATE quotes SET status = ? WHERE id = ?").run(status, id);
}

/* ─────────────────────────────────────────────────────────── رسانه */

export function insertMedia(input: {
  filename: string;
  width: number;
  height: number;
  bytes: number;
}): void {
  db()
    .prepare("INSERT INTO media (filename, width, height, bytes) VALUES (?, ?, ?, ?)")
    .run(input.filename, input.width, input.height, input.bytes);
}

export function listMedia(limit = 60) {
  return db()
    .prepare("SELECT * FROM media ORDER BY id DESC LIMIT ?")
    .all(limit) as unknown as {
    id: number;
    filename: string;
    width: number;
    height: number;
    bytes: number;
    created_at: string;
  }[];
}
