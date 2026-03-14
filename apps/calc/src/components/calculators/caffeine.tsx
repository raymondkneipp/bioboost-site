import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateCaffeine } from "@/calculators/caffeine/caffeine"
import type { CaffeineResult } from "@/calculators/caffeine/types"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg } from "@/units/mass"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const baseFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber },
})

interface FormProps { onResult: (r: CaffeineResult) => void }

function MetricForm({ onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => onResult(calculateCaffeine({ weightKg: numVal(value.weight) })),
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialForm({ onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => onResult(calculateCaffeine({ weightKg: poundsToKg(numVal(value.weight)) })),
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

export function CaffeineCalculator() {
  const { units } = useSettings()
  const [result, setResult] = React.useState<CaffeineResult | null>(null)

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
            <span className="text-2xl font-bold tabular-nums">{result.maxMgPerDay}</span>
            <span className="text-xs text-muted-foreground">mg/day max</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.maxPreWorkoutMg}</span>
            <span className="text-xs text-muted-foreground">mg pre-workout</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.coffeeCupsEquivalent}</span>
            <span className="text-xs text-muted-foreground">cups of coffee</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.espressoShotsEquivalent}</span>
            <span className="text-xs text-muted-foreground">espresso shots</span>
          </div>
        </div>
      )}
    </div>
  )
}
