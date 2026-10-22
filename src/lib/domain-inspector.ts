/**
 * Domain Intelligence & Cloud Hosting Phishing Analyzer
 * Inspects effective second-level domains (SLD), multi-part TLDs (e.g. .co.in, .gov.in),
 * free app/cloud hosting abuse (pages.dev, vercel.app, firebaseapp.com, etc.),
 * and deceptive subdomains masquerading as trusted institutions.
 */

export const FREE_HOSTING_PROVIDERS = new Set([
  "pages.dev",
  "vercel.app",
  "web.app",
  "firebaseapp.com",
  "netlify.app",
  "glitch.me",
  "github.io",
  "gitlab.io",
  "render.com",
  "ngrok-free.app",
  "loca.lt",
  "surge.sh",
  "onrender.com",
]);

export const MULTI_PART_TLDS = new Set([
  "co.in",
  "net.in",
  "org.in",
  "gov.in",
  "ac.in",
  "edu.in",
  "res.in",
  "com.au",
  "net.au",
  "co.uk",
  "org.uk",
  "ac.uk",
  "gov.uk",
]);

export type DomainClassification =
  | "official_bank"
  | "free_hosting_abuse"
  | "suspicious_tld"
  | "deceptive_subdomain"
  | "standard";

export type DomainAnalysis = {
  hostname: string;
  rootDomain: string;
  subdomain: string;
  tld: string;
  classification: DomainClassification;
  isCloudHost: boolean;
  warnings: string[];
  riskPenalty: number;
};

export function parseDomainParts(hostname: string): { rootDomain: string; subdomain: string; tld: string } {
  const clean = hostname.trim().toLowerCase().replace(/^www\./, "");
  const parts = clean.split(".");

  if (parts.length <= 2) {
    return {
      rootDomain: clean,
      subdomain: "",
      tld: parts[parts.length - 1] ?? "",
    };
  }

  // Check 2-part TLD like .co.in or .gov.in
  const lastTwo = parts.slice(-2).join(".");
  if (MULTI_PART_TLDS.has(lastTwo)) {
    const root = parts.slice(-3).join(".");
    const sub = parts.slice(0, -3).join(".");
    return {
      rootDomain: root,
      subdomain: sub,
      tld: lastTwo,
    };
  }

  const root = parts.slice(-2).join(".");
  const sub = parts.slice(0, -2).join(".");
  return {
    rootDomain: root,
    subdomain: sub,
    tld: parts[parts.length - 1] ?? "",
  };
}

export function inspectDomain(rawInput: string): DomainAnalysis {
  let hostname = rawInput.trim().toLowerCase();
  try {
    const url = new URL(/^https?:\/\//i.test(hostname) ? hostname : `https://${hostname}`);
    hostname = url.hostname;
  } catch {
    hostname = hostname.replace(/^https?:\/\//i, "").split(/[/?#:]/)[0] ?? "";
  }

  const { rootDomain, subdomain, tld } = parseDomainParts(hostname);
  const warnings: string[] = [];
  let riskPenalty = 0;
  let classification: DomainClassification = "standard";

  // Check free hosting platforms
  const isCloudHost = FREE_HOSTING_PROVIDERS.has(rootDomain);
  const banks = ["sbi", "hdfc", "icici", "axis", "kotak", "pnb", "bob", "canara", "paytm", "phonepe"];
  const hasBankKeyword = banks.some((b) => hostname.includes(b));

  if (isCloudHost) {
    if (hasBankKeyword) {
      classification = "free_hosting_abuse";
      warnings.push(`Phishing hosting abuse: Legitimate banking brand used on a free cloud domain (${rootDomain})`);
      riskPenalty += 60;
    } else {
      warnings.push(`Hosted on a free public web application platform (${rootDomain})`);
      riskPenalty += 15;
    }
  }

  // Deceptive subdomains: e.g. sbi.co.in.scamdomain.com
  if (subdomain) {
    const subParts = subdomain.split(".");
    const impersonatesBankSubdomain = subParts.some((p) => banks.includes(p) || p.includes("login") || p.includes("kyc"));
    if (impersonatesBankSubdomain && !hostname.endsWith("onlinesbi.sbi") && !hostname.endsWith("sbi.co.in")) {
      if (classification === "standard") classification = "deceptive_subdomain";
      warnings.push("Subdomain impersonation: Trusted banking/KYC keywords placed in subdomain prefix to deceive users");
      riskPenalty += 45;
    }
  }

  // Suspicious low-cost TLDs
  const badTlds = ["xyz", "top", "icu", "click", "buzz", "rest", "cfd", "zip", "ru", "tk", "ml"];
  if (badTlds.includes(tld)) {
    if (classification === "standard") classification = "suspicious_tld";
    warnings.push(`Low-reputation top level domain (.${tld}) frequently leveraged for ephemeral phishing`);
    riskPenalty += 25;
  }

  return {
    hostname,
    rootDomain,
    subdomain,
    tld,
    classification,
    isCloudHost,
    warnings,
    riskPenalty,
  };
}
