export function QrViewfinder({
  onFlipCamera,
  onClose,
}: {
  onFlipCamera?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border-2 border-primary/50 bg-black/80 shadow-2xl">
      {/* Corner targeting brackets */}
      <div className="pointer-events-none absolute inset-0 p-5">
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-0 h-6 w-6 border-l-4 border-t-4 border-primary rounded-tl-md" />
          <div className="absolute right-0 top-0 h-6 w-6 border-r-4 border-t-4 border-primary rounded-tr-md" />
          <div className="absolute bottom-0 left-0 h-6 w-6 border-b-4 border-l-4 border-primary rounded-bl-md" />
          <div className="absolute bottom-0 right-0 h-6 w-6 border-b-4 border-r-4 border-primary rounded-br-md" />

          {/* Animated laser scan line */}
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        </div>
      </div>

      {/* Floating control buttons */}
      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-3 z-20">
        {onFlipCamera && (
          <button
            type="button"
            onClick={onFlipCamera}
            className="rounded-full bg-secondary/80 backdrop-blur-md px-3 py-1.5 font-mono text-xs text-foreground hover:bg-secondary transition-colors"
            title="Switch front/back camera"
          >
            🔄 Flip Camera
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-destructive/80 backdrop-blur-md px-4 py-1.5 font-mono text-xs text-destructive-foreground hover:bg-destructive transition-colors"
        >
          ✕ Cancel
        </button>
      </div>

      <div className="absolute top-4 inset-x-0 text-center pointer-events-none">
        <span className="rounded-full bg-background/70 backdrop-blur px-3 py-1 font-mono text-[11px] text-muted-foreground">
          Align QR code within the frame
        </span>
      </div>
    </div>
  );
}
