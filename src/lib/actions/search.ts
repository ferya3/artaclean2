"use server";

import { searchCorpus } from "@/lib/content";
import {
  extractIntent,
  groupHits,
  search,
  type SearchGroup,
  type SearchHit,
  type SearchIntent,
} from "@/lib/search";

/**
 * جست‌وجوی کادر بالای سایت.
 *
 * تا پیش از این کل کاتالوگ در باندل کلاینت بود تا این دیالوگ بتواند جست‌وجو
 * کند. حالا کاتالوگ در دیتابیس است و جست‌وجو همان‌جا اجرا می‌شود: باندل سبک‌تر
 * می‌شود و نتیجه همیشه با آخرین ویرایش پنل می‌خواند.
 */
export interface SearchResponse {
  groups: { group: SearchGroup; items: SearchHit[] }[];
  intent: SearchIntent;
}

export async function searchAction(query: string): Promise<SearchResponse> {
  const q = query.trim();
  if (q.length < 2) return { groups: [], intent: {} };

  return {
    groups: groupHits(search(q, searchCorpus())),
    intent: q.length > 2 ? extractIntent(q) : {},
  };
}
