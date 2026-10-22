import type { EmergencyAlertLog } from "@/lib/family-store";

export function EmergencyAlertHistory({ logs }: { logs: EmergencyAlertLog[] }) {
  if (logs.length === 0) return null;

  return (
    <section className="glass rounded-2xl p-6 space-y-3">
      <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Recent Emergency Alerts</h3>
      <ul className="divide-y divide-border/60 text-xs">
        {logs.map((log) => (
          <li key={log.id} className="py-2.5 flex items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-foreground">
                🚨 Threat flagged for <span className="text-primary">{log.memberName}</span>
              </p>
              <p className="text-muted-foreground mt-0.5">{log.threatHeadline}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="font-mono text-[10px] text-muted-foreground">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
              <p className="text-safe font-mono text-[10px] uppercase font-medium">Dispatched</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
