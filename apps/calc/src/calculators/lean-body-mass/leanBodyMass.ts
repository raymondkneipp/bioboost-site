import { round } from "../../math/round"
import type { LBMFormula, LBMInput, LBMResult } from "./types"

function boer(sex: "male" | "female", weightKg: number, heightCm: number): number {
  return sex === "male"
    ? 0.407 * weightKg + 0.267 * heightCm - 19.2
    : 0.252 * weightKg + 0.473 * heightCm - 48.3
}

function james(sex: "male" | "female", weightKg: number, heightCm: number): number {
  const ratio = weightKg / heightCm
  return sex === "male"
    ? 1.1 * weightKg - 128 * ratio * ratio
    : 1.07 * weightKg - 148 * ratio * ratio
}

function hume(sex: "male" | "female", weightKg: number, heightCm: number): number {
  return sex === "male"
    ? 0.3281 * weightKg + 0.3393 * heightCm - 29.5336
    : 0.29569 * weightKg + 0.41813 * heightCm - 43.2933
}

export function calculateLBM({ sex, weightKg, heightCm, formula = "boer" }: LBMInput): LBMResult {
  const formulaFn: Record<LBMFormula, () => number> = {
    boer: () => boer(sex, weightKg, heightCm),
    james: () => james(sex, weightKg, heightCm),
    hume: () => hume(sex, weightKg, heightCm),
  }
  return { leanMassKg: round(formulaFn[formula](), 1), formula }
}
