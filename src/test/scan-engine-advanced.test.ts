import { describe, expect, it } from "vitest";
import { inspectHomoglyphs } from "@/lib/heuristics/homoglyphs";
import { analyzeDeepUrl } from "@/lib/heuristics/url-analyzer";
import { validateUpiPayload } from "@/lib/heuristics/upi-validator";
import { analyzeLink, analyzeQr } from "@/lib/scan-engine";

describe("Advanced Heuristics Engine", () => {
  describe("Homoglyphs & IDN Spoofing", () => {
    it("detects cyrillic characters mimicking Latin letters in bank domains", () => {
      // 'а' in 'sbі' or 'pаytm' with cyrillic 'а' (U+0430)
      const fakeDomain = "sb\u0430-bank.com";
      const result = inspectHomoglyphs(fakeDomain);
      expect(result.hasHomoglyphs).toBe(true);
      expect(result.detectedCharacters).toContain("а");
      expect(result.riskNote).toBeDefined();
    });

    it("detects punycode encoded domains", () => {
      const punycodeDomain = "xn--sbi-bank-99a.com";
      const result = inspectHomoglyphs(punycodeDomain);
      expect(result.hasPunycode).toBe(true);
      expect(result.riskNote).toContain("Punycode");
    });

    it("detects zero-width evasion characters in text", () => {
      const textWithHidden = "Verify\u200Bkyc\u200Cnow";
      const result = inspectHomoglyphs(textWithHidden);
      expect(result.hasZeroWidthChars).toBe(true);
      expect(result.riskNote).toContain("Zero-width");
    });
  });

  describe("Deep URL Inspection", () => {
    it("flags obfuscated decimal and hex IP addresses", () => {
      const decimalUrl = "http://2130706433/login";
      const result = analyzeDeepUrl(decimalUrl);
      expect(result.isObfuscatedIp).toBe(true);
      expect(result.anomalies.some((a) => a.rule.includes("Obfuscated IP"))).toBe(true);
    });

    it("flags authority credentials deception in URL", () => {
      const spoofUrl = "https://onlinesbi.sbi@evil-site.com/verify";
      const result = analyzeDeepUrl(spoofUrl);
      expect(result.hasCredentials).toBe(true);
      expect(result.anomalies.some((a) => a.rule.includes("Credential/Authority deception"))).toBe(true);
    });

    it("flags dangerous script protocols", () => {
      const scriptUrl = "javascript:alert(document.cookie)";
      const result = analyzeDeepUrl(scriptUrl);
      expect(result.hasDangerousScheme).toBe(true);
    });
  });

  describe("UPI Payload & NPCI Verification", () => {
    it("identifies valid mainstream UPI providers", () => {
      const result = validateUpiPayload("merchant@okaxis", "Retail Store", "upi://pay?pa=merchant@okaxis&pn=Retail%20Store");
      expect(result.isValidVpa).toBe(true);
      expect(result.isRegisteredProvider).toBe(true);
      expect(result.isCollectRequest).toBe(false);
    });

    it("flags deceptive collect requests", () => {
      const collectQr = "upi://pay?pa=cashback@ybl&pn=SBI%20Collect%20Cashback&mode=02";
      const result = validateUpiPayload("cashback@ybl", "SBI Collect Cashback", collectQr);
      expect(result.isCollectRequest).toBe(true);
      expect(result.riskPenalty).toBeGreaterThan(40);
    });
  });

  describe("End-to-End Link & QR Scanning with Heuristics", () => {
    it("gives a high risk score to homoglyph and obfuscated IP links", () => {
      const scan1 = analyzeLink("http://2130706433/sbi/kyc");
      expect(scan1.level).toBe("high");
      expect(scan1.reasons.some((r) => r.includes("IP"))).toBe(true);
    });

    it("flags QR codes with suspicious collect mode", () => {
      const qrScan = analyzeQr("upi://pay?pa=random8849201@unknown&pn=SBI%20Reward%20Collect&mode=02");
      expect(qrScan.level).toBe("high");
      expect(qrScan.reasons.some((r) => r.includes("Collect request") || r.includes("DEBIT"))).toBe(true);
    });
  });
});
