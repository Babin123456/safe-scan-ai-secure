import { useState, useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { Command, X, Keyboard, ArrowRight } from "lucide-react";

export const SHORTCUTS = [
  { keys: ["g", "l"], description: "Jump to URL / Link Scanner", path: "/scan/link" },
  { keys: ["g", "s"], description: "Jump to SMS Scam Detector", path: "/scan/sms" },
  { keys: ["g", "m"], description: "Jump to Email Phishing Scanner", path: "/scan/mail" },
  { keys: ["g", "q"], description: "Jump to QR & UPI Scanner", path: "/scan/qr" },
  { keys: ["g", "d"], description: "Jump to Scan History Dashboard", path: "/dashboard" },
  { keys: ["g", "c"], description: "Jump to Community Scam Alerts", path: "/community" },
  { keys: ["g", "h"], description: "Jump to Emergency Help (1930)", path: "/help" },
  { keys: ["?"], description: "Open / Close this shortcut guide" },
];

export function KeyboardShortcutGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let pendingG = false;
    let timer: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape") {
        setIsOpen(false);
        pendingG = false;
        return;
      }

      if (e.key.toLowerCase() === "g") {
        pendingG = true;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          pendingG = false;
        }, 1200);
        return;
      }

      if (pendingG) {
        pendingG = false;
        const targetKey = e.key.toLowerCase();
        const found = SHORTCUTS.find(
          (s) => s.path && s.keys.length === 2 && s.keys[1] === targetKey
        );
        if (found && found.path) {
          e.preventDefault();
          setIsOpen(false);
          router.navigate({ to: found.path as any });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [router]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        title="Keyboard Shortcuts (?)"
        aria-label="Keyboard Shortcuts"
        className="fixed bottom-20 right-6 z-40 hidden md:flex items-center justify-center rounded-full bg-card/80 border border-border p-2.5 text-muted-foreground shadow-lg backdrop-blur-md hover:text-foreground hover:border-primary/50 transition"
      >
        <Keyboard className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts Guide"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Command className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-muted-foreground">
                Rapid navigation across SafeScan security modules
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            aria-label="Close shortcuts guide"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {SHORTCUTS.map((shortcut, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-xl bg-background/60 border border-border/60 px-3.5 py-2 text-xs"
            >
              <span className="text-muted-foreground">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((k, kIdx) => (
                  <kbd
                    key={kIdx}
                    className="rounded border border-border bg-muted/80 px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground shadow-xs"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono font-bold">Esc</kbd> to dismiss</span>
          <span>Tip: Type <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono font-bold">g</kbd> followed by key</span>
        </div>
      </div>
    </div>
  );
}
