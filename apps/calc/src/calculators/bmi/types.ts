export type BMICategory =
  | "Underweight"
  | "Normal"
  | "Overweight"
  | "Obese Class I"
  | "Obese Class II"
  | "Obese Class III"

export interface BMIInput {
  weightKg: number
  heightM: number
}

export interface BMIResult {
  bmi: number
  category: BMICategory
}
