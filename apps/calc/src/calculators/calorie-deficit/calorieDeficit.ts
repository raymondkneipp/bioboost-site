import { round } from "../../math/round"
import type { CalorieDeficitInput, CalorieDeficitResult, DeficitLevel } from "./types"

const deficitKcal: Record<DeficitLevel, number> = {
  mild: 250,
  moderate: 500,
  aggressive: 750,
}

const KCAL_PER_KG = 7700

export function calculateCalorieDeficit({ tdee, deficitLevel }: CalorieDeficitInput): CalorieDeficitResult {
  const daily = deficitKcal[deficitLevel]
  const weekly = daily * 7
  return {
    dailyCalories: tdee - daily,
    weeklyDeficitKcal: weekly,
    estimatedWeeklyLossKg: round(weekly / KCAL_PER_KG, 2),
    deficitLevel,
  }
}
