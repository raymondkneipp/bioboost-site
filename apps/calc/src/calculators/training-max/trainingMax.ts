import { round } from "../../math/round"
import type { TrainingMaxInput, TrainingMaxResult } from "./types"

export function calculateTrainingMax({ oneRepMaxKg, percentage = 90 }: TrainingMaxInput): TrainingMaxResult {
  return {
    trainingMaxKg: round(oneRepMaxKg * (percentage / 100), 1),
    percentage,
  }
}
