import type { ScanKind } from "@/lib/store";
import type { RiskLevel } from "@/lib/scan-engine";

export type FilterState = {
  kind: ScanKind | "all";
  level: RiskLevel | "all";
};

export function ScanHistoryFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
  onReset: () => void;
}) {
  const isFiltered = filters.kind !== "all" || filters.level !== "all";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs uppercase text-muted-foreground">Filter:</span>
        <select
          value={filters.kind}
          onChange={(e) => onChange({ kind: e.target.value as FilterState["kind"] })}
          className="rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-medium outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Types</option>
          <option value="sms">📱 SMS</option>
          <option value="link">🔗 Link</option>
          <option value="qr">🔳 QR</option>
          <option value="mail">📧 Mail</option>
        </select>

        <select
          value={filters.level}
          onChange={(e) => onChange({ level: e.target.value as FilterState["level"] })}
          className="rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-medium outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="all">All Risk Levels</option>
          <option value="high">🔴 High Risk</option>
          <option value="medium">🟠 Medium Risk</option>
          <option value="low">🟢 Low Risk</option>
        </select>
      </div>

      {isFiltered && (
        <button
          onClick={onReset}
          className="font-mono text-xs text-primary transition-colors hover:underline"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
