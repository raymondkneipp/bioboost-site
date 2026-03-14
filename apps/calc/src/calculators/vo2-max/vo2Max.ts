import { round } from "../../math/round"
import type { VO2MaxInput, VO2MaxResult } from "./types"

function fitnessCategory(vo2max: number): string {
  if (vo2max < 28) return "Very Poor"
  if (vo2max < 34) return "Poor"
  if (vo2max < 42) return "Fair"
  if (vo2max < 52) return "Good"
  if (vo2max < 60) return "Excellent"
  return "Superior"
}

export function calculateVO2Max({ distanceMeters }: VO2MaxInput): VO2MaxResult {
  const vo2max = round((distanceMeters - 504.9) / 44.73, 1)
  return { vo2max, fitnessCategory: fitnessCategory(vo2max) }
}
