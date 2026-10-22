import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ScanProgress } from "@/components/ScanProgress";
import { ScanResultView } from "@/components/ScanResultView";
import { analyzeEmail, DEMO, MAIL_CHECKS, type ScanResult } from "@/lib/scan-engine";
import { recordScan } from "@/lib/store";
import { parseDisplayNameAndEmail, parseRawEmailHeaders, type ParsedEmailHeaders } from "@/lib/email-header-parser";
import { DisplayNameSpoofAlert } from "@/components/mail/DisplayNameSpoofAlert";
import { EmailHeaderInspectionCard } from "@/components/mail/EmailHeaderInspectionCard";
import { Mail, ShieldAlert, Code2 } from "lucide-react";

export const Route = createFileRoute("/scan/mail")({
  head: () => ({
    meta: [
      { title: "Email Phishing Checker & Header Inspector — SafeScan AI" },
      {
        name: "description",
        content: "Paste a suspicious email, sender address or RFC headers to detect spoofed domains, failed SPF/DKIM, and phishing links.",
      },
      { property: "og:title", content: "Email Phishing Checker & Header Inspector — SafeScan AI" },
      {
        property: "og:description",
        content: "Verify sender domain authenticity, SPF/DKIM cryptographic headers, and embedded URLs.",
      },
    ],
  }),
  component: MailScanner,
});

const DEMO_RFC_HEADERS = `From: "State Bank of India Security" <support@sbi-kyc-verify.xyz>
To: victim@example.com
Subject: URGENT: Complete your PAN-Aadhaar linking
Return-Path: <bounce@attacker-server.ru>
Reply-To: scam-collector@yandex.com
Authentication-Results: mx.google.com;
 dkim=fail header.i=@sbi-kyc-verify.xyz;
 spf=fail (google.com: domain of support@sbi-kyc-verify.xyz does not designate 185.220.101.5 as permitted sender) smtp.mailfrom=support@sbi-kyc-verify.xyz;
 dmarc=fail (p=REJECT sp=REJECT dis=REJECT)
Received: from unknown (HELO relay.malicious.net) (185.220.101.5) by mx.google.com with ESMTPS`;

function MailScanner() {
  const [mode, setMode] = useState<"standard" | "headers">("standard");
  const [from, setFrom] = useState("");
  const [text, setText] = useState("");
  const [rawHeaders, setRawHeaders] = useState("");
  const [headerInspection, setHeaderInspection] = useState<ParsedEmailHeaders | null>(null);

  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  const parsedFrom = parseDisplayNameAndEmail(from);

  function start() {
    if (mode === "standard") {
      if (!from.trim()) {
        setError("Enter the sender's email address (the From line).");
        return;
      }
      if (text.trim().length < 10) {
        setError("Paste at least a few lines from the email body.");
        return;
      }
      setError("");
      setResult(analyzeEmail(from, text.slice(0, 4000)));
      setPhase("scanning");
    } else {
      if (!rawHeaders.trim() || rawHeaders.length < 20) {
        setError("Paste raw RFC headers from your email client (e.g. Gmail 'Show Original').");
        return;
      }
      setError("");
      const parsed = parseRawEmailHeaders(rawHeaders);
      setHeaderInspection(parsed);
      const emailBodyFallback = text.trim() || parsed.subject || "Subject: " + (parsed.subject ?? "Email header inspection");
      setResult(analyzeEmail(parsed.fromRaw || parsed.fromAddress, emailBodyFallback));
      setPhase("scanning");
    }
  }

  function finish() {
    setPhase("done");
    if (result) recordScan({ kind: "mail", subject: result.subject, score: result.score, level: result.level });
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <PageHeader
        icon="📧"
        title="Email Phishing & Header Inspector"
        subtitle="Paste the sender address, email body or raw RFC 5322 headers. We verify sender domain alignment, SPF/DKIM authentication, and phishing indicators."
      />

      {phase === "idle" && (
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Mode Switcher */}
          <div className="flex gap-2 rounded-xl bg-muted/60 p-1.5 border border-border">
            <button
              onClick={() => {
                setMode("standard");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                mode === "standard"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Standard Email Scan
            </button>
            <button
              onClick={() => {
                setMode("headers");
                setError("");
              }}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                mode === "headers"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Raw RFC Headers & SPF/DKIM
            </button>
          </div>

          <div className="glass rounded-2xl p-7">
            {mode === "standard" ? (
              <>
                <label htmlFor="from" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Sender (From line)
                </label>
                <input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="SBI Alerts <alerts@sbi-update-kyc.com>"
                  className="mt-2 w-full rounded-xl border border-input bg-background/60 px-4 py-3 font-mono text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />

                {parsedFrom.displayName && parsedFrom.domain && (
                  <div className="mt-3">
                    <DisplayNameSpoofAlert
                      displayName={parsedFrom.displayName}
                      actualEmail={parsedFrom.email}
                      domain={parsedFrom.domain}
                    />
                  </div>
                )}

                <label htmlFor="mail" className="mt-5 block font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Email body
                </label>
                <textarea
                  id="mail"
                  value={text}
                  rows={6}
                  maxLength={4000}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Dear Customer, your account will be blocked today... Verify here: https://..."
                  className="mt-2 w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-3 font-mono text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </>
            ) : (
              <>
                <label htmlFor="rfc" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Raw RFC 5322 Headers
                </label>
                <textarea
                  id="rfc"
                  value={rawHeaders}
                  rows={8}
                  onChange={(e) => setRawHeaders(e.target.value)}
                  placeholder="Paste complete message headers (Received, Authentication-Results, From, Reply-To)..."
                  className="mt-2 w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-3 font-mono text-xs outline-none transition-shadow focus:ring-2 focus:ring-ring"
                />
              </>
            )}

            {error && <p className="mt-2 text-xs text-danger">{error}</p>}

            <button
              onClick={start}
              className="glow-primary mt-4 w-full rounded-xl bg-primary py-3 font-semibold tracking-wide text-primary-foreground"
            >
              {mode === "standard" ? "ANALYZE EMAIL" : "INSPECT HEADERS & AUTH"}
            </button>

            <button
              onClick={() => {
                if (mode === "standard") {
                  setFrom(DEMO.mailFrom);
                  setText(DEMO.mail);
                } else {
                  setRawHeaders(DEMO_RFC_HEADERS);
                }
              }}
              className="mt-3 w-full rounded-xl border border-border py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {mode === "standard" ? "Load demo phishing email" : "Load sample spoofed headers"}
            </button>
          </div>
        </div>
      )}

      {phase === "scanning" && (
        <div className="mx-auto max-w-2xl">
          <ScanProgress
            title="Analyzing email authenticity..."
            checks={MAIL_CHECKS}
            failing={result && result.level !== "low" ? "Spoofed sender detected" : null}
            onDone={finish}
          />
        </div>
      )}

      {phase === "done" && result && (
        <div className="space-y-6">
          {headerInspection && <EmailHeaderInspectionCard headers={headerInspection} />}
          <ScanResultView
            result={result}
            onReset={() => {
              setPhase("idle");
              setResult(null);
              setHeaderInspection(null);
              setFrom("");
              setText("");
              setRawHeaders("");
            }}
          />
        </div>
      )}
    </div>
  );
}
