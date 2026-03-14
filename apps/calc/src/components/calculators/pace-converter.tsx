import { Button } from "@workspace/ui/components/button"
import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { convertPace } from "@/calculators/pace-converter/paceConverter"
import type { PaceConverterResult } from "@/calculators/pace-converter/types"
import { z } from "zod"

type InputMode = "paceMinPerKm" | "paceMinPerMile" | "speedKmh" | "speedMph"
type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const paceFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { value: "" as EmptyNumber },
})

const positiveSchema = z.number({ message: "Enter a valid value" }).positive()

function formatPace(totalMinutes: number): string {
  const mins = Math.floor(totalMinutes)
  const secs = Math.round((totalMinutes - mins) * 60)
  return `${mins}:${String(secs).padStart(2, "0")}`
}

const modeOptions: { value: InputMode; label: string }[] = [
  { value: "paceMinPerKm", label: "Pace (min/km)" },
  { value: "paceMinPerMile", label: "Pace (min/mi)" },
  { value: "speedKmh", label: "Speed (km/h)" },
  { value: "speedMph", label: "Speed (mph)" },
]

const modePlaceholder: Record<InputMode, string> = {
  paceMinPerKm: "5.0",
  paceMinPerMile: "8.05",
  speedKmh: "12",
  speedMph: "7.46",
}

const modeLabel: Record<InputMode, { label: string; unit: string }> = {
  paceMinPerKm: { label: "Pace", unit: "min/km" },
  paceMinPerMile: { label: "Pace", unit: "min/mi" },
  speedKmh: { label: "Speed", unit: "km/h" },
  speedMph: { label: "Speed", unit: "mph" },
}

export function PaceConverter() {
  const [mode, setMode] = React.useState<InputMode>("paceMinPerKm")
  const [result, setResult] = React.useState<PaceConverterResult | null>(null)

  const form = useForm({
    ...paceFormOptions,
    onSubmit: ({ value }) => {
      setResult(convertPace({ [mode]: numVal(value.value) }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Input type"
        name="pace-mode"
        value={mode}
        options={modeOptions}
        onChange={(v) => { setMode(v); setResult(null); form.reset() }}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="value" validators={{ onChange: positiveSchema }}>
          {(field) => (
            <NumberField
              field={field}
              label={modeLabel[mode].label}
              unit={modeLabel[mode].unit}
              placeholder={modePlaceholder[mode]}
            />
          )}
        </form.Field>

        <Button type="submit" className="self-start">Convert</Button>
      </form>

      {result && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: formatPace(result.paceMinPerKm), unit: "min/km" },
            { value: formatPace(result.paceMinPerMile), unit: "min/mi" },
            { value: result.speedKmh.toString(), unit: "km/h" },
            { value: result.speedMph.toString(), unit: "mph" },
          ].map(({ value, unit }) => (
            <div key={unit} className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
              <span className="text-xl font-bold tabular-nums">{value}</span>
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
