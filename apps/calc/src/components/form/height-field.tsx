import type { AnyFieldApi } from "@tanstack/react-form"
import { NumberField } from "./number-field"

interface HeightFieldProps {
  field: AnyFieldApi
}

export function HeightCmField({ field }: HeightFieldProps) {
  return (
    <NumberField
      field={field}
      label="Height"
      unit="cm"
      placeholder="175"
      inputMode="decimal"
    />
  )
}

export function HeightFtField({ field }: HeightFieldProps) {
  return (
    <NumberField
      field={field}
      label="Height (ft)"
      unit="ft"
      placeholder="5"
      inputMode="numeric"
      integer
    />
  )
}

export function HeightInField({ field }: HeightFieldProps) {
  return (
    <NumberField
      field={field}
      label="Height (in)"
      unit="in"
      placeholder="9"
      inputMode="decimal"
    />
  )
}
