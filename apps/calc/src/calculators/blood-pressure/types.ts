export type BloodPressureCategory =
  | "Normal"
  | "Elevated"
  | "High Stage 1"
  | "High Stage 2"
  | "Hypertensive Crisis"
  | "Low"

export interface BloodPressureInput {
  systolic: number
  diastolic: number
}

export interface BloodPressureResult {
  category: BloodPressureCategory
  systolic: number
  diastolic: number
  pulse?: number
}
