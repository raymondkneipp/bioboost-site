import { round } from "../../math/round"
import type { HydrationInput, HydrationResult } from "./types"

const ML_PER_KG = 35
const ML_PER_30MIN_EXERCISE = 500
const ML_PER_OZ = 29.5735
const OZ_PER_8OZ_GLASS = 8

export function calculateHydration({ weightKg, activityMinutes = 0 }: HydrationInput): HydrationResult {
  const baselineMl = weightKg * ML_PER_KG
  const exerciseMl = Math.floor(activityMinutes / 30) * ML_PER_30MIN_EXERCISE
  const totalMl = baselineMl + exerciseMl

  const baselineLiters = round(baselineMl / 1000, 2)
  const exerciseLiters = round(exerciseMl / 1000, 2)
  const dailyLiters = round(totalMl / 1000, 2)
  const dailyOz = round(totalMl / ML_PER_OZ, 1)
  const glasses8oz = Math.ceil(dailyOz / OZ_PER_8OZ_GLASS)

  return { dailyLiters, dailyOz, baselineLiters, exerciseLiters, glasses8oz }
}
