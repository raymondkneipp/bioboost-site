import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateTrainingMax } from "@/calculators/training-max/trainingMax"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { kgToPounds, poundsToKg } from "@/units/mass"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const pctSchema = z.number({ message: "Enter a percentage" }).min(50).max(100)

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, percentage: 90 as EmptyNumber },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, percentage: 90 as EmptyNumber },
})

interface ResultState {
  trainingMaxKg: number
  percentage: number
  isImperial: boolean
}

function MetricForm({ onResult }: { onResult: (r: ResultState) => void }) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      const { trainingMaxKg, percentage } = calculateTrainingMax({ oneRepMaxKg: numVal(value.weight), percentage: numVal(value.percentage) })
      onResult({ trainingMaxKg, percentage, isImperial: false })
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="1 Rep Max" />}
      </form.Field>
      <form.Field name="percentage" validators={{ onChange: pctSchema }}>
        {(field) => <NumberField field={field} label="Percentage" unit="%" placeholder="90" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialForm({ onResult }: { onResult: (r: ResultState) => void }) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const { trainingMaxKg, percentage } = calculateTrainingMax({ oneRepMaxKg: poundsToKg(numVal(value.weight)), percentage: numVal(value.percentage) })
      onResult({ trainingMaxKg, percentage, isImperial: true })
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="1 Rep Max" />}
      </form.Field>
      <form.Field name="percentage" validators={{ onChange: pctSchema }}>
        {(field) => <NumberField field={field} label="Percentage" unit="%" placeholder="90" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

export function TrainingMaxCalculator() {
  const { units } = useSettings()
  const [result, setResult] = React.useState<ResultState | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => { setResult(null) }, [units])

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      {units === "metric"
        ? <MetricForm key="metric" onResult={setResult} />
        : <ImperialForm key="imperial" onResult={setResult} />
      }

      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">
              {result.isImperial ? Math.round(kgToPounds(result.trainingMaxKg)) : result.trainingMaxKg} {result.isImperial ? "lb" : "kg"}
            </span>
            <span className="text-xs text-muted-foreground">Training max</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.percentage}%</span>
            <span className="text-xs text-muted-foreground">of 1RM</span>
          </div>
        </div>
      )}
    </div>
  )
}
