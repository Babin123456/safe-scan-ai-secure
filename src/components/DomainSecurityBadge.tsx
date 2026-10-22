import type { DomainClassification } from "@/lib/domain-inspector";

const BADGE_MAP: Record<
  DomainClassification,
  { label: string; icon: string; style: string; desc: string }
> = {
  official_bank: {
    label: "Official Banking Domain",
    icon: "🏦",
    style: "bg-safe/15 border-safe text-safe",
    desc: "Verified institutional domain belonging to a recognized financial entity.",
  },
  free_hosting_abuse: {
    label: "Cloud Hosting Abuse",
    icon: "☁️",
    style: "bg-danger/15 border-danger text-danger font-semibold",
    desc: "Free cloud platform used by attackers to publish temporary credential harvesting pages.",
  },
  deceptive_subdomain: {
    label: "Subdomain Masquerading",
    icon: "🎭",
    style: "bg-danger/15 border-danger text-danger",
    desc: "Subdomain designed to look like a trusted website while pointing to an untrusted root domain.",
  },
  suspicious_tld: {
    label: "High-Risk Disposable TLD",
    icon: "⚠️",
    style: "bg-warn/15 border-warn text-warn",
    desc: "Disposable low-cost top level domain with high scam correlation.",
  },
  standard: {
    label: "Standard Web Domain",
    icon: "🌐",
    style: "bg-secondary border-border text-muted-foreground",
    desc: "Standard registered domain without cloud hosting or subdomain spoofing markers.",
  },
};

export function DomainSecurityBadge({
  classification,
}: {
  classification: DomainClassification;
}) {
  const badge = BADGE_MAP[classification];

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs ${badge.style}`}>
      <span>{badge.icon}</span>
      <span>{badge.label}</span>
    </div>
  );
}
