import { areaBandRange, workingWidthBands } from "@/lib/data/taxonomy";
import type { AreaBand, FilterKey, ProductCardData } from "@/lib/types";

/** وضعیت فیلتر، مستقیماً از query string خوانده می‌شود تا لینک قابل اشتراک باشد. */
export type FilterState = Partial<Record<FilterKey, string[]>>;

export function parseFilters(searchParams: Record<string, string | string[] | undefined>): FilterState {
  const keys: FilterKey[] = ["machineType", "powerSource", "area", "workingWidth", "brushType", "brand"];
  const state: FilterState = {};
  for (const key of keys) {
    const raw = searchParams[key];
    if (!raw) continue;
    const values = Array.isArray(raw) ? raw : raw.split(",");
    const clean = values.map((v) => v.trim()).filter(Boolean);
    if (clean.length) state[key] = clean;
  }
  return state;
}

export function serializeFilters(state: FilterState): string {
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(state)) {
    if (values?.length) params.set(key, values.join(","));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function toggleFilter(state: FilterState, key: FilterKey, value: string): FilterState {
  const current = state[key] ?? [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  const out: FilterState = { ...state };
  if (next.length) out[key] = next;
  else delete out[key];
  return out;
}

export function countActive(state: FilterState): number {
  return Object.values(state).reduce((sum, v) => sum + (v?.length ?? 0), 0);
}

function matchesRangeBand(
  bands: string[],
  ranges: Record<string, [number, number]>,
  value: number | undefined,
): boolean {
  if (value === undefined) return false;
  return bands.some((b) => {
    const range = ranges[b];
    if (!range) return false;
    return value >= range[0] && value < range[1];
  });
}

const widthRanges = Object.fromEntries(workingWidthBands.map((b) => [b.key, b.range])) as Record<
  string,
  [number, number]
>;

export function applyFilters<T extends ProductCardData>(items: T[], state: FilterState): T[] {
  return items.filter((p) => {
    if (state.machineType && !state.machineType.includes(p.facets.machineType)) return false;
    if (state.powerSource && !state.powerSource.includes(p.facets.powerSource)) return false;
    if (state.brushType && !state.brushType.includes(p.facets.brushType)) return false;
    if (state.brand && !state.brand.includes(p.brand)) return false;

    if (state.area) {
      // متراژ: هم‌پوشانی بازه، نه تطابق دقیق — دستگاهی که ۱٬۰۰۰ تا ۵٬۰۰۰ را
      // پوشش می‌دهد باید در فیلتر «۵۰۰ تا ۲٬۰۰۰» هم دیده شود.
      const hit = state.area.some((band) => {
        const range = areaBandRange[band as AreaBand];
        if (!range) return false;
        return p.facets.areaMin < range[1] && p.facets.areaMax > range[0];
      });
      if (!hit) return false;
    }

    if (state.workingWidth && !matchesRangeBand(state.workingWidth, widthRanges, p.facets.workingWidth)) {
      return false;
    }

    return true;
  });
}

/** تعداد نتایج هر گزینه، اگر آن گزینه به فیلتر فعلی اضافه شود. */
export function facetCount(
  items: ProductCardData[],
  state: FilterState,
  key: FilterKey,
  value: string,
): number {
  const probe = toggleFilter({ ...state, [key]: [] }, key, value);
  return applyFilters(items, { ...state, [key]: probe[key] }).length;
}
