import { ParsedEmailHeaders, AuthVerdict } from "@/lib/email-header-parser";
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, Mail, ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";

interface EmailHeaderInspectionCardProps {
  headers: ParsedEmailHeaders;
}

function StatusBadge({ verdict, label }: { verdict: AuthVerdict; label: string }) {
  if (verdict === "pass") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-semibold text-emerald-500">
        <CheckCircle2 className="h-3 w-3" /> {label}: PASS
      </span>
    );
  }
  if (verdict === "fail" || verdict === "softfail") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 border border-destructive/30 px-2 py-0.5 text-xs font-semibold text-destructive">
        <XCircle className="h-3 w-3" /> {label}: FAIL
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
      <HelpCircle className="h-3 w-3" /> {label}: {verdict.toUpperCase()}
    </span>
  );
}

export function EmailHeaderInspectionCard({ headers }: EmailHeaderInspectionCardProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            RFC Header Cryptographic & Sender Verification
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            SPF, DKIM, DMARC authenticity results extracted from technical headers.
          </p>
        </div>
      </div>

      {/* Auth Badges */}
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge verdict={headers.spfVerdict} label="SPF" />
        <StatusBadge verdict={headers.dkimVerdict} label="DKIM" />
        <StatusBadge verdict={headers.dmarcVerdict} label="DMARC" />
      </div>

      {/* Warnings */}
      {headers.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {headers.warnings.map((w, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-xl bg-destructive/10 border border-destructive/25 p-3 text-xs text-destructive font-medium"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {/* Header Grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded-xl border border-border/80 bg-background/50 p-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
            From Address & Domain
          </span>
          <span className="font-mono text-foreground font-semibold break-all">
            {headers.fromAddress || "Not parsed"}
          </span>
          {headers.displayName && (
            <span className="block text-muted-foreground text-[11px] mt-0.5">
              Display Name: "{headers.displayName}"
            </span>
          )}
        </div>

        <div className="rounded-xl border border-border/80 bg-background/50 p-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
            Reply-To Routing
          </span>
          <span className="font-mono text-foreground font-semibold break-all">
            {headers.replyToAddress || "Matches From address"}
          </span>
        </div>

        {headers.returnPath && (
          <div className="rounded-xl border border-border/80 bg-background/50 p-3">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
              Return-Path (Envelope Sender)
            </span>
            <span className="font-mono text-foreground font-semibold break-all">
              {headers.returnPath}
            </span>
          </div>
        )}

        <div className="rounded-xl border border-border/80 bg-background/50 p-3">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
            Network Relay Hops
          </span>
          <span className="font-mono text-foreground font-semibold">
            {headers.receivedHopsCount} servers traversed
          </span>
          {headers.suspiciousRelayFound && (
            <span className="block text-amber-500 text-[11px] mt-0.5">
              ⚠️ Traversed unusual or multi-tier relay paths
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
