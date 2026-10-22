import { describe, expect, it } from "vitest";
import { parseQrPayload } from "@/lib/qr-payload-parser";

describe("QR Payload Multi-Format Parser", () => {
  it("decodes UPI payment QRs accurately", () => {
    const raw = "upi://pay?pa=store@okaxis&pn=Daily%20Mart&am=250.00&cu=INR";
    const parsed = parseQrPayload(raw);
    expect(parsed.type).toBe("upi");
    expect(parsed.label).toBe("UPI Payment Request");
    expect(parsed.isSecuritySensitive).toBe(true);
    expect(parsed.details.some((d) => d.value.includes("Daily Mart"))).toBe(true);
    expect(parsed.details.some((d) => d.value.includes("250.00"))).toBe(true);
  });

  it("decodes open unencrypted Wi-Fi QRs and flags security risk", () => {
    const raw = "WIFI:T:nopass;S:Airport_Free_WiFi;;";
    const parsed = parseQrPayload(raw);
    expect(parsed.type).toBe("wifi");
    expect(parsed.isSecuritySensitive).toBe(true);
    expect(parsed.summary).toContain("Airport_Free_WiFi");
    expect(parsed.securityRecommendation).toContain("unencrypted");
  });

  it("decodes WPA2 encrypted Wi-Fi QRs", () => {
    const raw = "WIFI:T:WPA;S:Home_Network;P:SecretPassword123;;";
    const parsed = parseQrPayload(raw);
    expect(parsed.type).toBe("wifi");
    expect(parsed.isSecuritySensitive).toBe(false);
    expect(parsed.details.some((d) => d.value === "Password Protected")).toBe(true);
  });

  it("decodes vCard contact payloads", () => {
    const raw = "BEGIN:VCARD\r\nVERSION:3.0\r\nFN:John Doe\r\nTEL:+919876543210\r\nEMAIL:john@example.com\r\nEND:VCARD";
    const parsed = parseQrPayload(raw);
    expect(parsed.type).toBe("vcard");
    expect(parsed.details.some((d) => d.value === "John Doe")).toBe(true);
    expect(parsed.details.some((d) => d.value === "+919876543210")).toBe(true);
  });

  it("decodes URL QRs and checks HTTPS", () => {
    const raw = "http://fake-banking-portal.net/login";
    const parsed = parseQrPayload(raw);
    expect(parsed.type).toBe("url");
    expect(parsed.isSecuritySensitive).toBe(true);
    expect(parsed.details.some((d) => d.value.includes("Unencrypted"))).toBe(true);
  });
});
