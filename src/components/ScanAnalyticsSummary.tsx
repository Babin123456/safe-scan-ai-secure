import type { ScanEntry } from "@/lib/store";

export function ScanAnalyticsSummary({ scans }: { scans: ScanEntry[] }) {
  if (scans.length === 0) return null;

  const total = scans.length;
  const avgScore = Math.round(scans.reduce((sum, s) => sum + s.score, 0) / total);
  const highRiskCount = scans.filter((s) => s.level === "high").length;
  const highRiskPercentage = Math.round((highRiskCount / total) * 100);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div className="rounded-xl border border-border bg-card/60 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Scans Tracked</p>
        <p className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">{total}</p>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Avg Trust Score</p>
        <p className={`mt-1 font-display text-2xl font-bold tabular-nums ${avgScore < 40 ? "text-danger" : avgScore < 70 ? "text-warn" : "text-safe"}`}>
          {avgScore}/100
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Threats Blocked</p>
        <p className="mt-1 font-display text-2xl font-bold tabular-nums text-danger">{highRiskCount}</p>
      </div>

      <div className="rounded-xl border border-border bg-card/60 p-4">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Threat Ratio</p>
        <p className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">{highRiskPercentage}%</p>
      </div>
    </div>
  );
}
