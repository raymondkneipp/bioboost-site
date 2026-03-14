import { round } from "../../math/round"
import type { CaffeineInput, CaffeineResult } from "./types"

const MG_PER_KG = 5.7
const MAX_SAFE_MG = 400
const MG_PER_COFFEE_CUP = 95
const MG_PER_ESPRESSO = 63

export function calculateCaffeine({ weightKg }: CaffeineInput): CaffeineResult {
  const maxMgPerDay = Math.min(MAX_SAFE_MG, round(weightKg * MG_PER_KG, 0))
  const maxPreWorkoutMg = round(maxMgPerDay * 0.5, 0)
  const coffeeCupsEquivalent = round(maxMgPerDay / MG_PER_COFFEE_CUP, 1)
  const espressoShotsEquivalent = round(maxMgPerDay / MG_PER_ESPRESSO, 1)

  return { maxMgPerDay, maxPreWorkoutMg, coffeeCupsEquivalent, espressoShotsEquivalent }
}
