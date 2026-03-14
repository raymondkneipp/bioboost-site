import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { calculateMacros } from "@/calculators/macros/macros"
import type { MacroGoal, MacrosResult } from "@/calculators/macros/types"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const caloriesSchema = z.number({ message: "Enter calories" }).positive().min(500).max(10000)

const goalLabels: Record<MacroGoal, string> = {
  maintenance: "Maintenance",
  "fat-loss": "Fat Loss",
  "muscle-gain": "Muscle Gain",
  keto: "Ketogenic",
}

const formOpts = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { calories: "" as EmptyNumber },
})

export function MacrosCalculator() {
  const [goal, setGoal] = React.useState<MacroGoal>("maintenance")
  const [result, setResult] = React.useState<MacrosResult | null>(null)

  const form = useForm({
    ...formOpts,
    onSubmit: ({ value }) => {
      setResult(calculateMacros({ calories: numVal(value.calories), goal }))
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Goal"
        name="macros-goal"
        value={goal}
        options={(Object.keys(goalLabels) as MacroGoal[]).map((g) => ({ value: g, label: goalLabels[g] }))}
        onChange={setGoal}
      />

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }}
        className="flex flex-col gap-4"
      >
        <form.Field name="calories" validators={{ onChange: caloriesSchema }}>
          {(field) => (
            <NumberField field={field} label="Daily calories" unit="kcal" placeholder="2000" inputMode="numeric" integer />
          )}
        </form.Field>
        <Button type="submit" className="self-start">Calculate Macros</Button>
      </form>

      {result && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Protein", grams: result.proteinG, pct: result.proteinPct, color: "text-blue-600 dark:text-blue-400" },
            { label: "Carbs", grams: result.carbsG, pct: result.carbsPct, color: "text-yellow-600 dark:text-yellow-400" },
            { label: "Fat", grams: result.fatG, pct: result.fatPct, color: "text-red-600 dark:text-red-400" },
          ].map(({ label, grams, pct, color }) => (
            <div key={label} className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
              <span className={`text-2xl font-bold tabular-nums ${color}`}>{grams}g</span>
              <span className="text-xs font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
