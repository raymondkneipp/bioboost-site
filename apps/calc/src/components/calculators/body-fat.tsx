import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { Button } from "@workspace/ui/components/button"
import * as React from "react"
import { HeightCmField, HeightFtField, HeightInField } from "@/components/form/height-field"
import { NumberField } from "@/components/form/number-field"
import { RadioGroup } from "@/components/form/radio-group"
import { useSettings } from "@/contexts/settings"
import { calculateBodyFat } from "@/calculators/body-fat/bodyFat"
import type { BodyFatResult } from "@/calculators/body-fat/types"
import { heightCmSchema, heightFtSchema, heightInSchema } from "@/lib/validations"
import { feetInchesToCm } from "@/units/length"
import { z } from "zod"

type EmptyNumber = "" | number
function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

type Sex = "male" | "female"

const measSchema = z.number({ message: "Enter a valid measurement" }).positive().max(200)
const measSchemaIn = z.number({ message: "Enter a valid measurement" }).positive().max(80)

function inchesToCm(inches: number) {
  return inches * 2.54
}

interface FormProps {
  sex: Sex
  onResult: (r: BodyFatResult) => void
}

const metricMaleFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { height: "" as EmptyNumber, neck: "" as EmptyNumber, waist: "" as EmptyNumber },
})

const imperialMaleFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { heightFt: "" as EmptyNumber, heightIn: "" as EmptyNumber, neck: "" as EmptyNumber, waist: "" as EmptyNumber },
})

const metricFemaleFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { height: "" as EmptyNumber, neck: "" as EmptyNumber, waist: "" as EmptyNumber, hip: "" as EmptyNumber },
})

const imperialFemaleFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: { heightFt: "" as EmptyNumber, heightIn: "" as EmptyNumber, neck: "" as EmptyNumber, waist: "" as EmptyNumber, hip: "" as EmptyNumber },
})

