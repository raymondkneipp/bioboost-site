export type IBWFormula = "devine" | "robinson" | "miller" | "hamwi"

export interface IBWInput {
  sex: "male" | "female"
  heightCm: number
  formula?: IBWFormula
}

export interface IBWResult {
  idealWeightKg: number
  formula: IBWFormula
}
