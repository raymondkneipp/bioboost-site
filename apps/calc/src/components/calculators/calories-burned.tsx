import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { ACTIVITIES, calculateCaloriesBurned } from "@/calculators/calories-burned/caloriesBurned"
import type { ActivityLevel, CaloriesBurnedResult } from "@/calculators/calories-burned/types"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg } from "@/units/mass"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const durationSchema = z.number({ message: "Enter duration" }).int().positive().max(600)

const baseFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    weight: "" as EmptyNumber,
    duration: "" as EmptyNumber,
  },
})

const activityOptions = (Object.keys(ACTIVITIES) as ActivityLevel[]).map((key) => ({
  value: key,
  label: ACTIVITIES[key].label,
}))

interface FormProps {
  activity: ActivityLevel
  onResult: (r: CaloriesBurnedResult) => void
}

function MetricForm({ activity, onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => {
      onResult(calculateCaloriesBurned({ activity, weightKg: numVal(value.weight), durationMinutes: numVal(value.duration) }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" />}
      </form.Field>
      <form.Field name="duration" validators={{ onChange: durationSchema }}>
        {(field) => <NumberField field={field} label="Duration" unit="min" placeholder="30" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialForm({ activity, onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => {
      onResult(calculateCaloriesBurned({ activity, weightKg: poundsToKg(numVal(value.weight)), durationMinutes: numVal(value.duration) }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" />}
      </form.Field>
      <form.Field name="duration" validators={{ onChange: durationSchema }}>
        {(field) => <NumberField field={field} label="Duration" unit="min" placeholder="30" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

export function CaloriesBurnedCalculator() {
  const { units } = useSettings()
  const [activity, setActivity] = React.useState<ActivityLevel>("walking-moderate")
  const [result, setResult] = React.useState<CaloriesBurnedResult | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => { setResult(null) }, [units])

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="calories-activity" className="text-sm font-medium">Activity</label>
        <select
          id="calories-activity"
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={activity}
          onChange={(e) => { setActivity(e.target.value as ActivityLevel); setResult(null) }}
        >
          {activityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {units === "metric"
        ? <MetricForm key={`metric-${activity}`} activity={activity} onResult={setResult} />
        : <ImperialForm key={`imperial-${activity}`} activity={activity} onResult={setResult} />
      }

      {result && (
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-3xl font-bold tabular-nums">{result.kcal.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">kcal burned</span>
        </div>
      )}
    </div>
  )
}
