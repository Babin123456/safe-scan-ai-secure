import { describe, it, expect } from "vitest";
import { parseDisplayNameAndEmail, parseRawEmailHeaders } from "@/lib/email-header-parser";
import { analyzeEmail } from "@/lib/scan-engine";

describe("Email Header Parser & Display Name Spoof Inspector", () => {
  it("extracts display name and clean email address from formatted From line", () => {
    const raw = `"State Bank of India Online" <alerts@sbi-updates-kyc.com>`;
    const { displayName, email, domain } = parseDisplayNameAndEmail(raw);
    expect(displayName).toBe("State Bank of India Online");
    expect(email).toBe("alerts@sbi-updates-kyc.com");
    expect(domain).toBe("sbi-updates-kyc.com");
  });

  it("handles unquoted display names and bracketed emails", () => {
    const raw = `HDFC Bank Security <noreply@hdfcbank-alert.xyz>`;
    const { displayName, email, domain } = parseDisplayNameAndEmail(raw);
    expect(displayName).toBe("HDFC Bank Security");
    expect(email).toBe("noreply@hdfcbank-alert.xyz");
    expect(domain).toBe("hdfcbank-alert.xyz");
  });

  it("parses SPF, DKIM, DMARC verdicts and detects failure flags", () => {
    const rawHeaders = `From: "PayPal Account Security" <service@paypal-alerts.net>
Reply-To: phisher@gmail.com
Subject: Notice: Unauthorized payment attempt detected
Authentication-Results: mx.google.com;
 spf=fail (domain of service@paypal-alerts.net does not designate 1.2.3.4 as permitted sender);
 dkim=fail;
 dmarc=fail (p=REJECT)
Received: from mail.attacker.com (1.2.3.4) by mx.google.com with SMTP`;

    const parsed = parseRawEmailHeaders(rawHeaders);
    expect(parsed.fromAddress).toBe("service@paypal-alerts.net");
    expect(parsed.spfVerdict).toBe("fail");
    expect(parsed.dkimVerdict).toBe("fail");
    expect(parsed.dmarcVerdict).toBe("fail");
    expect(parsed.replyToAddress).toBe("phisher@gmail.com");
    expect(parsed.warnings.some((w) => w.includes("Reply-To Mismatch"))).toBe(true);
    expect(parsed.warnings.some((w) => w.includes("SPF Authentication Failed"))).toBe(true);
  });

  it("detects display name spoofing in analyzeEmail and penalizes trust score", () => {
    const fromLine = `"State Bank of India" <scamguy@random-domain.top>`;
    const body = "Please click here to update your KYC immediately: http://phish-link.cc/sbi";
    const result = analyzeEmail(fromLine, body);

    expect(result.level).toBe("high");
    expect(result.score).toBeLessThanOrEqual(35);
    expect(result.reasons.some((r) => r.includes("Deceptive Display Name"))).toBe(true);
    expect(result.meta?.some((m) => m.label === "Display Name")).toBe(true);
  });
});
