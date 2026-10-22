import { describe, expect, it } from "vitest";
import { inspectDomain, parseDomainParts } from "@/lib/domain-inspector";

describe("Domain Intelligence & Cloud Hosting Phishing Inspector", () => {
  it("correctly parses multi-part TLDs such as .co.in and .gov.in", () => {
    const parts1 = parseDomainParts("sbi.co.in");
    expect(parts1.rootDomain).toBe("sbi.co.in");
    expect(parts1.subdomain).toBe("");
    expect(parts1.tld).toBe("co.in");

    const parts2 = parseDomainParts("portal.banking.sbi.co.in");
    expect(parts2.rootDomain).toBe("sbi.co.in");
    expect(parts2.subdomain).toBe("portal.banking");
    expect(parts2.tld).toBe("co.in");
  });

  it("detects banking phishing hosted on free cloud app providers", () => {
    const cloudUrl = "https://sbi-kyc-verification.pages.dev/login";
    const report = inspectDomain(cloudUrl);
    expect(report.isCloudHost).toBe(true);
    expect(report.classification).toBe("free_hosting_abuse");
    expect(report.warnings.some((w) => w.includes("Phishing hosting abuse"))).toBe(true);
    expect(report.riskPenalty).toBeGreaterThanOrEqual(60);
  });

  it("detects deceptive subdomain stacking impersonating banks", () => {
    const deceptiveUrl = "https://onlinesbi.sbi.co.in.scamdomain.com";
    const report = inspectDomain(deceptiveUrl);
    expect(report.classification).toBe("deceptive_subdomain");
    expect(report.warnings.some((w) => w.includes("Subdomain impersonation"))).toBe(true);
    expect(report.rootDomain).toBe("scamdomain.com");
  });

  it("identifies high-risk disposable TLDs", () => {
    const disposableTldUrl = "https://secure-account-update.xyz";
    const report = inspectDomain(disposableTldUrl);
    expect(report.classification).toBe("suspicious_tld");
    expect(report.warnings.some((w) => w.includes("Low-reputation top level domain"))).toBe(true);
  });
});
