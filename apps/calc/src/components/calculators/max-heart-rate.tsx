import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { calculateMaxHR } from "@/calculators/heart-rate/heartRate"
import type { MaxHRFormula } from "@/calculators/heart-rate/types"
import { ageSchema } from "@/lib/validations"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const formulaLabels: Record<MaxHRFormula, string> = {
  fox: "Fox (220 − age)",
  tanaka: "Tanaka (208 − 0.7×age)",
  gulati: "Gulati (206 − 0.88×age, female)",
}

const formOpts = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { age: "" as EmptyNumber },
})

export function MaxHeartRateCalculator() {
  const [formula, setFormula] = React.useState<MaxHRFormula>("tanaka")
  const [result, setResult] = React.useState<number | null>(null)

  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      const { maxHR } = calculateMaxHR({ age: numVal(value.age), formula })
      setResult(maxHR)
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Formula"
        name="hr-formula"
        value={formula}
        options={(Object.keys(formulaLabels) as MaxHRFormula[]).map((f) => ({ value: f, label: formulaLabels[f] }))}
        onChange={setFormula}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="age" validators={{ onChange: ageSchema }}>
          {(field) => <NumberField field={field} label="Age" unit="yrs" placeholder="30" inputMode="numeric" integer />}
        </form.Field>
        <Button type="submit" className="self-start">Calculate</Button>
      </form>

      {result !== null && (
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-3xl font-bold tabular-nums">{result}</span>
          <span className="text-sm text-muted-foreground">bpm max heart rate</span>
        </div>
      )}
    </div>
  )
}
