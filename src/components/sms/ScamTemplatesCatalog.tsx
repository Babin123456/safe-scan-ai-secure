import { Zap, AlertOctagon, Briefcase, Truck, Landmark } from "lucide-react";

export type SampleScamTemplate = {
  id: string;
  title: string;
  category: string;
  icon: typeof Zap;
  message: string;
};

export const TRENDING_SCAM_TEMPLATES: SampleScamTemplate[] = [
  {
    id: "electricity-cut",
    title: "Electricity Power Disconnection",
    category: "Utility Fraud",
    icon: Zap,
    message:
      "Dear Customer, your electricity line will be disconnected tonight at 9:30 PM from the power office because your previous month bill was not updated. Please immediately contact our power officer at 9876543210. Bijli cut ho jayega.",
  },
  {
    id: "fake-challan",
    title: "Traffic Police E-Challan Notice",
    category: "Government Impersonation",
    icon: AlertOctagon,
    message:
      "Traffic Police Notice: Vehicle MH-02-CB-1234 has a pending unpaid challan of Rs. 1500. Court summon will be issued if not cleared today. Click to pay and download receipt: http://echallan-parivahan-pay.vip",
  },
  {
    id: "telegram-task",
    title: "Part-time Job / YouTube Likes",
    category: "Employment Trap",
    icon: Briefcase,
    message:
      "Hello! I am HR manager from Global Media. Work from home opportunity: Earn Rs 2500 - 5000 daily just by liking YouTube videos and rating Google maps. Ghar baithe kamayein. Message our Telegram task coordinator: t.me/task_rewards_77",
  },
  {
    id: "post-hold",
    title: "India Post Parcel Hold",
    category: "Delivery Fraud",
    icon: Truck,
    message:
      "India Post: Your package #IN94820148IN cannot be delivered due to incomplete street address. Please update your address within 24 hours to prevent return: http://indiapost-address-update.cc/tracking",
  },
  {
    id: "apk-rewards",
    title: "Banking Reward APK Trap",
    category: "Malware Trap",
    icon: Landmark,
    message:
      "Dear SBI Customer, you have 9850 reward points worth Rs 4925 expiring today. Install our rewards app to claim cashback directly to your bank account: http://sbi-rewards-claim.xyz/sbi-rewards.apk",
  },
];

interface ScamTemplatesCatalogProps {
  onSelect: (text: string) => void;
}

export function ScamTemplatesCatalog({ onSelect }: ScamTemplatesCatalogProps) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display text-base font-semibold text-foreground">
            Trending Scam Templates in India
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Click any trending fraud pattern to load and test the multi-layered heuristic detector.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TRENDING_SCAM_TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelect(tmpl.message)}
              className="flex flex-col justify-between rounded-xl border border-border/80 bg-background/50 p-3.5 cursor-pointer transition hover:border-primary/50 hover:bg-card/70 group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-xs text-foreground group-hover:text-primary transition">
                    {tmpl.title}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {tmpl.message}
                </p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="font-medium px-1.5 py-0.5 rounded bg-muted">{tmpl.category}</span>
                <span className="text-primary font-semibold">Test template →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
