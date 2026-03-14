import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { HeightCmField, HeightFtField, HeightInField } from "@/components/form/height-field"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateTDEE } from "@/calculators/tdee/tdee"
import type { ActivityLevel, TDEEResult } from "@/calculators/tdee/types"
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

type Sex = "male" | "female"

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (office job, no exercise)",
  light: "Light (1–3 days/week)",
  moderate: "Moderate (3–5 days/week)",
  active: "Active (6–7 days/week)",
  "very-active": "Very Active (twice/day or physical job)",
}

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, height: "" as EmptyNumber, age: "" as EmptyNumber },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, heightFt: "" as EmptyNumber, heightIn: "" as EmptyNumber, age: "" as EmptyNumber },
})

interface FormProps {
  sex: Sex
  activityLevel: ActivityLevel
  onResult: (r: TDEEResult) => void
}

function MetricForm({ sex, activityLevel, onResult }: FormProps) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      onResult(calculateTDEE({ weightKg: numVal(value.weight), heightCm: numVal(value.height), ageYears: numVal(value.age), sex, activityLevel }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" />}
      </form.Field>
      <form.Field name="height" validators={{ onChange: heightCmSchema }}>
        {(field) => <HeightCmField field={field} />}
      </form.Field>
      <form.Field name="age" validators={{ onChange: ageSchema }}>
        {(field) => <NumberField field={field} label="Age" unit="yrs" placeholder="25" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate TDEE</Button>
    </form>
  )
}

function ImperialForm({ sex, activityLevel, onResult }: FormProps) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      onResult(calculateTDEE({
        weightKg: poundsToKg(numVal(value.weight)),
        heightCm: feetInchesToCm(numVal(value.heightFt), numVal(value.heightIn) || 0),
        ageYears: numVal(value.age),
        sex,
        activityLevel,
      }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
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
        {(field) => <NumberField field={field} label="Age" unit="yrs" placeholder="25" inputMode="numeric" integer />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate TDEE</Button>
    </form>
  )
}

export function TDEECalculator() {
  const { units } = useSettings()
  const [sex, setSex] = React.useState<Sex>("male")
  const [activityLevel, setActivityLevel] = React.useState<ActivityLevel>("moderate")
  const [result, setResult] = React.useState<TDEEResult | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => { setResult(null) }, [units])

  const formProps: FormProps = { sex, activityLevel, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <div className="flex flex-col gap-4">
        <RadioGroup
          label="Sex"
          name="tdee-sex"
          value={sex}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          onChange={setSex}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="tdee-activity" className="text-sm font-medium">Activity level</label>
          <select
            id="tdee-activity"
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={activityLevel}
            onChange={(e) => { setActivityLevel(e.target.value as ActivityLevel); setResult(null) }}
          >
            {(Object.keys(activityLabels) as ActivityLevel[]).map((a) => (
              <option key={a} value={a}>{activityLabels[a]}</option>
            ))}
          </select>
        </div>
      </div>

      {units === "metric"
        ? <MetricForm key="metric" {...formProps} />
        : <ImperialForm key="imperial" {...formProps} />
      }

      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.tdee.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">kcal/day (TDEE)</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.bmr.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">kcal/day (BMR)</span>
          </div>
        </div>
      )}
    </div>
  )
}
