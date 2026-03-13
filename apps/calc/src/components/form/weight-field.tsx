import type { AnyFieldApi } from "@tanstack/react-form"
import { NumberField } from "./number-field"

interface WeightFieldProps {
  field: AnyFieldApi
  unit: "kg" | "lb"
}

export function WeightField({ field, unit }: WeightFieldProps) {
  return (
    <NumberField
      field={field}
      label="Weight"
      unit={unit}
      placeholder={unit === "kg" ? "70" : "154"}
      inputMode="decimal"
    />
  )
}
