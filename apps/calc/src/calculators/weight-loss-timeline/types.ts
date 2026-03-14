export interface WeightLossTimelineInput {
  currentWeightKg: number
  targetWeightKg: number
  weeklyDeficitKcal: number
}

export interface WeightLossTimelineResult {
  weightToLoseKg: number
  totalKcalDeficit: number
  weeks: number
  months: number
  targetDate: string
}
