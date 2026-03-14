export interface HydrationInput {
  weightKg: number
  activityMinutes?: number
}

export interface HydrationResult {
  dailyLiters: number
  dailyOz: number
  baselineLiters: number
  exerciseLiters: number
  glasses8oz: number
}
