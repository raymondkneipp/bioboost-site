import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { calculateSleepCycle } from "@/calculators/sleep-cycle/sleepCycle"
import type { SleepCycleResult } from "@/calculators/sleep-cycle/types"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const sleepFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    wakeHour: "" as EmptyNumber,
    wakeMinute: "" as EmptyNumber,
  },
})

const hourSchema = z.number({ message: "Enter an hour" }).int().min(0).max(23)
const minuteSchema = z.number({ message: "Enter minutes" }).int().min(0).max(59)

const cycleHours: Record<number, string> = {
  6: "9 hrs",
  5: "7.5 hrs",
  4: "6 hrs",
  3: "4.5 hrs",
}

export function SleepCycleCalculator() {
  const [result, setResult] = React.useState<SleepCycleResult | null>(null)

  const form = useForm({
    ...sleepFormOptions,
    onSubmit: ({ value }) => {
      setResult(calculateSleepCycle({
        wakeHour: numVal(value.wakeHour),
        wakeMinute: numVal(value.wakeMinute),
      }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <div className="flex gap-3">
          <form.Field name="wakeHour" validators={{ onChange: hourSchema }}>
            {(field) => (
              <NumberField field={field} label="Wake Hour (0–23)" placeholder="7" inputMode="numeric" integer />
            )}
          </form.Field>
          <form.Field name="wakeMinute" validators={{ onChange: minuteSchema }}>
            {(field) => (
              <NumberField field={field} label="Wake Minute" placeholder="0" inputMode="numeric" integer />
            )}
          </form.Field>
        </div>

        <Button type="submit" className="self-start">Calculate Bedtimes</Button>
      </form>

      {result && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Go to sleep at one of these times to wake up refreshed:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {result.bedtimes.map((b) => (
              <div key={b.cycles} className="flex flex-col items-center rounded-lg bg-muted/50 px-3 py-3 text-center">
                <span className="text-xl font-bold tabular-nums">{b.label}</span>
                <span className="text-xs text-muted-foreground">{cycleHours[b.cycles]} · {b.cycles} cycles</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Times include ~14 min to fall asleep.</p>
        </div>
      )}
    </div>
  )
}
