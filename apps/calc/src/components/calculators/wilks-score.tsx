import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateWilks } from "@/calculators/wilks/wilks"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg } from "@/units/mass"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type Sex = "male" | "female"

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { bodyWeight: "" as EmptyNumber, lifted: "" as EmptyNumber },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { bodyWeight: "" as EmptyNumber, lifted: "" as EmptyNumber },
})

interface FormProps {
  sex: Sex
  onResult: (wilks: number) => void
}

function MetricForm({ sex, onResult }: FormProps) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      const { wilks } = calculateWilks({ sex, bodyWeightKg: numVal(value.bodyWeight), liftedKg: numVal(value.lifted) })
      onResult(wilks)
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="bodyWeight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Body weight" />}
      </form.Field>
      <form.Field name="lifted" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" label="Total lifted (S+B+D)" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate Wilks</Button>
    </form>
  )
}

function ImperialForm({ sex, onResult }: FormProps) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const { wilks } = calculateWilks({ sex, bodyWeightKg: poundsToKg(numVal(value.bodyWeight)), liftedKg: poundsToKg(numVal(value.lifted)) })
      onResult(wilks)
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="bodyWeight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Body weight" />}
      </form.Field>
      <form.Field name="lifted" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" label="Total lifted (S+B+D)" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate Wilks</Button>
    </form>
  )
}

export function WilksCalculator() {
  const { units } = useSettings()
  const [sex, setSex] = React.useState<Sex>("male")
  const [result, setResult] = React.useState<number | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => { setResult(null) }, [units])

  const formProps: FormProps = { sex, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Sex"
        name="wilks-sex"
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
            <span className="text-sm text-muted-foreground">Wilks points</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {result >= 500 ? "Elite" : result >= 400 ? "Advanced" : result >= 300 ? "Intermediate" : "Novice"}
          </p>
        </div>
      )}
    </div>
  )
}
