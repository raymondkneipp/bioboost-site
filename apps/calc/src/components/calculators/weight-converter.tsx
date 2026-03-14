import { Button } from "@workspace/ui/components/button"
import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import * as React from "react"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { kgToPounds, poundsToKg } from "@/units/mass"
import { round } from "@/math/round"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type Direction = "kg-to-lb" | "lb-to-kg"

const formOptions_ = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber },
})

export function WeightConverter() {
  const [direction, setDirection] = React.useState<Direction>("kg-to-lb")
  const [result, setResult] = React.useState<{ kg: number; lb: number } | null>(null)

  const kgForm = useForm({
    ...formOptions_,
    onSubmit: ({ value }) => {
      const kg = numVal(value.weight)
      setResult({ kg, lb: round(kgToPounds(kg), 2) })
    },
  })

  const lbForm = useForm({
    ...formOptions_,
    onSubmit: ({ value }) => {
      const lb = numVal(value.weight)
      setResult({ lb, kg: round(poundsToKg(lb), 2) })
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Convert"
        name="weight-dir"
        value={direction}
        options={[
          { value: "kg-to-lb", label: "kg → lb" },
          { value: "lb-to-kg", label: "lb → kg" },
        ]}
        onChange={(v) => { setDirection(v as Direction); setResult(null) }}
      />

      {direction === "kg-to-lb" ? (
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); kgForm.handleSubmit() }} className="flex flex-col gap-4">
          <kgForm.Field name="weight" validators={{ onChange: weightKgSchema }}>
            {(field) => <WeightField field={field} unit="kg" />}
          </kgForm.Field>
          <Button type="submit" className="self-start">Convert</Button>
        </form>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); lbForm.handleSubmit() }} className="flex flex-col gap-4">
          <lbForm.Field name="weight" validators={{ onChange: weightLbSchema }}>
            {(field) => <WeightField field={field} unit="lb" />}
          </lbForm.Field>
          <Button type="submit" className="self-start">Convert</Button>
        </form>
      )}

      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.kg} kg</span>
            <span className="text-xs text-muted-foreground">kilograms</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.lb} lb</span>
            <span className="text-xs text-muted-foreground">pounds</span>
          </div>
        </div>
      )}
    </div>
  )
}
