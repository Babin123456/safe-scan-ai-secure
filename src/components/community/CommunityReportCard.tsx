import { useState } from "react";
import { RISK_META } from "@/lib/scan-engine";
import type { Report, ScanKind } from "@/lib/store";

const KIND_ICON: Record<ScanKind, string> = { sms: "📱", qr: "🔳", link: "🔗", mail: "📧" };

export function CommunityReportCard({
  report,
  onConfirm,
  hasConfirmed,
}: {
  report: Report;
  onConfirm: (id: string) => void;
  hasConfirmed: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const meta = RISK_META[report.level];

  function copyWarning() {
    const text = `🚨 SafeScan Scam Alert: ${report.title}\n\n${report.description}\n\nReported ${report.count} times. Verified on SafeScan AI.`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <article className="glass rounded-2xl p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-semibold">
          {KIND_ICON[report.kind]} {report.title}
        </h3>
        <span className={`font-mono text-xs font-semibold ${meta.text}`}>
          {meta.tone} {meta.label}
        </span>
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{report.description}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3">
        <span className="font-mono text-xs text-primary">
          👥 Reported {report.count} {report.count === 1 ? "time" : "times"}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyWarning}
            className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
            title="Copy warning text to clipboard"
          >
            {copied ? "✓ Copied" : "📋 Share Warning"}
          </button>

          <button
            type="button"
            disabled={hasConfirmed}
            onClick={() => onConfirm(report.id)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              hasConfirmed
                ? "bg-safe/20 text-safe cursor-default"
                : "border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {hasConfirmed ? "✓ You Confirmed" : "⚠️ I Saw This Too (+1)"}
          </button>
        </div>
      </div>
    </article>
  );
}
