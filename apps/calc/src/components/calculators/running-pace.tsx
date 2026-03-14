import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { useSettings } from "@/contexts/settings"
import { calculateRunningPace } from "@/calculators/running-pace/runningPace"
import type { RunningPaceResult } from "@/calculators/running-pace/types"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type DistanceUnit = "km" | "miles"
const KM_PER_MILE = 1.60934

const distanceSchema = z.number({ message: "Enter a valid distance" }).positive()
const hourSchema = z.number({ message: "Enter hours" }).int().min(0).max(23)
const minuteSchema = z.number({ message: "Enter minutes" }).int().min(0).max(59)
const secondSchema = z.number({ message: "Enter seconds" }).int().min(0).max(59)

function formatPace(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = Math.round(totalSeconds % 60)
  return `${mins}:${String(secs).padStart(2, "0")}`
}

const formOpts = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    distance: "" as EmptyNumber,
    hours: "" as EmptyNumber,
    minutes: "" as EmptyNumber,
    seconds: "" as EmptyNumber,
  },
})

export function RunningPaceCalculator() {
  const { units } = useSettings()
  const [distUnit, setDistUnit] = React.useState<DistanceUnit>(units === "metric" ? "km" : "miles")
  const [result, setResult] = React.useState<RunningPaceResult | null>(null)

  React.useEffect(() => {
    setDistUnit(units === "metric" ? "km" : "miles")
    setResult(null)
  }, [units])

  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      const distKm = distUnit === "km"
        ? numVal(value.distance)
        : numVal(value.distance) * KM_PER_MILE
      setResult(calculateRunningPace({
        distanceKm: distKm,
        hours: numVal(value.hours) || 0,
        minutes: numVal(value.minutes) || 0,
        seconds: numVal(value.seconds) || 0,
      }))
    },
  })

  const isMetric = distUnit === "km"

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Distance unit"
        name="pace-dist-unit"
        value={distUnit}
        options={[
          { value: "km", label: "Kilometers" },
          { value: "miles", label: "Miles" },
        ]}
        onChange={(v) => { setDistUnit(v as DistanceUnit); setResult(null) }}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="distance" validators={{ onChange: distanceSchema }}>
          {(field) => <NumberField field={field} label="Distance" unit={distUnit} placeholder={isMetric ? "10" : "6.2"} />}
        </form.Field>

        <div className="flex gap-3">
          <form.Field name="hours" validators={{ onChange: hourSchema }}>
            {(field) => <NumberField field={field} label="Hours" placeholder="0" inputMode="numeric" integer />}
          </form.Field>
          <form.Field name="minutes" validators={{ onChange: minuteSchema }}>
            {(field) => <NumberField field={field} label="Minutes" placeholder="50" inputMode="numeric" integer />}
          </form.Field>
          <form.Field name="seconds" validators={{ onChange: secondSchema }}>
            {(field) => <NumberField field={field} label="Seconds" placeholder="0" inputMode="numeric" integer />}
          </form.Field>
        </div>

        <Button type="submit" className="self-start">Calculate Pace</Button>
      </form>

      {result && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: formatPace(result.paceSecPerKm), unit: "min/km" },
            { value: formatPace(result.paceSecPerMile), unit: "min/mi" },
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
