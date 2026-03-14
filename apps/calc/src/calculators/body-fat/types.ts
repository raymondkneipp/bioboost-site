export interface BodyFatInput {
  sex: "male" | "female"
  weightKg: number
  heightCm: number
  waistCm: number
  neckCm: number
  hipCm?: number // required for female
}

export interface BodyFatResult {
  bodyFatPct: number
  fatMassKg: number
  leanMassKg: number
}
