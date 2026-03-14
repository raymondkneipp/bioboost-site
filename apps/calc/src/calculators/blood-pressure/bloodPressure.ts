import type { BloodPressureCategory, BloodPressureInput, BloodPressureResult } from "./types"

function classifyBP(systolic: number, diastolic: number): BloodPressureCategory {
  if (systolic < 90 || diastolic < 60) return "Low"
  if (systolic > 180 || diastolic > 120) return "Hypertensive Crisis"
  if (systolic >= 140 || diastolic >= 90) return "High Stage 2"
  if (systolic >= 130 || diastolic >= 80) return "High Stage 1"
  if (systolic >= 120 && diastolic < 80) return "Elevated"
  return "Normal"
}

export function calculateBloodPressure({ systolic, diastolic }: BloodPressureInput): BloodPressureResult {
  return {
    systolic,
    diastolic,
    category: classifyBP(systolic, diastolic),
  }
}
