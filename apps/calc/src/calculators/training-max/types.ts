export interface TrainingMaxInput {
  oneRepMaxKg: number
  percentage?: number // default 90
}

export interface TrainingMaxResult {
  trainingMaxKg: number
  percentage: number
}
