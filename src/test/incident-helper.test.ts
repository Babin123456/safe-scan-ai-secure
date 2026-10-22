import { describe, it, expect } from "vitest";
import {
  EMERGENCY_HOTLINES,
  INCIDENT_CHECKLIST_TEMPLATE,
  generateFormalComplaintText,
} from "@/lib/incident-helper";

describe("Emergency Incident Response & Hotline Helper", () => {
  it("includes critical national helplines including 1930 and Chakshu", () => {
    const govHelplines = EMERGENCY_HOTLINES.filter((h) => h.category === "government");
    expect(govHelplines.some((h) => h.phone === "1930")).toBe(true);
    expect(govHelplines.some((h) => h.id === "chakshu-telecom")).toBe(true);
  });

  it("contains verified major banks and UPI platforms", () => {
    const sbi = EMERGENCY_HOTLINES.find((h) => h.id === "sbi");
    expect(sbi).toBeDefined();
    expect(sbi?.phone).toBe("1800111109");

    const phonepe = EMERGENCY_HOTLINES.find((h) => h.id === "phonepe");
    expect(phonepe).toBeDefined();
    expect(phonepe?.category).toBe("wallet_upi");
  });

  it("provides structured checklist items covering immediate and follow-up actions", () => {
    expect(INCIDENT_CHECKLIST_TEMPLATE.length).toBeGreaterThanOrEqual(5);
    const immediate = INCIDENT_CHECKLIST_TEMPLATE.filter((c) => c.urgency === "immediate");
    expect(immediate.length).toBeGreaterThanOrEqual(2);
  });

  it("generates a formatted legal complaint draft with financial details", () => {
    const draft = generateFormalComplaintText({
      victimName: "Rohan Verma",
      victimPhone: "+919876543210",
      incidentDateTime: "2026-10-22T10:30",
      scamCategory: "UPI Payment Fraud / QR Collect Scam",
      financialLossAmount: "25000",
      bankName: "State Bank of India",
      transactionRef: "UTR493021948210",
      suspectDetails: "+919123456789 / fraudster@upi",
      incidentDescription: "Scammer prompted to scan a receive-money QR code which executed an unauthorized debit.",
    });

    expect(draft).toContain("FORMAL CYBER CRIME COMPLAINT DRAFT");
    expect(draft).toContain("Rohan Verma");
    expect(draft).toContain("+919876543210");
    expect(draft).toContain("INR 25000");
    expect(draft).toContain("UTR493021948210");
    expect(draft).toContain("fraudster@upi");
    expect(draft).toContain("Information Technology Act");
  });

  it("generates an attempted-scam draft when no financial loss occurred", () => {
    const draft = generateFormalComplaintText({
      victimName: "Pooja Sharma",
      victimPhone: "+919811122233",
      incidentDateTime: "2026-10-22T12:00",
      scamCategory: "Phishing Link / Credential Harvesting",
      suspectDetails: "http://fake-sbi-online.com",
      incidentDescription: "Received fake SMS warning account closure with a phishing link. No credentials entered.",
    });

    expect(draft).toContain("No direct funds transferred / Attempted Phishing only");
    expect(draft).toContain("http://fake-sbi-online.com");
  });
});
