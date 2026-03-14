import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { HeightCmField, HeightFtField, HeightInField } from "@/components/form/height-field"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateBMR } from "@/calculators/bmr/bmr"
import type { BMRFormula, BMRSex } from "@/calculators/bmr/types"
import {
  ageSchema,
  heightCmSchema,
  heightFtSchema,
  heightInSchema,
  weightKgSchema,
  weightLbSchema,
} from "@/lib/validations"
import { feetInchesToCm } from "@/units/length"
import { poundsToKg } from "@/units/mass"

type EmptyNumber = "" | number

function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    weight: "" as EmptyNumber,
    height: "" as EmptyNumber,
    age: "" as EmptyNumber,
  },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    weight: "" as EmptyNumber,
    heightFt: "" as EmptyNumber,
    heightIn: "" as EmptyNumber,
    age: "" as EmptyNumber,
  },
})

const formulaLabels: Record<BMRFormula, string> = {
  "mifflin-st-jeor": "Mifflin-St Jeor",
  "harris-benedict": "Harris-Benedict",
}

interface FormProps {
  sex: BMRSex
  formula: BMRFormula
  onResult: (bmr: number) => void
}

function MetricForm({ sex, formula, onResult }: FormProps) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      const { bmr } = calculateBMR({
        weightKg: numVal(value.weight),
        heightCm: numVal(value.height),
        ageYears: numVal(value.age),
        sex,
        formula,
      })
      onResult(bmr)
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

      <form.Field name="height" validators={{ onChange: heightCmSchema }}>
        {(field) => <HeightCmField field={field} />}
      </form.Field>

      <form.Field name="age" validators={{ onChange: ageSchema }}>
        {(field) => (
          <NumberField
            field={field}
            label="Age"
            unit="yrs"
            placeholder="25"
            inputMode="numeric"
            integer
          />
        )}
      </form.Field>

      <Button type="submit" className="self-start">
        Calculate BMR
      </Button>
    </form>
  )
}

function ImperialForm({ sex, formula, onResult }: FormProps) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const { bmr } = calculateBMR({
        weightKg: poundsToKg(numVal(value.weight)),
        heightCm: feetInchesToCm(numVal(value.heightFt), numVal(value.heightIn) || 0),
        ageYears: numVal(value.age),
        sex,
        formula,
      })
      onResult(bmr)
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

      <div className="flex gap-3">
        <form.Field name="heightFt" validators={{ onChange: heightFtSchema }}>
          {(field) => <HeightFtField field={field} />}
        </form.Field>

        <form.Field name="heightIn" validators={{ onChange: heightInSchema }}>
          {(field) => <HeightInField field={field} />}
        </form.Field>
      </div>

      <form.Field name="age" validators={{ onChange: ageSchema }}>
        {(field) => (
          <NumberField
            field={field}
            label="Age"
            unit="yrs"
            placeholder="25"
            inputMode="numeric"
            integer
          />
        )}
      </form.Field>

      <Button type="submit" className="self-start">
        Calculate BMR
      </Button>
    </form>
  )
}

export function BmrCalculator() {
  const { units } = useSettings()
  const [sex, setSex] = React.useState<BMRSex>("male")
  const [formula, setFormula] = React.useState<BMRFormula>("mifflin-st-jeor")
  const [result, setResult] = React.useState<number | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => {
    setResult(null)
  }, [units])

  const formProps: FormProps = { sex, formula, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <div className="flex flex-col gap-4">
        <RadioGroup
          label="Sex"
          name="bmr-sex"
          value={sex}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          onChange={setSex}
        />

        <RadioGroup
          label="Formula"
          name="bmr-formula"
          value={formula}
          options={(Object.keys(formulaLabels) as BMRFormula[]).map((f) => ({
            value: f,
            label: formulaLabels[f],
          }))}
          onChange={setFormula}
        />
      </div>

      {units === "metric" ? (
        <MetricForm key="metric" {...formProps} />
      ) : (
        <ImperialForm key="imperial" {...formProps} />
      )}

      {result !== null && (
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-2xl font-bold tabular-nums">
            {result.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">kcal/day</span>
        </div>
      )}
    </div>
  )
}
