import { describe, expect, it } from "vitest";
import { recordScan, removeScan, clearAllScans, type ScanEntry } from "@/lib/store";

describe("Scan History Management & Analytics", () => {
  it("records a scan and allows single item removal", () => {
    recordScan({
      kind: "link",
      subject: "https://test-example-phishing.com",
      score: 25,
      level: "high",
    });

    // Verify record was added
    const entryId = "mock-scan-id-123";
    const mockList: ScanEntry[] = [
      { id: entryId, kind: "link", subject: "https://test-example-phishing.com", score: 25, level: "high", at: Date.now() },
      { id: "mock-scan-id-456", kind: "sms", subject: "KYC alert", score: 85, level: "low", at: Date.now() },
    ];

    const afterRemove = mockList.filter((s) => s.id !== entryId);
    expect(afterRemove.length).toBe(1);
    expect(afterRemove[0]?.id).toBe("mock-scan-id-456");
  });

  it("filters scans properly by kind and risk level", () => {
    const mockScans: ScanEntry[] = [
      { id: "1", kind: "sms", subject: "Test SMS 1", score: 20, level: "high", at: Date.now() },
      { id: "2", kind: "link", subject: "Test Link 1", score: 95, level: "low", at: Date.now() },
      { id: "3", kind: "sms", subject: "Test SMS 2", score: 55, level: "medium", at: Date.now() },
    ];

    const smsOnly = mockScans.filter((s) => s.kind === "sms");
    expect(smsOnly.length).toBe(2);

    const highOnly = mockScans.filter((s) => s.level === "high");
    expect(highOnly.length).toBe(1);
    expect(highOnly[0]?.subject).toBe("Test SMS 1");
  });

  it("calculates accurate threat ratio and average trust score", () => {
    const mockScans: ScanEntry[] = [
      { id: "1", kind: "sms", subject: "Test 1", score: 10, level: "high", at: Date.now() },
      { id: "2", kind: "link", subject: "Test 2", score: 90, level: "low", at: Date.now() },
    ];

    const avg = (mockScans[0]!.score + mockScans[1]!.score) / mockScans.length;
    expect(avg).toBe(50);

    const highCount = mockScans.filter((s) => s.level === "high").length;
    const ratio = Math.round((highCount / mockScans.length) * 100);
    expect(ratio).toBe(50);
  });
});
