export type MaxHRFormula = "fox" | "tanaka" | "gulati"

export type HRZone = "recovery" | "fat-burn" | "aerobic" | "anaerobic" | "max"

export interface MaxHRInput {
  age: number
  formula?: MaxHRFormula
  sex?: "male" | "female"
}

export interface MaxHRResult {
  maxHR: number
  formula: MaxHRFormula
}

export interface HRZoneRange {
  zone: HRZone
  minBPM: number
  maxBPM: number
}

export interface TargetHRInput {
  age: number
  restingHR: number
  formula?: MaxHRFormula
  sex?: "male" | "female"
}

export interface TargetHRResult {
  maxHR: number
  zones: HRZoneRange[]
}
