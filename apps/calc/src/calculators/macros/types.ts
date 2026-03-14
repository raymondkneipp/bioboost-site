export type MacroGoal = "maintenance" | "fat-loss" | "muscle-gain" | "keto"

export interface MacrosInput {
  calories: number
  goal: MacroGoal
}

export interface MacrosResult {
  proteinG: number
  carbsG: number
  fatG: number
  proteinPct: number
  carbsPct: number
  fatPct: number
  goal: MacroGoal
}
