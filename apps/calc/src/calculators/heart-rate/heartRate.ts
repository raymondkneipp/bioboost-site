import { round } from "../../math/round"
import type { HRZone, HRZoneRange, MaxHRInput, MaxHRResult, TargetHRInput, TargetHRResult } from "./types"

export function calculateMaxHR({ age, formula = "tanaka", sex = "male" }: MaxHRInput): MaxHRResult {
  let maxHR: number
  if (formula === "fox") {
    maxHR = 220 - age
  } else if (formula === "gulati") {
    maxHR = 206 - 0.88 * age
  } else {
    maxHR = 208 - 0.7 * age // tanaka
  }
  // suppress unused sex warning — Gulati is female-specific but we accept it for all
  void sex
  return { maxHR: round(maxHR, 0), formula }
}

const ZONE_RANGES: Record<HRZone, [number, number]> = {
  recovery: [0.5, 0.6],
  "fat-burn": [0.6, 0.7],
  aerobic: [0.7, 0.8],
  anaerobic: [0.8, 0.9],
  max: [0.9, 1.0],
}

export function calculateTargetHR({ age, restingHR, formula = "tanaka", sex = "male" }: TargetHRInput): TargetHRResult {
  const { maxHR } = calculateMaxHR({ age, formula, sex })
  const hrr = maxHR - restingHR
  const zones: HRZoneRange[] = (Object.entries(ZONE_RANGES) as [HRZone, [number, number]][]).map(
    ([zone, [lo, hi]]) => ({
      zone,
      minBPM: round(hrr * lo + restingHR, 0),
      maxBPM: round(hrr * hi + restingHR, 0),
    }),
  )
  return { maxHR, zones }
}
