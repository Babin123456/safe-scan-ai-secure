import type { Report } from "./store";
import type { CommunityFilterState } from "@/components/community/CommunitySearchFilter";

const VOTES_KEY = "safescan-confirmed-reports-v1";

export function getConfirmedReportIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

export function saveConfirmedReportId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const set = getConfirmedReportIds();
    set.add(id);
    localStorage.setItem(VOTES_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

export function filterAndSortReports(reports: Report[], filters: CommunityFilterState): Report[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = reports.filter((r) => {
    if (filters.kind !== "all" && r.kind !== filters.kind) return false;
    if (filters.level !== "all" && r.level !== filters.level) return false;
    if (query) {
      const matchTitle = r.title.toLowerCase().includes(query);
      const matchDesc = r.description.toLowerCase().includes(query);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  return filtered.sort((a, b) => {
    if (filters.sortBy === "recent") {
      return b.at - a.at;
    }
    return b.count - a.count;
  });
}
