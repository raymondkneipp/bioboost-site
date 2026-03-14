export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very-active"

export interface TDEEInput {
  weightKg: number
  heightCm: number
  ageYears: number
  sex: "male" | "female"
  activityLevel: ActivityLevel
  formula?: "mifflin-st-jeor" | "harris-benedict"
}

export interface TDEEResult {
  tdee: number
  bmr: number
  activityLevel: ActivityLevel
}
