import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { RadioGroup } from "@/components/form/radio-group"
import { WeightField } from "@/components/form/weight-field"
import { useSettings } from "@/contexts/settings"
import { calculateProteinIntake } from "@/calculators/protein-intake/proteinIntake"
import type { ProteinGoal, ProteinIntakeResult } from "@/calculators/protein-intake/types"
import { weightKgSchema, weightLbSchema } from "@/lib/validations"
import { poundsToKg } from "@/units/mass"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

const goalLabels: Record<ProteinGoal, string> = {
  sedentary: "Sedentary (0.8–1.0 g/kg)",
  active: "Active (1.2–1.6 g/kg)",
  athlete: "Endurance Athlete (1.6–2.0 g/kg)",
  strength: "Strength Training (1.8–2.4 g/kg)",
}

const baseFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { weight: "" as EmptyNumber },
})

interface FormProps {
  goal: ProteinGoal
  onResult: (r: ProteinIntakeResult) => void
}

function MetricForm({ goal, onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => onResult(calculateProteinIntake({ weightKg: numVal(value.weight), goal })),
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightKgSchema }}>
        {(field) => <WeightField field={field} unit="kg" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialForm({ goal, onResult }: FormProps) {
  const form = useForm({
    ...baseFormOptions,
    onSubmit: ({ value }) => onResult(calculateProteinIntake({ weightKg: poundsToKg(numVal(value.weight)), goal })),
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="weight" validators={{ onChange: weightLbSchema }}>
        {(field) => <WeightField field={field} unit="lb" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

export function ProteinIntakeCalculator() {
  const { units } = useSettings()
  const [goal, setGoal] = React.useState<ProteinGoal>("active")
  const [result, setResult] = React.useState<ProteinIntakeResult | null>(null)

  React.useEffect(() => { setResult(null) }, [units])

  const formProps: FormProps = { goal, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Activity / Goal"
        name="protein-goal"
        value={goal}
        options={(Object.keys(goalLabels) as ProteinGoal[]).map((g) => ({ value: g, label: goalLabels[g] }))}
        onChange={setGoal}
      />

      {units === "metric"
        ? <MetricForm key={`metric-${goal}`} {...formProps} />
        : <ImperialForm key={`imperial-${goal}`} {...formProps} />
      }

      {result && (
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
          <span className="text-2xl font-bold tabular-nums">{result.minGrams}–{result.maxGrams}</span>
          <span className="text-sm text-muted-foreground">grams of protein per day</span>
        </div>
      )}
    </div>
  )
}
