export interface WilksInput {
  sex: "male" | "female"
  bodyWeightKg: number
  liftedKg: number
}

export interface WilksResult {
  wilks: number
}
