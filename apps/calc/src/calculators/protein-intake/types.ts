export type ProteinGoal = "sedentary" | "active" | "athlete" | "strength"

export interface ProteinIntakeInput {
  weightKg: number
  goal: ProteinGoal
}

export interface ProteinIntakeResult {
  minGrams: number
  maxGrams: number
  goal: ProteinGoal
}
