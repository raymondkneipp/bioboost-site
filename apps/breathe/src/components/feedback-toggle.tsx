import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { FeedbackMode } from "@/lib/feedback"

type FeedbackToggleProps = {
  mode: FeedbackMode
  onChange: (mode: FeedbackMode) => void
}

const MODES: { value: FeedbackMode; label: string; icon: React.ReactNode }[] = [
  {
    value: "sound",
    label: "Sound",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H2v6h4l5 4V5Z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
  },
  {
    value: "haptic",
    label: "Haptic",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
  {
    value: "none",
    label: "Off",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M11 5 6 9H2v6h4l5 4V5Z" />
        <line x1="22" x2="16" y1="9" y2="15" />
        <line x1="16" x2="22" y1="9" y2="15" />
      </svg>
    ),
  },
]

export function FeedbackToggle({ mode, onChange }: FeedbackToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
      {MODES.map(({ value, label, icon }) => (
        <Button
          key={value}
          variant={mode === value ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => onChange(value)}
          className={cn(
            "transition-all",
            mode === value && "bg-background shadow-sm",
          )}
          aria-label={label}
        >
          {icon}
        </Button>
      ))}
    </div>
  )
}
