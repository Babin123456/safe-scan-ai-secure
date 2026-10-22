import type { ScanKind } from "@/lib/store";
import type { RiskLevel } from "@/lib/scan-engine";

export type CommunityFilterState = {
  query: string;
  kind: ScanKind | "all";
  level: RiskLevel | "all";
  sortBy: "popular" | "recent";
};

export function CommunitySearchFilter({
  filters,
  onChange,
  onReset,
}: {
  filters: CommunityFilterState;
  onChange: (f: Partial<CommunityFilterState>) => void;
  onReset: () => void;
}) {
  const isFiltered = filters.query.trim() !== "" || filters.kind !== "all" || filters.level !== "all";

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card/60 p-4">
      <div className="relative">
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder="Search scam patterns (e.g. SBI, electricity, UPI, cashback)..."
          className="w-full rounded-xl border border-input bg-background/80 px-4 py-2.5 pl-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
        />
        <span className="absolute left-3 top-2.5 text-muted-foreground">🔍</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "sms", "link", "qr", "mail"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onChange({ kind: k })}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filters.kind === k
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "border border-border bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {k === "all" ? "All Types" : k.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.level}
            onChange={(e) => onChange({ level: e.target.value as CommunityFilterState["level"] })}
            className="rounded-lg border border-input bg-background px-2.5 py-1 font-medium text-xs outline-none"
          >
            <option value="all">All Severities</option>
            <option value="high">🔴 High Risk Only</option>
            <option value="medium">🟠 Medium Risk Only</option>
            <option value="low">🟢 Low Risk Only</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as CommunityFilterState["sortBy"] })}
            className="rounded-lg border border-input bg-background px-2.5 py-1 font-medium text-xs outline-none"
          >
            <option value="popular">Most Reported</option>
            <option value="recent">Newest First</option>
          </select>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-primary hover:underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
