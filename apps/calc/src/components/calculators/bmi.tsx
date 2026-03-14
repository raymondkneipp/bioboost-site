import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { HeightCmField, HeightFtField, HeightInField } from "@/components/form/height-field"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import {
  heightCmSchema,
  heightFtSchema,
  heightInSchema,
  weightKgSchema,
  weightLbSchema,
} from "@/lib/validations"
import {
  useImperialWeightHeightForm,
  useMetricWeightHeightForm,
} from "@/hooks/use-body-form"
import { calculateBMI } from "@/calculators/bmi/bmi"
import type { BMICategory } from "@/calculators/bmi/types"
import { cmToMeters } from "@/units/length"

interface BmiDisplay {
  bmi: number
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
}

const categoryDisplay: Record<BMICategory, { label: string; variant: BmiDisplay["variant"] }> = {
  Underweight: { label: "Underweight", variant: "secondary" },
  Normal: { label: "Normal", variant: "default" },
  Overweight: { label: "Overweight", variant: "outline" },
  "Obese Class I": { label: "Obese Class I", variant: "destructive" },
  "Obese Class II": { label: "Obese Class II", variant: "destructive" },
  "Obese Class III": { label: "Obese Class III", variant: "destructive" },
}

function toBmiDisplay(weightKg: number, heightCm: number): BmiDisplay {
  const { bmi, category } = calculateBMI({ weightKg, heightM: cmToMeters(heightCm) })
  const { label, variant } = categoryDisplay[category]
  return { bmi, label, variant }
}

function MetricForm({ onResult }: { onResult: (r: BmiDisplay) => void }) {
  const form = useMetricWeightHeightForm((weightKg, heightCm) => {
    onResult(toBmiDisplay(weightKg, heightCm))
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" />}
      </form.Field>

      <form.Field name="height" validators={{ onChange: heightCmSchema }}>
        {(field) => <HeightCmField field={field} />}
      </form.Field>

      <Button type="submit" className="self-start">
        Calculate BMI
      </Button>
    </form>
  )
}

function ImperialForm({ onResult }: { onResult: (r: BmiDisplay) => void }) {
  const form = useImperialWeightHeightForm((weightKg, heightCm) => {
    onResult(toBmiDisplay(weightKg, heightCm))
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <form.Field name="weight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" />}
      </form.Field>

      <div className="flex gap-3">
        <form.Field name="heightFt" validators={{ onChange: heightFtSchema }}>
          {(field) => <HeightFtField field={field} />}
        </form.Field>

        <form.Field name="heightIn" validators={{ onChange: heightInSchema }}>
          {(field) => <HeightInField field={field} />}
        </form.Field>
      </div>

      <Button type="submit" className="self-start">
        Calculate BMI
      </Button>
    </form>
  )
}

export function BmiCalculator() {
  const { units } = useSettings()
  const [result, setResult] = React.useState<BmiDisplay | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => {
    setResult(null)
  }, [units])

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      {units === "metric" ? (
        <MetricForm key="metric" onResult={setResult} />
      ) : (
        <ImperialForm key="imperial" onResult={setResult} />
      )}

      {result && (
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-2xl font-bold tabular-nums">{result.bmi}</span>
          <Badge variant={result.variant}>{result.label}</Badge>
        </div>
      )}
    </div>
  )
}
