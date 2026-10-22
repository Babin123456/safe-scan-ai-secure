import { useState } from "react";
import { EMERGENCY_HOTLINES } from "@/lib/incident-helper";
import { Phone, ExternalLink, Search, ShieldAlert, Building2, Wallet } from "lucide-react";

export function EmergencyBankHotlines() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "bank" | "wallet_upi" | "government">("all");

  const filtered = EMERGENCY_HOTLINES.filter((h) => {
    const matchesCategory = filter === "all" || h.category === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      h.name.toLowerCase().includes(q) ||
      h.phone.includes(q) ||
      h.notes.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Direct Bank & UPI Cyber Fraud Helplines
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified official 24x7 phone numbers to freeze accounts and halt unauthorized transfers.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bank name (e.g. SBI, HDFC, PhonePe)..."
            className="w-full rounded-xl border border-border bg-card/60 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(
            [
              { id: "all", label: "All" },
              { id: "government", label: "Helplines (1930)" },
              { id: "bank", label: "Banks" },
              { id: "wallet_upi", label: "UPI & Wallets" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                filter === t.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/50 p-4 transition hover:border-border hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm flex items-center gap-1.5">
                  {item.category === "government" && <ShieldAlert className="h-4 w-4 text-destructive" />}
                  {item.category === "bank" && <Building2 className="h-4 w-4 text-primary" />}
                  {item.category === "wallet_upi" && <Wallet className="h-4 w-4 text-amber-500" />}
                  {item.name}
                </span>
                <a
                  href={item.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  title="Official portal"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.notes}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 flex-wrap">
              <a
                href={`tel:${item.phone}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-semibold transition"
              >
                <Phone className="h-3.5 w-3.5" />
                {item.phone}
              </a>
              {item.altPhone && (
                <a
                  href={`tel:${item.altPhone}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline decoration-dotted"
                >
                  Alt: {item.altPhone}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
