import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import {
  getFamilyMembers,
  saveFamilyMembers,
  getAlertLogs,
  recordAlertLog,
  generateWhatsAppAlertUrl,
  type FamilyMember,
  type EmergencyAlertLog,
} from "@/lib/family-store";
import { AddFamilyMemberModal } from "@/components/family/AddFamilyMemberModal";
import { EmergencyAlertHistory } from "@/components/family/EmergencyAlertHistory";

export const Route = createFileRoute("/family")({
  head: () => ({
    meta: [
      { title: "Family Protection Mode — SafeScan AI" },
      {
        name: "description",
        content: "Shield parents and grandparents, and send an emergency alert to a guardian when a high-risk scam appears.",
      },
      { property: "og:title", content: "Family Protection Mode — SafeScan AI" },
      {
        property: "og:description",
        content: "Turn on protection for the people most targeted by scams and alert a guardian instantly.",
      },
    ],
  }),
  component: Family,
});

function Family() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [alerts, setAlerts] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertLogs, setAlertLogs] = useState<EmergencyAlertLog[]>([]);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  useEffect(() => {
    setMembers(getFamilyMembers());
    setAlertLogs(getAlertLogs());
  }, []);

  function toggleProtection(id: string) {
    const updated = members.map((m) => (m.id === id ? { ...m, on: !m.on } : m));
    setMembers(updated);
    saveFamilyMembers(updated);
  }

  function handleAddMember(newMember: Omit<FamilyMember, "id" | "on">) {
    const created: FamilyMember = {
      ...newMember,
      id: `mem-${Date.now()}`,
      on: true,
    };
    const updated = [...members, created];
    setMembers(updated);
    saveFamilyMembers(updated);
  }

  function removeMember(id: string) {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    saveFamilyMembers(updated);
  }

  const guardian = members.find((m) => m.guardian);
  const protectedElders = members.filter((m) => !m.guardian);

  function triggerEmergencyAlert() {
    const elder = protectedElders[0]?.name ?? "Family Member";
    const threat = "Fake SBI KYC link detected (Score: 18/100)";
    const newLog = recordAlertLog({
      memberName: elder,
      threatHeadline: threat,
      status: "dispatched",
    });
    setAlertLogs((prev) => [newLog, ...prev]);
    const url = generateWhatsAppAlertUrl(guardian?.phone, elder, threat);
    setWhatsappUrl(url);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHeader
        icon="👨‍👩‍👧"
        title="Family Protection"
        subtitle="Scams hit elders hardest. Keep protection on for them and let a trusted guardian know the moment something high risk appears."
      />

      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-primary px-4 py-2 font-mono text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          + Add Family Member
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <section className="space-y-4">
          {members.map((m) => (
            <div key={m.id} className="glass flex items-center justify-between gap-4 rounded-2xl p-5">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{m.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-lg font-semibold">{m.name}</p>
                    {m.guardian && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[10px] text-primary font-bold">
                        GUARDIAN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.relation}</p>
                  {m.phone && <p className="font-mono text-[11px] text-muted-foreground">{m.phone}</p>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleProtection(m.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                    m.on ? "border-safe/50 text-safe" : "border-border text-muted-foreground"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${m.on ? "bg-safe" : "bg-muted-foreground"}`} />
                  {m.on ? "PROTECTION ON" : "OFF"}
                </button>

                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(m.id)}
                    className="p-1.5 text-xs text-muted-foreground hover:text-danger"
                    title={`Remove ${m.name}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="glass flex items-center justify-between gap-4 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📱</span>
              <div>
                <p className="font-display text-lg font-semibold">Emergency Alerts</p>
                <p className="text-xs text-muted-foreground">Notify the guardian on every high-risk detection</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAlerts((a) => !a)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs transition-colors ${
                alerts ? "border-safe/50 text-safe" : "border-border text-muted-foreground"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${alerts ? "bg-safe" : "bg-muted-foreground"}`} />
              {alerts ? "ON" : "OFF"}
            </button>
          </div>

          <EmergencyAlertHistory logs={alertLogs} />
        </section>

        <aside className="glass h-fit rounded-2xl border-danger/40 p-6 space-y-4">
          <p className="font-mono text-sm font-semibold text-danger">🚨 HIGH-RISK SCAM DETECTED</p>
          <p className="text-sm text-muted-foreground">
            A fake SBI KYC link was opened on a protected device. An emergency alert can be dispatched to your
            selected family guardian{guardian ? ` (${guardian.name})` : ""}.
          </p>

          <button
            type="button"
            disabled={!alerts}
            onClick={triggerEmergencyAlert}
            className="w-full rounded-xl bg-danger py-3 font-semibold text-destructive-foreground disabled:opacity-40 transition-transform active:scale-95"
          >
            DISPATCH GUARDIAN ALERT
          </button>

          {whatsappUrl && (
            <div className="rounded-xl border border-safe/40 bg-safe/10 p-3 text-center space-y-2">
              <p className="text-xs text-safe font-semibold">✓ Alert recorded in emergency log.</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block rounded-lg bg-safe px-3 py-1.5 font-mono text-xs font-bold text-black hover:opacity-90 transition-opacity"
              >
                📲 Open in WhatsApp & Warn {guardian?.name ?? "Guardian"}
              </a>
            </div>
          )}

          {!alerts && (
            <p className="text-center text-xs text-warn">Emergency alerts are switched off.</p>
          )}
        </aside>
      </div>

      <AddFamilyMemberModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
}
