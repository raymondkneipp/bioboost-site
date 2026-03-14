import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { calculateTargetHR } from "@/calculators/heart-rate/heartRate"
import type { MaxHRFormula, TargetHRResult } from "@/calculators/heart-rate/types"
import { ageSchema } from "@/lib/validations"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const restingHRSchema = z.number({ message: "Enter a valid heart rate" }).int().min(30).max(120)

const formulaLabels: Record<MaxHRFormula, string> = {
  fox: "Fox (220 − age)",
  tanaka: "Tanaka (208 − 0.7×age)",
  gulati: "Gulati (female)",
}

const zoneLabels: Record<string, string> = {
  recovery: "Recovery (50–60%)",
  "fat-burn": "Fat Burn (60–70%)",
  aerobic: "Aerobic (70–80%)",
  anaerobic: "Anaerobic (80–90%)",
  max: "Max Effort (90–100%)",
}

const zoneColors: Record<string, string> = {
  recovery: "bg-blue-100 dark:bg-blue-950",
  "fat-burn": "bg-green-100 dark:bg-green-950",
  aerobic: "bg-yellow-100 dark:bg-yellow-950",
  anaerobic: "bg-orange-100 dark:bg-orange-950",
  max: "bg-red-100 dark:bg-red-950",
}

const formOpts = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { age: "" as EmptyNumber, restingHR: "" as EmptyNumber },
})

export function TargetHeartRateCalculator() {
  const [formula, setFormula] = React.useState<MaxHRFormula>("tanaka")
  const [result, setResult] = React.useState<TargetHRResult | null>(null)

  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      setResult(calculateTargetHR({ age: numVal(value.age), restingHR: numVal(value.restingHR), formula }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Formula"
        name="thr-formula"
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
        <form.Field name="restingHR" validators={{ onChange: restingHRSchema }}>
          {(field) => <NumberField field={field} label="Resting Heart Rate" unit="bpm" placeholder="65" inputMode="numeric" integer />}
        </form.Field>
        <Button type="submit" className="self-start">Calculate Zones</Button>
      </form>

      {result && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Max HR: <strong>{result.maxHR} bpm</strong> · Karvonen method</p>
          <div className="flex flex-col gap-2">
            {result.zones.map((zone) => (
              <div key={zone.zone} className={`flex items-center justify-between rounded-lg px-4 py-2 ${zoneColors[zone.zone]}`}>
                <span className="text-sm font-medium">{zoneLabels[zone.zone] ?? zone.zone}</span>
                <span className="font-bold tabular-nums">{zone.minBPM}–{zone.maxBPM} bpm</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
