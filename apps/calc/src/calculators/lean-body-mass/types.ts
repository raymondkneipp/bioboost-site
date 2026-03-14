export type LBMFormula = "boer" | "james" | "hume"

export interface LBMInput {
  sex: "male" | "female"
  weightKg: number
  heightCm: number
  formula?: LBMFormula
}

export interface LBMResult {
  leanMassKg: number
  formula: LBMFormula
}
