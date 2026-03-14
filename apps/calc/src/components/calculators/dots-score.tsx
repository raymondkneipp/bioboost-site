import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateDots } from "@/calculators/dots-score/dotsScore"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg } from "@/units/mass"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type Sex = "male" | "female"

const defaultValues = {
  bodyWeight: "" as EmptyNumber,
  squat: "" as EmptyNumber,
  bench: "" as EmptyNumber,
  deadlift: "" as EmptyNumber,
}

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues,
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues,
})

interface FormProps {
  sex: Sex
  onResult: (dots: number) => void
}

function MetricForm({ sex, onResult }: FormProps) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      const total = numVal(value.squat) + numVal(value.bench) + numVal(value.deadlift)
      const { dots } = calculateDots({ sex, bodyWeightKg: numVal(value.bodyWeight), liftedKg: total })
      onResult(dots)
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="bodyWeight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Body weight" />}
      </form.Field>
      <form.Field name="squat" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Squat" />}
      </form.Field>
      <form.Field name="bench" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Bench press" />}
      </form.Field>
      <form.Field name="deadlift" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Deadlift" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate DOTS</Button>
    </form>
  )
}

function ImperialForm({ sex, onResult }: FormProps) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const totalKg = poundsToKg(numVal(value.squat) + numVal(value.bench) + numVal(value.deadlift))
      const { dots } = calculateDots({ sex, bodyWeightKg: poundsToKg(numVal(value.bodyWeight)), liftedKg: totalKg })
      onResult(dots)
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="bodyWeight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Body weight" />}
      </form.Field>
      <form.Field name="squat" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Squat" />}
      </form.Field>
      <form.Field name="bench" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Bench press" />}
      </form.Field>
      <form.Field name="deadlift" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Deadlift" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate DOTS</Button>
    </form>
  )
}

export function DotsCalculator() {
  const { units } = useSettings()
  const [sex, setSex] = React.useState<Sex>("male")
  const [result, setResult] = React.useState<number | null>(null)

  React.useEffect(() => { setResult(null) }, [units])

  const formProps: FormProps = { sex, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Sex"
        name="dots-sex"
        value={sex}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
        onChange={setSex}
      />

      {units === "metric"
        ? <MetricForm key={`metric-${sex}`} {...formProps} />
        : <ImperialForm key={`imperial-${sex}`} {...formProps} />
      }

      {result !== null && (
        <div className="flex flex-col gap-1 rounded-lg bg-muted/50 px-4 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums">{result}</span>
            <span className="text-sm text-muted-foreground">DOTS points</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {result >= 500 ? "Elite" : result >= 400 ? "Advanced" : result >= 300 ? "Intermediate" : "Novice"}
          </p>
        </div>
      )}
    </div>
  )
}
