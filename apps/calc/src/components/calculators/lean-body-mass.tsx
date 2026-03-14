import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { HeightCmField, HeightFtField, HeightInField } from "@/components/form/height-field"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateLBM } from "@/calculators/lean-body-mass/leanBodyMass"
import type { LBMFormula } from "@/calculators/lean-body-mass/types"
import {
  heightCmSchema,
  heightFtSchema,
  heightInSchema,
  weightKgSchema,
  weightLbSchema,
} from "@/lib/validations"
import { feetInchesToCm } from "@/units/length"
import { kgToPounds, poundsToKg } from "@/units/mass"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type Sex = "male" | "female"

const formulaLabels: Record<LBMFormula, string> = {
  boer: "Boer",
  james: "James",
  hume: "Hume",
}

interface FormProps {
  sex: Sex
  formula: LBMFormula
  onResult: (lbmKg: number) => void
}

const metricFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, height: "" as EmptyNumber },
})

const imperialFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber, heightFt: "" as EmptyNumber, heightIn: "" as EmptyNumber },
})

function MetricForm({ sex, formula, onResult }: FormProps) {
  const form = useForm({
    ...metricFormOptions,
    onSubmit: ({ value }) => {
      const { leanMassKg } = calculateLBM({ sex, weightKg: numVal(value.weight), heightCm: numVal(value.height), formula })
      onResult(leanMassKg)
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
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialForm({ sex, formula, onResult }: FormProps) {
  const form = useForm({
    ...imperialFormOptions,
    onSubmit: ({ value }) => {
      const { leanMassKg } = calculateLBM({
        sex,
        weightKg: poundsToKg(numVal(value.weight)),
        heightCm: feetInchesToCm(numVal(value.heightFt), numVal(value.heightIn) || 0),
        formula,
      })
      onResult(leanMassKg)
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
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

export function LeanBodyMassCalculator() {
  const { units } = useSettings()
  const [sex, setSex] = React.useState<Sex>("male")
  const [formula, setFormula] = React.useState<LBMFormula>("boer")
  const [result, setResult] = React.useState<number | null>(null)

  React.useEffect(() => { setResult(null) }, [units])

  const formProps: FormProps = { sex, formula, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <div className="flex flex-col gap-4">
        <RadioGroup
          label="Sex"
          name="lbm-sex"
          value={sex}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          onChange={setSex}
        />
        <RadioGroup
          label="Formula"
          name="lbm-formula"
          value={formula}
          options={(Object.keys(formulaLabels) as LBMFormula[]).map((f) => ({ value: f, label: formulaLabels[f] }))}
          onChange={setFormula}
        />
      </div>

      {units === "metric"
        ? <MetricForm key={`metric-${sex}`} {...formProps} />
        : <ImperialForm key={`imperial-${sex}`} {...formProps} />
      }

      {result !== null && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result} kg</span>
            <span className="text-xs text-muted-foreground">lean body mass</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{Math.round(kgToPounds(result))} lb</span>
            <span className="text-xs text-muted-foreground">lean body mass</span>
          </div>
        </div>
      )}
    </div>
  )
}
