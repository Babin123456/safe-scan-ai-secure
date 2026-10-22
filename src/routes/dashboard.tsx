import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { RISK_META } from "@/lib/scan-engine";
import { useStore, removeScan, clearAllScans } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { exportScansAsCsv, exportScansAsJson } from "@/lib/export-report";
import { ScanHistoryFilters, type FilterState } from "@/components/ScanHistoryFilters";
import { ScanAnalyticsSummary } from "@/components/ScanAnalyticsSummary";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Protection Dashboard — SafeScan AI" },
      {
        name: "description",
        content: "Your scan history, threats blocked and detected Scam DNA patterns in one cybersecurity dashboard.",
      },
      { property: "og:title", content: "Protection Dashboard — SafeScan AI" },
      {
        property: "og:description",
        content: "Track today's SMS, QR and link scans plus the threats SafeScan AI blocked for you.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { scans, reports } = useStore();
  const { user, name } = useAuth();
  const [filters, setFilters] = useState<FilterState>({ kind: "all", level: "all" });

  const count = (k: string) => scans.filter((s) => s.kind === k).length;
  const byLevel = (l: string) => scans.filter((s) => s.level === l).length;

  const filteredScans = scans.filter((s) => {
    if (filters.kind !== "all" && s.kind !== filters.kind) return false;
    if (filters.level !== "all" && s.level !== filters.level) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        icon="📊"
        title={`Hello, ${user ? name ?? "there" : "Suhani"} 👋`}
        subtitle="Your protection status and everything SafeScan AI checked for you."
      />
      {!user && (
        <div className="glass mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4 text-sm">
          <span>Log in to save your scan history to your account.</span>
          <Link to="/auth" className="rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground">Log in / Sign up</Link>
        </div>
      )}

      <div className="glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Protection status</p>
          <p className="mt-2 flex items-center gap-2 font-display text-2xl font-bold text-safe">
            <span className="h-3 w-3 rounded-full bg-safe animate-pulse-ring" /> ACTIVE
          </p>
        </div>
        <Link
          to="/scan/link"
          className="glow-primary rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          Scan Something
        </Link>
      </div>

      <div className="mb-6">
        <ScanAnalyticsSummary scans={scans} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Your scans</h2>
          <div className="mt-5 space-y-3">
            {[
              ["📱 SMS", count("sms")],
              ["🔗 Links", count("link")],
              ["🔳 QR", count("qr")],
              ["📧 Mail", count("mail")],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
                <span className="text-sm">{label}</span>
                <span className="font-display text-xl font-bold tabular-nums">{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Threats blocked</h2>
          <div className="mt-5 space-y-3">
            {(["high", "medium", "low"] as const).map((l) => (
              <div key={l} className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3">
                <span className={`text-sm ${RISK_META[l].text}`}>
                  {RISK_META[l].tone} {RISK_META[l].label}
                </span>
                <span className="font-display text-xl font-bold tabular-nums">{byLevel(l)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="font-display text-lg font-semibold">🧬 Scam DNA Detected</h2>
        <p className="mt-2 font-mono text-sm text-primary">Fake KYC + Urgency + Banking + Link</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Hundreds of different messages share the same underlying template. SafeScan AI groups them into one
          family, so a brand-new variation is still recognised on first sight.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["reports", 247],
            ["variations", 18],
            ["domains", 6],
            ["banks impersonated", 3],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl bg-secondary/60 p-4">
              <p className="font-display text-2xl font-bold">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass mt-6 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Recent activity</h2>
          {scans.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => exportScansAsCsv(filteredScans)}
                className="rounded-lg border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                title="Export filtered records as CSV for bank/police complaints"
              >
                📄 Export CSV
              </button>
              <button
                onClick={() => exportScansAsJson(filteredScans)}
                className="rounded-lg border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                title="Export digital evidence package in JSON format"
              >
                💾 Export JSON
              </button>
              <button
                onClick={() => {
                  if (confirm("Clear all recorded scan history?")) clearAllScans();
                }}
                className="rounded-lg border border-danger/30 px-3 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {scans.length > 0 && (
          <div className="mt-4">
            <ScanHistoryFilters
              filters={filters}
              onChange={(partial) => setFilters((f) => ({ ...f, ...partial }))}
              onReset={() => setFilters({ kind: "all", level: "all" })}
            />
          </div>
        )}

        {filteredScans.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            {scans.length === 0 ? (
              <>
                No scans yet. Try the{" "}
                <Link to="/scan/link" className="text-primary underline">
                  Link Scanner
                </Link>{" "}
                with a suspicious URL.
              </>
            ) : (
              "No scans match the selected filter criteria."
            )}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {filteredScans.slice(0, 15).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-4 py-3">
                <span className="truncate text-sm">
                  {s.kind === "sms" ? "📱" : s.kind === "qr" ? "🔳" : s.kind === "mail" ? "📧" : "🔗"} {s.subject}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-mono text-xs font-semibold ${RISK_META[s.level].text}`}>{s.score}/100</span>
                  <button
                    onClick={() => removeScan(s.id)}
                    className="text-muted-foreground hover:text-danger text-xs p-1"
                    title="Delete this entry"
                    aria-label={`Delete scan ${s.subject}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {reports.length} scam patterns in your community database.
      </p>
    </div>
  );
}
