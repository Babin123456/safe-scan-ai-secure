import { useNetworkStatus } from "@/hooks/use-network-status";
import { WifiOff, Wifi, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export function OfflineStatusBanner() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (!isOnline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="sticky top-0 z-50 flex items-center justify-between gap-3 bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
          <span>
            <strong>Offline Mode Active:</strong> Internet connection lost.
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-amber-300">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Local Rule-Based Heuristic Scanners 100% Functional</span>
        </div>
      </div>
    );
  }

  if (showReconnected) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-1.5 text-xs text-emerald-300 backdrop-blur-md transition-all"
      >
        <Wifi className="h-3.5 w-3.5 text-emerald-400" />
        <span>Back online — Cloud AI opinions and live community reports re-enabled.</span>
      </div>
    );
  }

  return null;
}
