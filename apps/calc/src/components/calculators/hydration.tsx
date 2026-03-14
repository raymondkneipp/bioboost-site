import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateHydration } from "@/calculators/hydration/hydration"
import type { HydrationResult } from "@/calculators/hydration/types"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg } from "@/units/mass"
import { z } from "zod"
// z is used for activityMinBaseSchema

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const activityMinBaseSchema = z.number({ message: "Enter minutes" }).int().min(0).max(480)
function activityMinValidator({ value }: { value: EmptyNumber }) {
  if (value === "" || value === undefined) return undefined
  const result = activityMinBaseSchema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

const baseFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, activityMinutes: "" as EmptyNumber },
})

interface FormProps { onResult: (r: HydrationResult) => void }

function MetricForm({ onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => {
      const mins = numVal(value.activityMinutes)
      onResult(calculateHydration({ weightKg: numVal(value.weight), activityMinutes: Number.isNaN(mins) ? 0 : mins }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" />}
      </form.Field>
      <form.Field name="activityMinutes" validators={{ onChange: activityMinValidator }}>
        {(field) => <NumberField field={field} label="Exercise duration (optional)" unit="min" placeholder="0" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialForm({ onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => {
      const mins = numVal(value.activityMinutes)
      onResult(calculateHydration({ weightKg: poundsToKg(numVal(value.weight)), activityMinutes: Number.isNaN(mins) ? 0 : mins }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" />}
      </form.Field>
      <form.Field name="activityMinutes" validators={{ onChange: activityMinValidator }}>
        {(field) => <NumberField field={field} label="Exercise duration (optional)" unit="min" placeholder="0" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

export function HydrationCalculator() {
  const { units } = useSettings()
  const [result, setResult] = React.useState<HydrationResult | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => { setResult(null) }, [units])

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      {units === "metric"
        ? <MetricForm key="metric" onResult={setResult} />
        : <ImperialForm key="imperial" onResult={setResult} />
      }

      {result && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.dailyLiters}</span>
            <span className="text-xs text-muted-foreground">liters/day</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.dailyOz}</span>
            <span className="text-xs text-muted-foreground">oz/day</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.glasses8oz}</span>
            <span className="text-xs text-muted-foreground">8 oz glasses</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">+{result.exerciseLiters}</span>
            <span className="text-xs text-muted-foreground">L for exercise</span>
          </div>
        </div>
      )}
    </div>
  )
}
