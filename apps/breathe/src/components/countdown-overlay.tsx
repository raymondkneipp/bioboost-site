type CountdownOverlayProps = {
  value: number
}

export function CountdownOverlay({ value }: CountdownOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        <p className="text-lg text-muted-foreground font-medium">
          Empty your lungs
        </p>
        <div className="relative">
          <span
            key={value}
            className="text-8xl md:text-9xl font-black text-primary tabular-nums animate-in fade-in zoom-in duration-300"
          >
            {value}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Starting with inhale...</p>
      </div>
    </div>
  )
}