function MetricMaleForm({ onResult }: FormProps) {
  const form = useForm({
    ...metricMaleFormOptions,
    onSubmit: ({ value }) => {
      onResult(calculateBodyFat({ sex: "male", weightKg: 70, heightCm: numVal(value.height), neckCm: numVal(value.neck), waistCm: numVal(value.waist) }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="height" validators={{ onChange: heightCmSchema }}>
        {(field) => <HeightCmField field={field} />}
      </form.Field>
      <form.Field name="neck" validators={{ onChange: measSchema }}>
        {(field) => <NumberField field={field} label="Neck circumference" unit="cm" placeholder="38" />}
      </form.Field>
      <form.Field name="waist" validators={{ onChange: measSchema }}>
        {(field) => <NumberField field={field} label="Waist circumference" unit="cm" placeholder="85" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function MetricFemaleForm({ onResult }: FormProps) {
  const form = useForm({
    ...metricFemaleFormOptions,
    onSubmit: ({ value }) => {
      onResult(calculateBodyFat({ sex: "female", weightKg: 60, heightCm: numVal(value.height), neckCm: numVal(value.neck), waistCm: numVal(value.waist), hipCm: numVal(value.hip) }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <form.Field name="height" validators={{ onChange: heightCmSchema }}>
        {(field) => <HeightCmField field={field} />}
      </form.Field>
      <form.Field name="neck" validators={{ onChange: measSchema }}>
        {(field) => <NumberField field={field} label="Neck circumference" unit="cm" placeholder="33" />}
      </form.Field>
      <form.Field name="waist" validators={{ onChange: measSchema }}>
        {(field) => <NumberField field={field} label="Waist circumference" unit="cm" placeholder="75" />}
      </form.Field>
      <form.Field name="hip" validators={{ onChange: measSchema }}>
        {(field) => <NumberField field={field} label="Hip circumference" unit="cm" placeholder="95" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialMaleForm({ onResult }: FormProps) {
  const form = useForm({
    ...imperialMaleFormOptions,
    onSubmit: ({ value }) => {
      const heightCm = feetInchesToCm(numVal(value.heightFt), numVal(value.heightIn) || 0)
      onResult(calculateBodyFat({ sex: "male", weightKg: 70, heightCm, neckCm: inchesToCm(numVal(value.neck)), waistCm: inchesToCm(numVal(value.waist)) }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <form.Field name="heightFt" validators={{ onChange: heightFtSchema }}>
          {(field) => <HeightFtField field={field} />}
        </form.Field>
        <form.Field name="heightIn" validators={{ onChange: heightInSchema }}>
          {(field) => <HeightInField field={field} />}
        </form.Field>
      </div>
      <form.Field name="neck" validators={{ onChange: measSchemaIn }}>
        {(field) => <NumberField field={field} label="Neck circumference" unit="in" placeholder="15" />}
      </form.Field>
      <form.Field name="waist" validators={{ onChange: measSchemaIn }}>
        {(field) => <NumberField field={field} label="Waist circumference" unit="in" placeholder="33" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

function ImperialFemaleForm({ onResult }: FormProps) {
  const form = useForm({
    ...imperialFemaleFormOptions,
    onSubmit: ({ value }) => {
      const heightCm = feetInchesToCm(numVal(value.heightFt), numVal(value.heightIn) || 0)
      onResult(calculateBodyFat({ sex: "female", weightKg: 60, heightCm, neckCm: inchesToCm(numVal(value.neck)), waistCm: inchesToCm(numVal(value.waist)), hipCm: inchesToCm(numVal(value.hip)) }))
    },
  })
  return (
    <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit() }} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <form.Field name="heightFt" validators={{ onChange: heightFtSchema }}>
          {(field) => <HeightFtField field={field} />}
        </form.Field>
        <form.Field name="heightIn" validators={{ onChange: heightInSchema }}>
          {(field) => <HeightInField field={field} />}
        </form.Field>
      </div>
      <form.Field name="neck" validators={{ onChange: measSchemaIn }}>
        {(field) => <NumberField field={field} label="Neck circumference" unit="in" placeholder="13" />}
      </form.Field>
      <form.Field name="waist" validators={{ onChange: measSchemaIn }}>
        {(field) => <NumberField field={field} label="Waist circumference" unit="in" placeholder="30" />}
      </form.Field>
      <form.Field name="hip" validators={{ onChange: measSchemaIn }}>
        {(field) => <NumberField field={field} label="Hip circumference" unit="in" placeholder="37" />}
      </form.Field>
      <Button type="submit" className="self-start">Calculate</Button>
    </form>
  )
}

export function BodyFatCalculator() {
  const { units } = useSettings()
  const [sex, setSex] = React.useState<Sex>("male")
  const [result, setResult] = React.useState<BodyFatResult | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: resets result when units change
  React.useEffect(() => { setResult(null) }, [units, sex])

  const formProps: FormProps = { sex, onResult: setResult }

  return (
    <div className="not-prose flex flex-col gap-6 rounded-xl border p-6">
      <RadioGroup
        label="Sex"
        name="bf-sex"
        value={sex}
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
        ]}
        onChange={setSex}
      />

      {units === "metric"
        ? sex === "male" ? <MetricMaleForm key="mm" {...formProps} /> : <MetricFemaleForm key="mf" {...formProps} />
        : sex === "male" ? <ImperialMaleForm key="im" {...formProps} /> : <ImperialFemaleForm key="if" {...formProps} />
      }

      {result && (
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.bodyFatPct}%</span>
            <span className="text-xs text-muted-foreground">body fat</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.fatMassKg} kg</span>
            <span className="text-xs text-muted-foreground">fat mass</span>
          </div>
          <div className="flex flex-col rounded-lg bg-muted/50 px-3 py-3 text-center">
            <span className="text-2xl font-bold tabular-nums">{result.leanMassKg} kg</span>
            <span className="text-xs text-muted-foreground">lean mass</span>
          </div>
        </div>
      )}
    </div>
  )
}
