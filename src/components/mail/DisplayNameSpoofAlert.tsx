import { ShieldAlert, AlertTriangle } from "lucide-react";

interface DisplayNameSpoofAlertProps {
  displayName: string;
  actualEmail: string;
  domain: string;
}

export function DisplayNameSpoofAlert({ displayName, actualEmail, domain }: DisplayNameSpoofAlertProps) {
  if (!displayName || !domain) return null;

  return (
    <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-destructive">
            <span>Deceptive Display Name Detected</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            The sender label displays <strong className="text-foreground">"{displayName}"</strong>, but the underlying email inbox is actually <strong className="font-mono text-foreground">{actualEmail}</strong>.
          </p>
          <div className="mt-2 rounded-lg bg-background/80 p-2.5 font-mono text-[11px] text-muted-foreground border border-border">
            <span className="text-destructive font-bold">Visible to You:</span> {displayName}
            <br />
            <span className="text-muted-foreground font-bold">Real Sender:</span> {actualEmail}
          </div>
        </div>
      </div>
    </div>
  );
}
