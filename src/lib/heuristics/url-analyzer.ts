/**
 * Deep URL Heuristic Analyzer
 * Inspects host patterns, decimal/hex IP representations, authentication prefixes,
 * and high-risk URL schemes.
 */

export type UrlAnomaly = {
  rule: string;
  severity: "high" | "medium" | "low";
  penalty: number;
};

export type DeepUrlReport = {
  anomalies: UrlAnomaly[];
  totalPenalty: number;
  isObfuscatedIp: boolean;
  hasCredentials: boolean;
  hasDangerousScheme: boolean;
  nonStandardPort?: number;
};

const DANGEROUS_SCHEMES = ["javascript:", "data:", "blob:", "file:", "vbscript:"];
const HIGH_RISK_PORTS = [81, 88, 808, 8080, 8443, 8888, 2082, 2083, 2086, 2087];

export function analyzeDeepUrl(rawUrl: string): DeepUrlReport {
  const anomalies: UrlAnomaly[] = [];
  const trimmed = rawUrl.trim();

  // Check dangerous protocol schemes
  const lower = trimmed.toLowerCase();
  const dangerousScheme = DANGEROUS_SCHEMES.find((s) => lower.startsWith(s));
  if (dangerousScheme) {
    anomalies.push({
      rule: `Dangerous URL protocol (${dangerousScheme}) can execute arbitrary code`,
      severity: "high",
      penalty: 70,
    });
  }

  // Check userinfo in URL (e.g. https://sbi.co.in@evil.com)
  const credentialsMatch = /^[a-z]+:\/\/[^/@]+@/i.test(trimmed);
  if (credentialsMatch) {
    anomalies.push({
      rule: "Credential/Authority deception: URL contains '@' character masking destination host",
      severity: "high",
      penalty: 60,
    });
  }

  // Raw host before URL parsing normalizes representations
  const rawHost = trimmed.replace(/^[a-z]+:\/\//i, "").split(/[/?#:]/)[0]?.toLowerCase() ?? "";

  // Parse hostname safely
  let host = rawHost;
  let port: number | undefined;
  try {
    const parsed = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
    host = parsed.hostname;
    if (parsed.port) {
      port = parseInt(parsed.port, 10);
    }
  } catch {
    host = rawHost;
  }

  // Check for decimal, hex, or octal encoded IPs (e.g., http://2130706433 or 0x7f.1)
  const isDecimalIp = /^\d{7,12}$/.test(rawHost);
  const isHexIp = /^0x[0-9a-f]+/i.test(rawHost);
  const isOctalIp = /^0[0-7]{3,}/.test(rawHost);
  const isObfuscatedIp = isDecimalIp || isHexIp || isOctalIp;

  if (isObfuscatedIp) {
    anomalies.push({
      rule: "Obfuscated IP representation detected designed to bypass firewall and security filters",
      severity: "high",
      penalty: 65,
    });
  }

  // Check non-standard web ports on financial/banking lures
  if (port && port !== 80 && port !== 443) {
    if (HIGH_RISK_PORTS.includes(port)) {
      anomalies.push({
        rule: `Non-standard web port (:${port}) commonly used on temporary malicious web servers`,
        severity: "medium",
        penalty: 25,
      });
    }
  }

  // Excessive consecutive subdomains
  const parts = host.split(".");
  if (parts.length > 5) {
    anomalies.push({
      rule: `Unusual subdomain nesting (${parts.length} levels) indicates dynamically generated phishing domain`,
      severity: "medium",
      penalty: 20,
    });
  }

  const totalPenalty = anomalies.reduce((acc, a) => acc + a.penalty, 0);

  return {
    anomalies,
    totalPenalty,
    isObfuscatedIp,
    hasCredentials: credentialsMatch,
    hasDangerousScheme: Boolean(dangerousScheme),
    nonStandardPort: port,
  };
}
