import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { type RiskLevel } from "@/lib/scan-engine";
import { addReport, confirmReport, useStore, type ScanKind } from "@/lib/store";
import { CommunitySearchFilter, type CommunityFilterState } from "@/components/community/CommunitySearchFilter";
import { CommunityReportCard } from "@/components/community/CommunityReportCard";
import { filterAndSortReports, getConfirmedReportIds, saveConfirmedReportId } from "@/lib/community-service";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Scam Intelligence — SafeScan AI" },
      {
        name: "description",
        content: "Live feed of scams reported by the community. Report an SMS, QR or link to protect everyone else.",
      },
      { property: "og:title", content: "Community Scam Intelligence — SafeScan AI" },
      {
        property: "og:description",
        content: "One report syncs to every user. See the most reported SMS, QR and link scams right now.",
      },
    ],
  }),
  component: Community,
});

function Community() {
  const { reports } = useStore();
  const [kind, setKind] = useState<ScanKind>("sms");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<RiskLevel>("high");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<CommunityFilterState>({
    query: "",
    kind: "all",
    level: "all",
    sortBy: "popular",
  });

  useEffect(() => {
    setConfirmedIds(getConfirmedReportIds());
  }, []);

  function handleConfirm(id: string) {
    if (confirmedIds.has(id)) return;
    confirmReport(id);
    saveConfirmedReportId(id);
    setConfirmedIds((prev) => new Set([...prev, id]));
  }

  const displayedReports = filterAndSortReports(reports, filters);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    const d = description.trim();
    if (t.length < 4 || t.length > 100) {
      setError("Give the scam a short title (4–100 characters).");
      return;
    }
    if (d.length < 10 || d.length > 600) {
      setError("Describe what happened in 10–600 characters.");
      return;
    }
    addReport({ kind, title: t, description: d, level });
    setTitle("");
    setDescription("");
    setError("");
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader
        icon="🚨"
        title="Community Scam Intelligence"
        subtitle="Every report is synced to the shared scam database, so the next person who scans the same SMS, QR or link is warned instantly."
      />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Community Scam Database ({displayedReports.length})
            </h2>
          </div>

          <CommunitySearchFilter
            filters={filters}
            onChange={(partial) => setFilters((f) => ({ ...f, ...partial }))}
            onReset={() => setFilters({ query: "", kind: "all", level: "all", sortBy: "popular" })}
          />

          {displayedReports.length === 0 ? (
            <div className="glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
              No scam reports match your query. Try broadening your keywords.
            </div>
          ) : (
            displayedReports.map((r) => (
              <CommunityReportCard
                key={r.id}
                report={r}
                onConfirm={handleConfirm}
                hasConfirmed={confirmedIds.has(r.id)}
              />
            ))
          )}
        </section>

        <aside className="glass h-fit rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Report a Scam</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <fieldset>
              <legend className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Type</legend>
              <div className="mt-2 flex gap-2">
                {(["sms", "qr", "link", "mail"] as ScanKind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setKind(k)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition-colors ${
                      kind === k ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                    }`}
                  >
                    {KIND_ICON[k]} {k}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="title" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Title
              </label>
              <input
                id="title"
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Fake electricity bill SMS"
                className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label htmlFor="desc" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Description
              </label>
              <textarea
                id="desc"
                value={description}
                rows={4}
                maxLength={600}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did the message say? What did it ask you to do?"
                className="mt-2 w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Risk</span>
              <div className="mt-2 flex gap-2">
                {(["high", "medium", "low"] as RiskLevel[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-xs uppercase transition-colors ${
                      level === l ? `border-current ${RISK_META[l].text}` : "border-border text-muted-foreground"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-danger">{error}</p>}
            {sent && <p className="text-xs text-safe">✓ Report submitted and synced to the community database.</p>}

            <button
              type="submit"
              className="glow-primary w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground"
            >
              SUBMIT REPORT
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}
