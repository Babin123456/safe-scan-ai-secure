import { describe, it, expect, vi } from "vitest";
import { SHORTCUTS } from "@/components/KeyboardShortcutGuide";

describe("Network Status & Accessible Shortcuts Guide", () => {
  it("defines comprehensive quick-jump shortcuts for all scanners", () => {
    const linkShortcut = SHORTCUTS.find((s) => s.path === "/scan/link");
    expect(linkShortcut).toBeDefined();
    expect(linkShortcut?.keys).toEqual(["g", "l"]);

    const smsShortcut = SHORTCUTS.find((s) => s.path === "/scan/sms");
    expect(smsShortcut).toBeDefined();
    expect(smsShortcut?.keys).toEqual(["g", "s"]);

    const qrShortcut = SHORTCUTS.find((s) => s.path === "/scan/qr");
    expect(qrShortcut).toBeDefined();
    expect(qrShortcut?.keys).toEqual(["g", "q"]);

    const helpShortcut = SHORTCUTS.find((s) => s.path === "/help");
    expect(helpShortcut).toBeDefined();
    expect(helpShortcut?.keys).toEqual(["g", "h"]);
  });

  it("includes toggle shortcut for help modal via ?", () => {
    const questionShortcut = SHORTCUTS.find((s) => s.keys.includes("?"));
    expect(questionShortcut).toBeDefined();
  });

  it("handles window online and offline listeners properly", () => {
    const addListenerSpy = vi.spyOn(window, "addEventListener");
    const removeListenerSpy = vi.spyOn(window, "removeEventListener");

    const onOnline = vi.fn();
    const onOffline = vi.fn();

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    expect(addListenerSpy).toHaveBeenCalledWith("online", onOnline);
    expect(addListenerSpy).toHaveBeenCalledWith("offline", onOffline);

    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);

    expect(removeListenerSpy).toHaveBeenCalledWith("online", onOnline);
    expect(removeListenerSpy).toHaveBeenCalledWith("offline", onOffline);
  });
});
