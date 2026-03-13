import { formOptions, useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { poundsToKg } from "@/units/mass"
import { feetInchesToCm } from "@/units/length"

type EmptyNumber = "" | number

function numVal(v: EmptyNumber): number {
  return v === "" ? Number.NaN : v
}

/**
 * Shared form options for metric weight + height forms.
 * Spread these into useForm to extend with additional fields:
 *
 * @example
 * const form = useForm({
 *   ...metricWeightHeightFormOptions,
 *   defaultValues: { ...metricWeightHeightFormOptions.defaultValues, age: "" },
 *   onSubmit: ({ value }) => { ... },
 * })
 */
export const metricWeightHeightFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    weight: "" as EmptyNumber,
    height: "" as EmptyNumber,
  },
})

/**
 * Shared form options for imperial weight + height forms.
 */
export const imperialWeightHeightFormOptions = formOptions({
  validatorAdapter: zodValidator(),
  defaultValues: {
    weight: "" as EmptyNumber,
    heightFt: "" as EmptyNumber,
    heightIn: "" as EmptyNumber,
  },
})

/**
 * Form hook for metric body measurements (weight kg + height cm).
 * onSubmit receives values already in SI units (kg, cm).
 */
export function useMetricWeightHeightForm(
  onSubmit: (weightKg: number, heightCm: number) => void,
) {
  return useForm({
    ...metricWeightHeightFormOptions,
    onSubmit: ({ value }) => {
      onSubmit(numVal(value.weight), numVal(value.height))
    },
  })
}

/**
 * Form hook for imperial body measurements (weight lb + height ft/in).
 * onSubmit receives values converted to SI units (kg, cm).
 */
export function useImperialWeightHeightForm(
  onSubmit: (weightKg: number, heightCm: number) => void,
) {
  return useForm({
    ...imperialWeightHeightFormOptions,
    onSubmit: ({ value }) => {
      const weightKg = poundsToKg(numVal(value.weight))
      const heightCm = feetInchesToCm(numVal(value.heightFt), numVal(value.heightIn) || 0)
      onSubmit(weightKg, heightCm)
    },
  })
}
