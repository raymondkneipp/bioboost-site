import { useNavigate } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { useState } from "react"
import { formatTime, getTotalTime } from "@/lib/programs"

export function CustomProgramForm() {
  const navigate = useNavigate()
  const [inhale, setInhale] = useState(4)
  const [holdIn, setHoldIn] = useState(4)
  const [exhale, setExhale] = useState(4)
  const [holdOut, setHoldOut] = useState(4)
  const [reps, setReps] = useState(4)

  const stages = { inhale, holdIn, exhale, holdOut }
  const totalTime = getTotalTime(stages, reps)

  function handleStart() {
    navigate({
      to: "/programs/$id",
      params: { id: "custom" },
      search: { inhale, holdIn, exhale, holdOut, reps },
    })
  }

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-card border">
      <div>
        <h3 className="text-lg font-bold">Custom Program</h3>
        <p className="text-sm text-muted-foreground">
          Create your own breathing pattern with custom timings.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TimingInput
          label="Inhale"
          value={inhale}
          onChange={setInhale}
          min={1}
          max={15}
        />
        <TimingInput
          label="Hold In"
          value={holdIn}
          onChange={setHoldIn}
          min={0}
          max={15}
        />
        <TimingInput
          label="Exhale"
          value={exhale}
          onChange={setExhale}
          min={1}
          max={15}
        />
        <TimingInput
          label="Hold Out"
          value={holdOut}
          onChange={setHoldOut}
          min={0}
          max={15}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="custom-reps">
          Repetitions
        </label>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setReps((r) => Math.max(1, r - 1))}
            disabled={reps <= 1}
          >
            -
          </Button>
          <span className="text-lg font-bold tabular-nums w-8 text-center">
            {reps}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setReps((r) => Math.min(50, r + 1))}
            disabled={reps >= 50}
          >
            +
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>
            Total time:{" "}
            <strong className="text-foreground">{formatTime(totalTime)}</strong>
          </span>
          <span>
            Pattern:{" "}
            <strong className="text-foreground font-mono">
              {inhale}-{holdIn > 0 ? `${holdIn}-` : ""}
              {exhale}
              {holdOut > 0 ? `-${holdOut}` : ""}
            </strong>
          </span>
        </div>

        <Button onClick={handleStart}>Start Custom</Button>
      </div>
    </div>
  )
}

function TimingInput({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          -
        </Button>
        <span className="text-lg font-bold tabular-nums w-6 text-center">
          {value}
        </span>
        <Button
          variant="outline"
          size="icon-xs"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </Button>
      </div>
      <span className="text-xs text-muted-foreground">{value}s</span>
    </div>
  )
}
