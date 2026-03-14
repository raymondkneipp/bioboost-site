import { round } from "../../math/round"
import { calculateBMR } from "../bmr/bmr"
import type { ActivityLevel, TDEEInput, TDEEResult } from "./types"

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
}

export function calculateTDEE({
  activityLevel,
  formula = "mifflin-st-jeor",
  weightKg,
  heightCm,
  ageYears,
  sex,
}: TDEEInput): TDEEResult {
  const { bmr } = calculateBMR({ weightKg, heightCm, ageYears, sex, formula })
  const tdee = round(bmr * activityMultipliers[activityLevel], 0)
  return { tdee, bmr, activityLevel }
}
