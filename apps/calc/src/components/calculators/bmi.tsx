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

interface BmiResult {
  bmi: number
  category: string
  variant: "default" | "secondary" | "destructive" | "outline"
}

function calcBmi(weightKg: number, heightCm: number): BmiResult {
  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const rounded = Math.round(bmi * 10) / 10

  let category: string
  let variant: BmiResult["variant"]

  if (bmi < 18.5) {
    category = "Underweight"
    variant = "secondary"
  } else if (bmi < 25) {
    category = "Normal"
    variant = "default"
  } else if (bmi < 30) {
    category = "Overweight"
    variant = "outline"
  } else if (bmi < 35) {
    category = "Obese Class I"
    variant = "destructive"
  } else if (bmi < 40) {
    category = "Obese Class II"
    variant = "destructive"
  } else {
    category = "Obese Class III"
    variant = "destructive"
  }

  return { bmi: rounded, category, variant }
}

function MetricForm({ onResult }: { onResult: (r: BmiResult) => void }) {
  const form = useMetricWeightHeightForm((weightKg, heightCm) => {
    onResult(calcBmi(weightKg, heightCm))
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

function ImperialForm({ onResult }: { onResult: (r: BmiResult) => void }) {
  const form = useImperialWeightHeightForm((weightKg, heightCm) => {
    onResult(calcBmi(weightKg, heightCm))
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
  const [result, setResult] = React.useState<BmiResult | null>(null)

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
          <Badge variant={result.variant}>{result.category}</Badge>
        </div>
      )}
    </div>
  )
}
