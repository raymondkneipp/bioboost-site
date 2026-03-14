import { round } from "../../math/round"
import type { RepMaxInput, RepMaxResult } from "./types"

const PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50]

export function calculateRepMax({ oneRepMaxKg }: RepMaxInput): RepMaxResult {
  return {
    entries: PERCENTAGES.map((pct) => ({
      percentage: pct,
      weightKg: round(oneRepMaxKg * (pct / 100), 1),
    })),
  }
}
