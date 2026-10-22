import { useState } from "react";
import type { FamilyMember } from "@/lib/family-store";

const EMOJIS = ["👵", "👴", "👩", "👨", "👧", "👦", "🧒", "🧓", "🧑"];

export function AddFamilyMemberModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (m: Omit<FamilyMember, "id" | "on">) => void;
}) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("👵");
  const [relation, setRelation] = useState("");
  const [phone, setPhone] = useState("");
  const [guardian, setGuardian] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide a name.");
      return;
    }
    if (!relation.trim()) {
      setError("Please specify their daily device usage or relationship.");
      return;
    }

    onAdd({
      name: name.trim(),
      emoji,
      relation: relation.trim(),
      phone: phone.trim() || undefined,
      guardian,
    });

    setName("");
    setRelation("");
    setPhone("");
    setGuardian(false);
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl animate-rise">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <h3 className="font-display text-lg font-bold">Add Protected Family Member</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="font-mono text-xs uppercase text-muted-foreground">Select Avatar</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-2xl p-2 rounded-xl transition-transform ${emoji === e ? "bg-primary/20 scale-110 border border-primary" : "hover:bg-secondary"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-mono text-xs uppercase text-muted-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grandma, Uncle Dave"
              className="mt-1 w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase text-muted-foreground">Usage / Habits</label>
            <input
              type="text"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              placeholder="e.g. Uses WhatsApp & pays electricity bills"
              className="mt-1 w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase text-muted-foreground">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="mt-1 w-full rounded-xl border border-input bg-background/80 px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={guardian}
              onChange={(e) => setGuardian(e.target.checked)}
              className="rounded border-input text-primary focus:ring-ring"
            />
            <span className="text-xs text-foreground font-medium">Designate as Emergency Family Guardian</span>
          </label>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-xs font-medium hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
