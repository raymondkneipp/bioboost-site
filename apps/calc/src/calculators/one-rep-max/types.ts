export type OneRepMaxFormula = "epley" | "brzycki" | "lombardi"

export interface OneRepMaxInput {
  weightKg: number
  reps: number
  formula?: OneRepMaxFormula
}

export interface OneRepMaxResult {
  oneRepMaxKg: number
  formula: OneRepMaxFormula
}
