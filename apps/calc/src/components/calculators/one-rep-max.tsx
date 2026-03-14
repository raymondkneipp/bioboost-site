import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateOneRepMax } from "@/calculators/one-rep-max/oneRepMax"
import type { OneRepMaxFormula } from "@/calculators/one-rep-max/types"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { kgToPounds, poundsToKg } from "@/units/mass"
import { z } from "zod"

type EmptyNumber = "" | number

function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const repsSchema = z
  .number({ message: "Enter a valid rep count" })
  .int("Reps must be a whole number")
  .min(1, "Reps must be at least 1")
  .max(30, "Reps must be 30 or under")

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    weight: "" as EmptyNumber,
    reps: "" as EmptyNumber,
  },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    weight: "" as EmptyNumber,
    reps: "" as EmptyNumber,
  },
})

const formulaLabels: Record<OneRepMaxFormula, string> = {
  epley: "Epley",
  brzycki: "Brzycki",
  lombardi: "Lombardi",
}

interface FormProps {
  formula: OneRepMaxFormula
  onResult: (oneRepMaxKg: number) => void
}

function MetricForm({ formula, onResult }: FormProps) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      const { oneRepMaxKg } = calculateOneRepMax({
        weightKg: numVal(value.weight),
        reps: numVal(value.reps),
        formula,
      })
      onResult(oneRepMaxKg)
    },
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

      <form.Field name="reps" validators={{ onChange: repsSchema }}>
        {(field) => (
          <NumberField
            field={field}
            label="Reps"
            placeholder="5"
            inputMode="numeric"
            integer
          />
        )}
      </form.Field>

      <Button type="submit" className="self-start">
        Calculate 1RM
      </Button>
    </form>
  )
}

function ImperialForm({ formula, onResult }: FormProps) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const { oneRepMaxKg } = calculateOneRepMax({
        weightKg: poundsToKg(numVal(value.weight)),
        reps: numVal(value.reps),
        formula,
      })
      onResult(oneRepMaxKg)
    },
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

      <form.Field name="reps" validators={{ onChange: repsSchema }}>
        {(field) => (
          <NumberField
            field={field}
            label="Reps"
            placeholder="5"
            inputMode="numeric"
            integer
          />
        )}
      </form.Field>

      <Button type="submit" className="self-start">
        Calculate 1RM
      </Button>
    </form>
  )
}

export function OneRepMaxCalculator() {
  const { units } = useSettings()
  const [formula, setFormula] = React.useState<OneRepMaxFormula>("epley")
  const [resultKg, setResultKg] = React.useState<number | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => {
    setResultKg(null)
  }, [units])

  const display =
    resultKg !== null
      ? units === "metric"
        ? { value: resultKg, unit: "kg" }
        : { value: Math.round(kgToPounds(resultKg) * 10) / 10, unit: "lb" }
      : null

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Formula"
        name="orm-formula"
        value={formula}
        options={(Object.keys(formulaLabels) as OneRepMaxFormula[]).map((f) => ({
          value: f,
          label: formulaLabels[f],
        }))}
        onChange={setFormula}
      />

      {units === "metric" ? (
        <MetricForm key="metric" formula={formula} onResult={setResultKg} />
      ) : (
        <ImperialForm key="imperial" formula={formula} onResult={setResultKg} />
      )}

      {display !== null && (
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-2xl font-bold tabular-nums">{display.value}</span>
          <span className="text-sm text-muted-foreground">{display.unit}</span>
        </div>
      )}
    </div>
  )
}
