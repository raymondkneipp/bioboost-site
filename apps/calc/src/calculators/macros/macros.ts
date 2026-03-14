import { round } from "../../math/round"
import type { MacroGoal, MacrosInput, MacrosResult } from "./types"

// [protein%, carbs%, fat%]
const macroSplits: Record<MacroGoal, [number, number, number]> = {
  maintenance: [30, 40, 30],
  "fat-loss": [40, 30, 30],
  "muscle-gain": [30, 50, 20],
  keto: [25, 5, 70],
}

export function calculateMacros({ calories, goal }: MacrosInput): MacrosResult {
  const [proteinPct, carbsPct, fatPct] = macroSplits[goal]
  return {
    proteinG: round((calories * proteinPct) / 100 / 4, 0),
    carbsG: round((calories * carbsPct) / 100 / 4, 0),
    fatG: round((calories * fatPct) / 100 / 9, 0),
    proteinPct,
    carbsPct,
    fatPct,
    goal,
  }
}
