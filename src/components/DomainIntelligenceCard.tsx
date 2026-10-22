import type { DomainAnalysis } from "@/lib/domain-inspector";
import { DomainSecurityBadge } from "./DomainSecurityBadge";

export function DomainIntelligenceCard({ analysis }: { analysis: DomainAnalysis }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Domain Intelligence</span>
          <h3 className="font-display text-lg font-bold text-foreground">{analysis.hostname}</h3>
        </div>
        <DomainSecurityBadge classification={analysis.classification} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-4">
        <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-muted-foreground uppercase">Root Domain</p>
          <p className="mt-1 font-semibold text-foreground truncate">{analysis.rootDomain || "N/A"}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-muted-foreground uppercase">Subdomain</p>
          <p className="mt-1 font-semibold text-foreground truncate">{analysis.subdomain || "None (Apex)"}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-muted-foreground uppercase">Top-Level Domain</p>
          <p className="mt-1 font-semibold text-foreground">.{analysis.tld}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-secondary/30 p-3">
          <p className="font-mono text-muted-foreground uppercase">Cloud Provider</p>
          <p className="mt-1 font-semibold text-foreground">{analysis.isCloudHost ? "Yes (Public Host)" : "Standard DNS"}</p>
        </div>
      </div>

      {analysis.warnings.length > 0 && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger space-y-1">
          {analysis.warnings.map((w) => (
            <p key={w} className="flex items-center gap-1.5">
              <span>⚠️</span> <span>{w}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
