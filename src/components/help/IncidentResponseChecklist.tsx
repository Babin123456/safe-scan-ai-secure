import { useState, useEffect } from "react";
import { INCIDENT_CHECKLIST_TEMPLATE } from "@/lib/incident-helper";
import { CheckCircle2, Circle, RotateCcw, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "safescan-incident-checklist-v1";

export function IncidentResponseChecklist() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCompleted(JSON.parse(saved));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleItem = (id: string) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const resetAll = () => {
    setCompleted({});
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const doneCount = Object.values(completed).filter(Boolean).length;
  const totalCount = INCIDENT_CHECKLIST_TEMPLATE.length;
  const progressPct = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Step-by-Step Incident Response Checklist
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Follow this protocol in sequence to prevent further financial loss and safeguard accounts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {doneCount} / {totalCount} completed
          </span>
          {doneCount > 0 && (
            <button
              onClick={resetAll}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 w-full bg-muted/60 rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-5 space-y-3">
        {INCIDENT_CHECKLIST_TEMPLATE.map((item, idx) => {
          const isDone = !!completed[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer transition ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/5 text-muted-foreground"
                  : "border-border/80 bg-background/50 hover:border-primary/40 hover:bg-card/70"
              }`}
            >
              <button
                type="button"
                className="mt-0.5 flex-shrink-0 text-primary"
                aria-label={isDone ? "Mark incomplete" : "Mark complete"}
              >
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {idx + 1}. {item.title}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      item.urgency === "immediate"
                        ? "bg-destructive/15 text-destructive"
                        : item.urgency === "high"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.urgency}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
