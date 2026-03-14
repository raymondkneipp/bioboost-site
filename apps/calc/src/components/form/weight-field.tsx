import type { AnyFieldApi } from "@tanstack/react-form"
import { NumberField } from "./number-field"

interface WeightFieldProps {
  field: AnyFieldApi
  unit: "kg" | "lb"
  label?: string
}

export function WeightField({ field, unit, label = "Weight" }: WeightFieldProps) {
  return (
    <NumberField
      field={field}
      label={label}
      unit={unit}
      placeholder={unit === "kg" ? "70" : "154"}
      inputMode="decimal"
    />
  )
}
