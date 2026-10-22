import { describe, expect, it } from "vitest";
import { generateWhatsAppAlertUrl, recordAlertLog, type FamilyMember } from "@/lib/family-store";

describe("Family Protection & Emergency Alert System", () => {
  it("formats emergency WhatsApp message link with phone number and details", () => {
    const url = generateWhatsAppAlertUrl("+919876543210", "Grandmother", "Fake KYC Banking Scam");
    expect(url).toContain("https://api.whatsapp.com/send");
    expect(url).toContain("phone=919876543210");
    expect(url).toContain("Grandmother");
    expect(url).toContain("Fake%20KYC%20Banking%20Scam");
  });

  it("formats broadcast link without phone if guardian phone is missing", () => {
    const url = generateWhatsAppAlertUrl(undefined, "Grandpa", "Fake Electricity Bill");
    expect(url).toContain("https://api.whatsapp.com/send?text=");
    expect(url).not.toContain("phone=");
  });

  it("creates a properly structured emergency alert record", () => {
    const log = recordAlertLog({
      memberName: "Grandmother",
      threatHeadline: "Fake SBI Phishing Link",
      status: "dispatched",
    });

    expect(log.id).toBeDefined();
    expect(log.memberName).toBe("Grandmother");
    expect(log.status).toBe("dispatched");
    expect(log.timestamp).toBeGreaterThan(0);
  });

  it("handles multiple family members and guardian assignment", () => {
    const members: FamilyMember[] = [
      { id: "1", name: "Elder", emoji: "👵", relation: "Target", on: true, guardian: false },
      { id: "2", name: "Daughter", emoji: "👩", relation: "Guardian", on: true, guardian: true },
    ];

    const guardian = members.find((m) => m.guardian);
    expect(guardian).toBeDefined();
    expect(guardian?.name).toBe("Daughter");

    const protectedMembers = members.filter((m) => !m.guardian);
    expect(protectedMembers.length).toBe(1);
    expect(protectedMembers[0]?.name).toBe("Elder");
  });
});
