import { round } from "../../math/round"
import { brzycki, epley, lombardi } from "./formulas"
import type { OneRepMaxInput, OneRepMaxResult } from "./types"

export function calculateOneRepMax({ weightKg, reps, formula = "epley" }: OneRepMaxInput): OneRepMaxResult {
  let raw: number
  if (formula === "brzycki") {
    raw = brzycki(weightKg, reps)
  } else if (formula === "lombardi") {
    raw = lombardi(weightKg, reps)
  } else {
    raw = epley(weightKg, reps)
  }
  return { oneRepMaxKg: round(raw, 1), formula }
}
