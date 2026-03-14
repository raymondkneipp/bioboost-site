import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { calculateCalorieDeficit } from "@/calculators/calorie-deficit/calorieDeficit"
import type { CalorieDeficitResult, DeficitLevel } from "@/calculators/calorie-deficit/types"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const tdeeSchema = z.number({ message: "Enter a valid TDEE" }).positive().min(500).max(10000)

const deficitLabels: Record<DeficitLevel, string> = {
  mild: "Mild (−250 kcal/day, ~0.2 kg/week)",
  moderate: "Moderate (−500 kcal/day, ~0.4 kg/week)",
  aggressive: "Aggressive (−750 kcal/day, ~0.7 kg/week)",
}

const formOpts = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { tdee: "" as EmptyNumber },
})

export function CalorieDeficitCalculator() {
  const [deficit, setDeficit] = React.useState<DeficitLevel>("moderate")
  const [result, setResult] = React.useState<CalorieDeficitResult | null>(null)

  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      setResult(calculateCalorieDeficit({ tdee: numVal(value.tdee), deficitLevel: deficit }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Deficit level"
        name="deficit-level"
        value={deficit}
        options={(Object.keys(deficitLabels) as DeficitLevel[]).map((d) => ({ value: d, label: deficitLabels[d] }))}
        onChange={setDeficit}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="tdee" validators={{ onChange: tdeeSchema }}>
          {(field) => (
            <NumberField field={field} label="Maintenance calories (TDEE)" unit="kcal" placeholder="2500" inputMode="numeric" integer />
          )}
        </form.Field>
        <Button type="submit" className="self-start">Calculate</Button>
      </form>

      {result && (
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.dailyCalories.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">kcal/day target</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.weeklyDeficitKcal.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">kcal/week deficit</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.estimatedWeeklyLossKg}</span>
            <span className="text-xs text-muted-foreground">kg/week loss</span>
          </div>
        </div>
      )}
    </div>
  )
}
