import { round } from "../../math/round"
import type { IBWFormula, IBWInput, IBWResult } from "./types"

function heightInches(heightCm: number): number {
  return heightCm / 2.54
}

function devine(sex: "male" | "female", heightCm: number): number {
  const over60 = heightInches(heightCm) - 60
  return sex === "male" ? 50 + 2.3 * over60 : 45.5 + 2.3 * over60
}

function robinson(sex: "male" | "female", heightCm: number): number {
  const over60 = heightInches(heightCm) - 60
  return sex === "male" ? 52 + 1.9 * over60 : 49 + 1.7 * over60
}

function miller(sex: "male" | "female", heightCm: number): number {
  const over60 = heightInches(heightCm) - 60
  return sex === "male" ? 56.2 + 1.41 * over60 : 53.1 + 1.36 * over60
}

function hamwi(sex: "male" | "female", heightCm: number): number {
  const over60 = heightInches(heightCm) - 60
  return sex === "male" ? 48 + 2.7 * over60 : 45.5 + 2.2 * over60
}

export function calculateIBW({ sex, heightCm, formula = "devine" }: IBWInput): IBWResult {
  const formulaFn: Record<IBWFormula, () => number> = {
    devine: () => devine(sex, heightCm),
    robinson: () => robinson(sex, heightCm),
    miller: () => miller(sex, heightCm),
    hamwi: () => hamwi(sex, heightCm),
  }
  return { idealWeightKg: round(formulaFn[formula](), 1), formula }
}
