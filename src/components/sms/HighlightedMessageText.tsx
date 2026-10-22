import { tokenizeMessageForHighlight } from "@/lib/heuristics/hinglish-patterns";

interface HighlightedMessageTextProps {
  text: string;
}

export function HighlightedMessageText({ text }: HighlightedMessageTextProps) {
  const tokens = tokenizeMessageForHighlight(text);

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4 font-mono text-sm leading-relaxed">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans font-semibold mb-2">
        Interactive Threat Token Breakdown:
      </div>
      <div className="flex flex-wrap gap-x-1 gap-y-1.5 items-center">
        {tokens.map((token, idx) => {
          if (token.type === "threat") {
            return (
              <span
                key={idx}
                title={token.note}
                className="rounded bg-destructive/15 px-1.5 py-0.5 text-destructive font-semibold border border-destructive/30"
              >
                {token.text}
              </span>
            );
          }
          if (token.type === "lure") {
            return (
              <span
                key={idx}
                title={token.note}
                className="rounded bg-amber-500/15 px-1.5 py-0.5 text-amber-500 font-semibold border border-amber-500/30"
              >
                {token.text}
              </span>
            );
          }
          if (token.type === "link") {
            return (
              <span
                key={idx}
                title={token.note}
                className="rounded bg-primary/15 px-1.5 py-0.5 text-primary font-semibold border border-primary/30 underline decoration-dotted"
              >
                {token.text}
              </span>
            );
          }
          return <span key={idx}>{token.text}</span>;
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-4 text-[11px] font-sans text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-destructive" /> Threat / Pressure language
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Bait / Keyword lure
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" /> Unverified web link / APK
        </span>
      </div>
    </div>
  );
}
