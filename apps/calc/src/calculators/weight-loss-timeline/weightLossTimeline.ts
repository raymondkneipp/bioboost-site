import { round } from "../../math/round"
import type { WeightLossTimelineInput, WeightLossTimelineResult } from "./types"

const KCAL_PER_KG = 7700

export function calculateWeightLossTimeline({
  currentWeightKg,
  targetWeightKg,
  weeklyDeficitKcal,
}: WeightLossTimelineInput): WeightLossTimelineResult {
  const weightToLoseKg = round(currentWeightKg - targetWeightKg, 2)
  const totalKcalDeficit = round(weightToLoseKg * KCAL_PER_KG, 0)
  const weeks = round(totalKcalDeficit / weeklyDeficitKcal, 1)
  const months = round(weeks / 4.33, 1)

  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + Math.round(weeks * 7))
  const label = targetDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return { weightToLoseKg, totalKcalDeficit, weeks, months, targetDate: label }
}
