import { round } from "../../math/round"
import type { CholesterolInput, CholesterolResult, CholesterolRisk } from "./types"

function riskFromRatio(ratio: number): CholesterolRisk {
  if (ratio < 3.5) return "Optimal"
  if (ratio < 5.0) return "Good"
  if (ratio < 6.0) return "Borderline"
  return "High Risk"
}

function totalCategory(total: number): string {
  if (total < 200) return "Desirable"
  if (total < 240) return "Borderline High"
  return "High"
}

function hdlCategory(hdl: number): string {
  if (hdl < 40) return "Low (risk factor)"
  if (hdl < 60) return "Normal"
  return "High (protective)"
}

function ldlCategory(ldl: number): string {
  if (ldl < 100) return "Optimal"
  if (ldl < 130) return "Near Optimal"
  if (ldl < 160) return "Borderline High"
  if (ldl < 190) return "High"
  return "Very High"
}

export function calculateCholesterol({ totalMgDl, hdlMgDl, ldlMgDl }: CholesterolInput): CholesterolResult {
  const ratio = round(totalMgDl / hdlMgDl, 2)
  return {
    ratio,
    risk: riskFromRatio(ratio),
    totalCategory: totalCategory(totalMgDl),
    hdlCategory: hdlCategory(hdlMgDl),
    ldlCategory: ldlMgDl !== undefined ? ldlCategory(ldlMgDl) : undefined,
  }
}
