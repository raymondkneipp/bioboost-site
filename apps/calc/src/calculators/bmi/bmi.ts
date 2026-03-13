import { round } from "../../math/round"
import type { BMICategory, BMIInput, BMIResult } from "./types"

function classifyBMI(bmi: number): BMICategory {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal"
  if (bmi < 30) return "Overweight"
  if (bmi < 35) return "Obese Class I"
  if (bmi < 40) return "Obese Class II"
  return "Obese Class III"
}

export function calculateBMI({ weightKg, heightM }: BMIInput): BMIResult {
  const bmi = round(weightKg / (heightM * heightM), 1)
  return { bmi, category: classifyBMI(bmi) }
}
