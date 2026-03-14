export type DeficitLevel = "mild" | "moderate" | "aggressive"

export interface CalorieDeficitInput {
  tdee: number
  deficitLevel: DeficitLevel
}

export interface CalorieDeficitResult {
  dailyCalories: number
  weeklyDeficitKcal: number
  estimatedWeeklyLossKg: number
  deficitLevel: DeficitLevel
}
