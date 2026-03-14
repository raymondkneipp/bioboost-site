import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { calculateCholesterol } from "@/calculators/cholesterol/cholesterol"
import type { CholesterolResult, CholesterolRisk } from "@/calculators/cholesterol/types"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const cholSchema = z.number({ message: "Enter a valid value" }).positive().max(1000)
function optionalCholValidator({ value }: { value: EmptyNumber }) {
  if (value === "" || value === undefined) return undefined
  const result = cholSchema.safeParse(value)
  return result.success ? undefined : result.error.issues[0]?.message
}

const riskVariant: Record<CholesterolRisk, "default" | "secondary" | "destructive" | "outline"> = {
  Optimal: "default",
  Good: "default",
  Borderline: "outline",
  "High Risk": "destructive",
}

const cholFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    total: "" as EmptyNumber,
    hdl: "" as EmptyNumber,
    ldl: "" as EmptyNumber,
  },
})

export function CholesterolCalculator() {
  const [result, setResult] = React.useState<CholesterolResult | null>(null)

  const form = useForm({
    ...cholFormOptions,
    onSubmit: ({ value }) => {
      const ldlVal = numVal(value.ldl)
      setResult(calculateCholesterol({
        totalMgDl: numVal(value.total),
        hdlMgDl: numVal(value.hdl),
        ldlMgDl: Number.isNaN(ldlVal) ? undefined : ldlVal,
      }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="total" validators={{ onChange: cholSchema }}>
          {(field) => <NumberField field={field} label="Total Cholesterol" unit="mg/dL" placeholder="200" />}
        </form.Field>

        <form.Field name="hdl" validators={{ onChange: cholSchema }}>
          {(field) => <NumberField field={field} label="HDL Cholesterol" unit="mg/dL" placeholder="50" />}
        </form.Field>

        <form.Field name="ldl" validators={{ onChange: optionalCholValidator }}>
          {(field) => <NumberField field={field} label="LDL Cholesterol (optional)" unit="mg/dL" placeholder="130" />}
        </form.Field>

        <Button type="submit" className="self-start">Calculate Ratio</Button>
      </form>

      {result && (
        <div className="flex flex-col gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tabular-nums">{result.ratio}</span>
            <span className="text-sm text-muted-foreground">Total:HDL ratio</span>
            <Badge variant={riskVariant[result.risk]}>{result.risk}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span>{result.totalCategory}</span>
            <span className="text-muted-foreground">HDL:</span>
            <span>{result.hdlCategory}</span>
            {result.ldlCategory && (
              <>
                <span className="text-muted-foreground">LDL:</span>
                <span>{result.ldlCategory}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
