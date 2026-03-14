import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateWeightLossTimeline } from "@/calculators/weight-loss-timeline/weightLossTimeline"
import type { WeightLossTimelineResult } from "@/calculators/weight-loss-timeline/types"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg } from "@/units/mass"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type DeficitMode = "kcal-per-week" | "kcal-per-day"

const deficitSchema = z.number({ message: "Enter a valid deficit" }).positive().max(14000)

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { current: "" as EmptyNumber, target: "" as EmptyNumber, deficit: "" as EmptyNumber },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { current: "" as EmptyNumber, target: "" as EmptyNumber, deficit: "" as EmptyNumber },
})

interface FormProps {
  deficitMode: DeficitMode
  onResult: (r: WeightLossTimelineResult) => void
}

function MetricForm({ deficitMode, onResult }: FormProps) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      const weekly = deficitMode === "kcal-per-day" ? numVal(value.deficit) * 7 : numVal(value.deficit)
      onResult(calculateWeightLossTimeline({ currentWeightKg: numVal(value.current), targetWeightKg: numVal(value.target), weeklyDeficitKcal: weekly }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="current" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Current weight" />}
      </form.Field>
      <form.Field name="target" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Target weight" />}
      </form.Field>
      <form.Field name="deficit" validators={{ onChange: deficitSchema }}>
        {(field) => <NumberField field={field} label="Calorie deficit" unit={deficitMode === "kcal-per-day" ? "kcal/day" : "kcal/week"} placeholder={deficitMode === "kcal-per-day" ? "500" : "3500"} inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate Timeline</Button>
    </form>
  )
}

function ImperialForm({ deficitMode, onResult }: FormProps) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const weekly = deficitMode === "kcal-per-day" ? numVal(value.deficit) * 7 : numVal(value.deficit)
      onResult(calculateWeightLossTimeline({ currentWeightKg: poundsToKg(numVal(value.current)), targetWeightKg: poundsToKg(numVal(value.target)), weeklyDeficitKcal: weekly }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="current" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Current weight" />}
      </form.Field>
      <form.Field name="target" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Target weight" />}
      </form.Field>
      <form.Field name="deficit" validators={{ onChange: deficitSchema }}>
        {(field) => <NumberField field={field} label="Calorie deficit" unit={deficitMode === "kcal-per-day" ? "kcal/day" : "kcal/week"} placeholder={deficitMode === "kcal-per-day" ? "500" : "3500"} inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate Timeline</Button>
    </form>
  )
}

export function WeightLossTimelineCalculator() {
  const { units } = useSettings()
  const [deficitMode, setDeficitMode] = React.useState<DeficitMode>("kcal-per-day")
  const [result, setResult] = React.useState<WeightLossTimelineResult | null>(null)

  React.useEffect(() => { setResult(null) }, [units])

  const formProps: FormProps = { deficitMode, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Deficit input"
        name="deficit-mode"
        value={deficitMode}
        options={[
          { value: "kcal-per-day", label: "Daily deficit (kcal/day)" },
          { value: "kcal-per-week", label: "Weekly deficit (kcal/week)" },
        ]}
        onChange={setDeficitMode}
      />

      {units === "metric"
        ? <MetricForm key="metric" {...formProps} />
        : <ImperialForm key="imperial" {...formProps} />
      }

      {result && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
              <span className="text-xl font-bold tabular-nums">{result.weightToLoseKg} kg</span>
              <span className="text-xs text-muted-foreground">to lose</span>
            </div>
            <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
              <span className="text-xl font-bold tabular-nums">{result.weeks} wks</span>
              <span className="text-xs text-muted-foreground">estimated</span>
            </div>
            <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
              <span className="text-xl font-bold tabular-nums">{result.months} mo</span>
              <span className="text-xs text-muted-foreground">estimated</span>
            </div>
            <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center col-span-2 sm:col-span-1">
              <span className="text-lg font-bold">{result.targetDate}</span>
              <span className="text-xs text-muted-foreground">target date</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
