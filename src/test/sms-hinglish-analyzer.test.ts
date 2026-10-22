import { describe, it, expect } from "vitest";
import {
  detectHinglishScamPatterns,
  tokenizeMessageForHighlight,
} from "@/lib/heuristics/hinglish-patterns";
import { analyzeSms } from "@/lib/scan-engine";

describe("SMS Hinglish & Regional Scam Heuristics", () => {
  it("detects electricity disconnection scams with Hinglish phrasing", () => {
    const text =
      "Dear Customer, your electricity will be disconnected tonight at 9:30 PM. Bijli cut ho jayega. Call power officer immediately.";
    const matches = detectHinglishScamPatterns(text);
    expect(matches.length).toBeGreaterThan(0);
    const elecMatch = matches.find((m) => m.category === "electricity_disconnection");
    expect(elecMatch).toBeDefined();
    expect(elecMatch?.categoryLabel).toContain("Electricity Cut-Off Scam");
    expect(elecMatch?.severity).toBe("critical");
  });

  it("detects malicious APK download lures", () => {
    const text =
      "SBI Customer: Install our new rewards app to claim cash rewards: http://sbi-rewards.xyz/pm-yojana.apk";
    const matches = detectHinglishScamPatterns(text);
    const apkMatch = matches.find((m) => m.category === "apk_malware_lure");
    expect(apkMatch).toBeDefined();
  });

  it("detects fake e-challan traffic notices", () => {
    const text =
      "Traffic Police Notice: Vehicle MH02 has a pending unpaid challan of Rs 1000. Parivahan notice fine pay kare.";
    const matches = detectHinglishScamPatterns(text);
    const fineMatch = matches.find((m) => m.category === "fake_challan_fine");
    expect(fineMatch).toBeDefined();
  });

  it("detects work-from-home Telegram task scams", () => {
    const text =
      "Part time job offer: Ghar baithe earn 2000 daily with youtube like tasks. Telegram task coordinator.";
    const matches = detectHinglishScamPatterns(text);
    const jobMatch = matches.find((m) => m.category === "job_telegram_task");
    expect(jobMatch).toBeDefined();
  });

  it("tokenizes message into structured tokens for visual highlighting", () => {
    const text = "Your account is blocked. Update KYC at http://phish.top/login";
    const tokens = tokenizeMessageForHighlight(text);
    expect(tokens.some((t) => t.type === "threat")).toBe(true);
    expect(tokens.some((t) => t.type === "lure")).toBe(true);
    expect(tokens.some((t) => t.type === "link")).toBe(true);
  });

  it("evaluates a Hinglish scam message to HIGH risk in analyzeSms", () => {
    const result = analyzeSms(
      "Dear Customer, electricity cut ho jayega at 9:30 PM. Pay bill at http://bijli-bill-pay.xyz/bill"
    );
    expect(result.level).toBe("high");
    expect(result.score).toBeLessThanOrEqual(40);
    expect(result.reasons.some((r) => r.includes("🇮🇳"))).toBe(true);
    expect(result.meta?.some((m) => m.label === "Regional Scam Match")).toBe(true);
  });
});
