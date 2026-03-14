import { round } from "../../math/round"
import type { BodyFatInput, BodyFatResult } from "./types"

export function calculateBodyFat({
  sex,
  weightKg,
  heightCm,
  waistCm,
  neckCm,
  hipCm,
}: BodyFatInput): BodyFatResult {
  let pct: number

  if (sex === "male") {
    pct =
      495 /
        (1.0324 -
          0.19077 * Math.log10(waistCm - neckCm) +
          0.15456 * Math.log10(heightCm)) -
      450
  } else {
    const hip = hipCm ?? 0
    pct =
      495 /
        (1.29579 -
          0.35004 * Math.log10(waistCm + hip - neckCm) +
          0.221 * Math.log10(heightCm)) -
      450
  }

  const bodyFatPct = round(pct, 1)
  const fatMassKg = round((bodyFatPct / 100) * weightKg, 1)
  const leanMassKg = round(weightKg - fatMassKg, 1)
  return { bodyFatPct, fatMassKg, leanMassKg }
}
