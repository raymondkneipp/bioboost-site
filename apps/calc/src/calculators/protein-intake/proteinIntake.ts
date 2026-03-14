import { round } from "../../math/round"
import type { ProteinGoal, ProteinIntakeInput, ProteinIntakeResult } from "./types"

const proteinRanges: Record<ProteinGoal, [number, number]> = {
  sedentary: [0.8, 1.0],
  active: [1.2, 1.6],
  athlete: [1.6, 2.0],
  strength: [1.8, 2.4],
}

export function calculateProteinIntake({ weightKg, goal }: ProteinIntakeInput): ProteinIntakeResult {
  const [min, max] = proteinRanges[goal]
  return {
    minGrams: round(weightKg * min, 0),
    maxGrams: round(weightKg * max, 0),
    goal,
  }
}
