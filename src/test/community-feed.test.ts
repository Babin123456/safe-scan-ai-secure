import { describe, expect, it } from "vitest";
import { filterAndSortReports } from "@/lib/community-service";
import type { Report } from "@/lib/store";

describe("Community Scam Feed Filter & Confirmation", () => {
  const mockReports: Report[] = [
    {
      id: "r1",
      kind: "sms",
      title: "Fake SBI KYC SMS",
      description: "Account will be blocked today unless verified via link.",
      count: 240,
      level: "high",
      at: 1000,
    },
    {
      id: "r2",
      kind: "link",
      title: "Fake Electricity Bill Link",
      description: "Urgent power disconnection alert with malicious link.",
      count: 180,
      level: "high",
      at: 2000,
    },
    {
      id: "r3",
      kind: "qr",
      title: "Fake UPI Cashback QR",
      description: "Promises 500 cashback but sends a collect money request.",
      count: 50,
      level: "medium",
      at: 3000,
    },
  ];

  it("filters reports by keyword query in title and description", () => {
    const result = filterAndSortReports(mockReports, {
      query: "electricity",
      kind: "all",
      level: "all",
      sortBy: "popular",
    });
    expect(result.length).toBe(1);
    expect(result[0]?.id).toBe("r2");
  });

  it("filters reports by scanner type", () => {
    const result = filterAndSortReports(mockReports, {
      query: "",
      kind: "qr",
      level: "all",
      sortBy: "popular",
    });
    expect(result.length).toBe(1);
    expect(result[0]?.kind).toBe("qr");
  });

  it("filters reports by risk severity", () => {
    const result = filterAndSortReports(mockReports, {
      query: "",
      kind: "all",
      level: "medium",
      sortBy: "popular",
    });
    expect(result.length).toBe(1);
    expect(result[0]?.level).toBe("medium");
  });

  it("sorts by popularity vs newest timestamp", () => {
    const byPopularity = filterAndSortReports(mockReports, {
      query: "",
      kind: "all",
      level: "all",
      sortBy: "popular",
    });
    expect(byPopularity[0]?.count).toBe(240);

    const byRecent = filterAndSortReports(mockReports, {
      query: "",
      kind: "all",
      level: "all",
      sortBy: "recent",
    });
    expect(byRecent[0]?.at).toBe(3000);
  });
});
