import { round } from "../../math/round"
import type { BMRInput, BMRResult } from "./types"

function mifflinStJeor(weightKg: number, heightCm: number, ageYears: number, sex: "male" | "female"): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears
  return sex === "male" ? base + 5 : base - 161
}

function harrisBenedict(weightKg: number, heightCm: number, ageYears: number, sex: "male" | "female"): number {
  if (sex === "male") {
    return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears
  }
  return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * ageYears
}

export function calculateBMR({ weightKg, heightCm, ageYears, sex, formula = "mifflin-st-jeor" }: BMRInput): BMRResult {
  const raw =
    formula === "harris-benedict"
      ? harrisBenedict(weightKg, heightCm, ageYears, sex)
      : mifflinStJeor(weightKg, heightCm, ageYears, sex)
  return { bmr: round(raw, 0), formula }
}
