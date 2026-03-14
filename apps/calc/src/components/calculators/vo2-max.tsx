import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { calculateVO2Max } from "@/calculators/vo2-max/vo2Max"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type DistanceUnit = "meters" | "yards"

const distanceSchema = z.number({ message: "Enter a valid distance" }).positive().max(10000)

const categoryVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "Very Poor": "destructive",
  Poor: "outline",
  Fair: "outline",
  Good: "default",
  Excellent: "default",
  Superior: "default",
}

const formOpts = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { distance: "" as EmptyNumber },
})

export function VO2MaxCalculator() {
  const [unit, setUnit] = React.useState<DistanceUnit>("meters")
  const [result, setResult] = React.useState<{ vo2max: number; fitnessCategory: string } | null>(null)

  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      const meters = unit === "meters" ? numVal(value.distance) : numVal(value.distance) * 0.9144
      setResult(calculateVO2Max({ distanceMeters: meters }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <p className="text-sm text-muted-foreground">
        Run as far as possible in 12 minutes, then enter your distance below.
      </p>

      <RadioGroup
        label="Distance unit"
        name="vo2-unit"
        value={unit}
        options={[
          { value: "meters", label: "Meters" },
          { value: "yards", label: "Yards" },
        ]}
        onChange={(v) => { setUnit(v as DistanceUnit); setResult(null) }}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="distance" validators={{ onChange: distanceSchema }}>
          {(field) => (
            <NumberField field={field} label="Distance covered in 12 min" unit={unit} placeholder={unit === "meters" ? "2400" : "2625"} inputMode="numeric" integer />
          )}
        </form.Field>
        <Button type="submit" className="self-start">Calculate VO₂ Max</Button>
      </form>

      {result && (
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-3xl font-bold tabular-nums">{result.vo2max}</span>
          <span className="text-sm text-muted-foreground">ml/kg/min</span>
          <Badge variant={categoryVariant[result.fitnessCategory] ?? "default"}>{result.fitnessCategory}</Badge>
        </div>
      )}
    </div>
  )
}
