import type { ParsedQrPayload } from "@/lib/qr-payload-parser";

export function QrDecodedCard({ parsed }: { parsed: ParsedQrPayload }) {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-3xl">{parsed.icon}</span>
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Payload Type</span>
          <h3 className="font-display text-lg font-semibold text-foreground">{parsed.label}</h3>
        </div>
      </div>

      <dl className="grid gap-2 border-t border-border/50 pt-3 text-sm">
        {parsed.details.map((d) => (
          <div key={d.label} className="flex flex-wrap items-center justify-between gap-2">
            <dt className="text-muted-foreground">{d.label}</dt>
            <dd className="font-mono text-xs text-foreground font-medium">{d.value}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-xl border border-border/60 bg-secondary/40 p-3.5">
        <p className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">Security Advice</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{parsed.securityRecommendation}</p>
      </div>
    </div>
  );
}
