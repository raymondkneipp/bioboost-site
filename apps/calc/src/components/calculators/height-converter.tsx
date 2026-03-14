import { Button } from "@workspace/ui/components/button"
import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import * as React from "react"
import { HeightCmField, HeightFtField, HeightInField } from "@/components/form/height-field"
import { RadioGroup } from "@/components/form/radio-group"
import { cmToFeetInches, feetInchesToCm } from "@/units/length"
import { heightCmSchema, heightFtSchema, heightInSchema } from "@/lib/validations"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type Direction = "cm-to-ft" | "ft-to-cm"

const cmFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { height: "" as EmptyNumber },
})

const ftFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { heightFt: "" as EmptyNumber, heightIn: "" as EmptyNumber },
})

export function HeightConverter() {
  const [direction, setDirection] = React.useState<Direction>("cm-to-ft")
  const [result, setResult] = React.useState<{ cm?: number; ft?: number; inches?: number } | null>(null)

  const cmForm = useForm({
    ...cmFormOptions,
    onSubmit: ({ value }) => {
      const cm = numVal(value.height)
      const { ft, in: inches } = cmToFeetInches(cm)
      setResult({ cm, ft, inches })
    },
  })

  const ftForm = useForm({
    ...ftFormOptions,
    onSubmit: ({ value }) => {
      const ft = numVal(value.heightFt)
      const inches = numVal(value.heightIn) || 0
      const cm = Math.round(feetInchesToCm(ft, inches) * 10) / 10
      setResult({ cm, ft, inches })
    },
  })

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Convert"
        name="height-dir"
        value={direction}
        options={[
          { value: "cm-to-ft", label: "cm → ft/in" },
          { value: "ft-to-cm", label: "ft/in → cm" },
        ]}
        onChange={(v) => { setDirection(v as Direction); setResult(null) }}
      />

      {direction === "cm-to-ft" ? (
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); cmForm.handleSubmit() }} className="flex flex-col gap-4">
          <cmForm.Field name="height" validators={{ onChange: heightCmSchema }}>
            {(field) => <HeightCmField field={field} />}
          </cmForm.Field>
          <Button type="submit" className="self-start">Convert</Button>
        </form>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); ftForm.handleSubmit() }} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <ftForm.Field name="heightFt" validators={{ onChange: heightFtSchema }}>
              {(field) => <HeightFtField field={field} />}
            </ftForm.Field>
            <ftForm.Field name="heightIn" validators={{ onChange: heightInSchema }}>
              {(field) => <HeightInField field={field} />}
            </ftForm.Field>
          </div>
          <Button type="submit" className="self-start">Convert</Button>
        </form>
      )}

      {result && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.cm} cm</span>
            <span className="text-xs text-muted-foreground">centimeters</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-4 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.ft}′ {result.inches}″</span>
            <span className="text-xs text-muted-foreground">feet and inches</span>
          </div>
        </div>
      )}
    </div>
  )
}
