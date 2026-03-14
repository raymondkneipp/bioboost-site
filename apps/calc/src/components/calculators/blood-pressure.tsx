import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { calculateBloodPressure } from "@/calculators/blood-pressure/bloodPressure"
import type { BloodPressureCategory, BloodPressureResult } from "@/calculators/blood-pressure/types"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const bpFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    systolic: "" as EmptyNumber,
    diastolic: "" as EmptyNumber,
  },
})

const bpSchema = z.number({ message: "Enter a valid value" }).int().min(1).max(300)

const categoryVariant: Record<BloodPressureCategory, "default" | "secondary" | "destructive" | "outline"> = {
  Low: "secondary",
  Normal: "default",
  Elevated: "outline",
  "High Stage 1": "outline",
  "High Stage 2": "destructive",
  "Hypertensive Crisis": "destructive",
}

const categoryDescription: Record<BloodPressureCategory, string> = {
  Low: "Hypotension — consider consulting a doctor",
  Normal: "Healthy range — maintain with diet and exercise",
  Elevated: "Above normal — lifestyle changes recommended",
  "High Stage 1": "Hypertension Stage 1 — consult your doctor",
  "High Stage 2": "Hypertension Stage 2 — medical treatment needed",
  "Hypertensive Crisis": "Seek emergency medical attention immediately",
}

export function BloodPressureCalculator() {
  const [result, setResult] = React.useState<BloodPressureResult | null>(null)

  const form = useForm({
    ...bpFormOptions,
    onSubmit: ({ value }) => {
      setResult(calculateBloodPressure({
        systolic: numVal(value.systolic),
        diastolic: numVal(value.diastolic),
      }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="systolic" validators={{ onChange: bpSchema }}>
          {(field) => (
            <NumberField field={field} label="Systolic" unit="mmHg" placeholder="120" inputMode="numeric" integer />
          )}
        </form.Field>

        <form.Field name="diastolic" validators={{ onChange: bpSchema }}>
          {(field) => (
            <NumberField field={field} label="Diastolic" unit="mmHg" placeholder="80" inputMode="numeric" integer />
          )}
        </form.Field>

        <Button type="submit" className="self-start">Check Blood Pressure</Button>
      </form>

      {result && (
        <div className="flex flex-col gap-2 rounded-lg bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums">
              {result.systolic}/{result.diastolic}
            </span>
            <Badge variant={categoryVariant[result.category]}>{result.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{categoryDescription[result.category]}</p>
        </div>
      )}
    </div>
  )
}
