import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateRepMax } from "@/calculators/rep-max/repMax"
import type { RepMaxResult } from "@/calculators/rep-max/types"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg, kgToPounds } from "@/units/mass"
import { round } from "@/math/round"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, reps: 1 },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, reps: 1 },
})

function MetricForm({ onResult }: { onResult: (r: RepMaxResult) => void }) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => onResult(calculateRepMax({ oneRepMaxKg: numVal(value.weight) })),
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="1 Rep Max" />}
      </form.Field>
      <Button type="submit" className="self-start">Generate Table</Button>
    </form>
  )
}

function ImperialForm({ onResult }: { onResult: (r: RepMaxResult & { isImperial: boolean }) => void }) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const result = calculateRepMax({ oneRepMaxKg: poundsToKg(numVal(value.weight)) })
      onResult({ ...result, isImperial: true })
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="1 Rep Max" />}
      </form.Field>
      <Button type="submit" className="self-start">Generate Table</Button>
    </form>
  )
}

export function RepMaxCalculator() {
  const { units } = useSettings()
  const [result, setResult] = React.useState<(RepMaxResult & { isImperial?: boolean }) | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => { setResult(null) }, [units])

  const isMetric = units === "metric"

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      {isMetric
        ? <MetricForm key="metric" onResult={(r) => setResult({ ...r, isImperial: false })} />
        : <ImperialForm key="imperial" onResult={setResult} />
      }

      {result && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left font-medium text-muted-foreground">%</th>
                <th className="py-2 text-right font-medium text-muted-foreground">
                  {result.isImperial ? "lb" : "kg"}
                </th>
              </tr>
            </thead>
            <tbody>
              {result.entries.map((entry) => (
                <tr key={entry.percentage} className="border-b border-border/50">
                  <td className="py-1.5 tabular-nums">{entry.percentage}%</td>
                  <td className="py-1.5 text-right font-medium tabular-nums">
                    {result.isImperial ? round(kgToPounds(entry.weightKg), 1) : entry.weightKg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
