export type BMRSex = "male" | "female"

export type BMRFormula = "mifflin-st-jeor" | "harris-benedict"

export interface BMRInput {
  weightKg: number
  heightCm: number
  ageYears: number
  sex: BMRSex
  formula?: BMRFormula
}

export interface BMRResult {
  bmr: number
  formula: BMRFormula
}
