import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { EmergencyBankHotlines } from "@/components/help/EmergencyBankHotlines";
import { IncidentResponseChecklist } from "@/components/help/IncidentResponseChecklist";
import { ComplaintDraftGenerator } from "@/components/help/ComplaintDraftGenerator";
import { ShieldAlert, ListChecks, PhoneCall, FileText } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Emergency Scam Help & Cyber Crime Hotlines — SafeScan AI" },
      {
        name: "description",
        content:
          "Clicked a scam link or paid a fraudster? Access official 24x7 bank fraud helplines (1930), step-by-step incident checklist, and complaint draft generator.",
      },
      { property: "og:title", content: "Emergency Scam Help & Cyber Crime Hotlines — SafeScan AI" },
      {
        property: "og:description",
        content: "Immediate guidance, bank hotlines, and cyber crime filing tools if you fell for a digital scam.",
      },
    ],
  }),
  component: Help,
});

const TIPS = [
  "Banks never ask for OTP, PIN, password or KYC updates via unverified SMS links.",
  "You NEVER need to enter your UPI PIN or scan a QR code to receive money.",
  "Check the exact domain spelling before submitting credentials (e.g. onlinesbi vs onlinesbi-kyc.top).",
  "Urgency cues ('account suspended within 2 hours', 'electricity cut tonight') are the #1 hallmark of cyber fraud.",
  "If money was debited fraudulently, dial 1930 within the 'Golden Hour' (under 2 hours) to halt the interstate banking trail.",
];

function Help() {
  const [activeTab, setActiveTab] = useState<"checklist" | "hotlines" | "complaint">("checklist");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHeader
        icon="🚨"
        title="Emergency Scam Response & Cyber Support"
        subtitle="Shared an OTP, clicked a phishing link, or sent money to a scammer? Act immediately within the golden hour to minimize harm."
      />

      {/* Quick Action Navigation */}
      <div className="mt-8 flex gap-2 border-b border-border pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab("checklist")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "checklist"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
          }`}
        >
          <ListChecks className="h-4 w-4" />
          Incident Checklist
        </button>
        <button
          onClick={() => setActiveTab("hotlines")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "hotlines"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          Bank & UPI Helplines
        </button>
        <button
          onClick={() => setActiveTab("complaint")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "complaint"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
          }`}
        >
          <FileText className="h-4 w-4" />
          Complaint Letter Generator
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "checklist" && <IncidentResponseChecklist />}
        {activeTab === "hotlines" && <EmergencyBankHotlines />}
        {activeTab === "complaint" && <ComplaintDraftGenerator />}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-emerald-500" />
            Essential Anti-Scam Rules
          </h2>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground leading-relaxed">
            {TIPS.map((t, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass rounded-2xl p-6 text-xs text-muted-foreground">
          <h2 className="font-display text-lg font-semibold text-foreground">Data Privacy Guarantee</h2>
          <p className="mt-3 leading-relaxed">
            All incident response helpers, emergency drafts, and checklist states are processed and stored locally on your device using browser storage. SafeScan does not record your private financial information or personal details on any cloud server.
          </p>
          <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] leading-relaxed">
            <strong>Urgent Reminder:</strong> SafeScan is a digital safety analysis utility, not a law enforcement agency. To freeze stolen funds, always dial <strong>1930</strong> or notify your bank directly.
          </div>
        </section>
      </div>
    </div>
  );
}
