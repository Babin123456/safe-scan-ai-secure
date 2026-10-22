import { useState } from "react";
import { ComplaintFormData, generateFormalComplaintText } from "@/lib/incident-helper";
import { FileText, Copy, Check, Sparkles, ExternalLink } from "lucide-react";

export function ComplaintDraftGenerator() {
  const [formData, setFormData] = useState<ComplaintFormData>({
    victimName: "",
    victimPhone: "",
    incidentDateTime: new Date().toISOString().slice(0, 16),
    scamCategory: "Phishing Link / Credential Harvesting",
    financialLossAmount: "",
    bankName: "",
    transactionRef: "",
    suspectDetails: "",
    incidentDescription: "",
  });

  const [copied, setCopied] = useState(false);

  const draft = generateFormalComplaintText(formData);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Cyber Crime Portal Complaint Generator
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quickly prepare an official, structured FIR complaint draft ready to paste into cybercrime.gov.in.
          </p>
        </div>
        <a
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition"
        >
          Open Portal <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Form Inputs */}
        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-medium text-foreground block mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={formData.victimName}
                onChange={(e) => setFormData({ ...formData, victimName: e.target.value })}
                className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Your Contact Phone</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.victimPhone}
                onChange={(e) => setFormData({ ...formData, victimPhone: e.target.value })}
                className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="font-medium text-foreground block mb-1">Scam Category</label>
              <select
                value={formData.scamCategory}
                onChange={(e) => setFormData({ ...formData, scamCategory: e.target.value })}
                className="w-full rounded-lg border border-border bg-card/60 px-2.5 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="Phishing Link / Credential Harvesting">Phishing Link / Fake Website</option>
                <option value="UPI Payment Fraud / QR Collect Scam">UPI Fraud / QR Collect Request</option>
                <option value="Fake Bank KYC / PAN Update SMS">Fake Bank KYC SMS</option>
                <option value="Electricity / Utility Bill Disconnection Scam">Electricity Bill Disconnection</option>
                <option value="Part-time Job / Telegram Task Fraud">Telegram Task / Work Scam</option>
                <option value="Courier / Customs Impersonation">Courier / Customs Scam</option>
                <option value="Impersonation / Sextortion / Blackmail">Impersonation / Blackmail</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Incident Date & Time</label>
              <input
                type="datetime-local"
                value={formData.incidentDateTime}
                onChange={(e) => setFormData({ ...formData, incidentDateTime: e.target.value })}
                className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="font-medium text-foreground block mb-1">Financial Loss (₹)</label>
              <input
                type="number"
                placeholder="0"
                value={formData.financialLossAmount}
                onChange={(e) => setFormData({ ...formData, financialLossAmount: e.target.value })}
                className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">Bank / App Used</label>
              <input
                type="text"
                placeholder="e.g. SBI, PhonePe"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-foreground block mb-1">UTR / Ref No.</label>
              <input
                type="text"
                placeholder="12-digit UTR"
                value={formData.transactionRef}
                onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-medium text-foreground block mb-1">
              Suspect Details (Phone, UPI ID, Malicious URL)
            </label>
            <input
              type="text"
              placeholder="e.g. +91 9988776655, scammer@upi, http://sbi-kyc-secure.tk"
              value={formData.suspectDetails}
              onChange={(e) => setFormData({ ...formData, suspectDetails: e.target.value })}
              className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-foreground block mb-1">Incident Summary</label>
            <textarea
              rows={3}
              placeholder="Describe what occurred step-by-step (e.g. received an SMS claiming electricity cut, clicked link, entered details...)"
              value={formData.incidentDescription}
              onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
              className="w-full rounded-lg border border-border bg-card/60 px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Live Draft Preview */}
        <div className="flex flex-col rounded-xl border border-border bg-card/40 p-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Generated Complaint Document
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy Complaint Text"}
            </button>
          </div>
          <pre className="mt-3 flex-1 overflow-auto rounded-lg bg-background/80 p-3 text-[11px] font-mono leading-relaxed text-muted-foreground whitespace-pre-wrap select-all">
            {draft}
          </pre>
        </div>
      </div>
    </div>
  );
}
