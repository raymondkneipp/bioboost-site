export type CholesterolRisk = "Optimal" | "Good" | "Borderline" | "High Risk"

export interface CholesterolInput {
  totalMgDl: number
  hdlMgDl: number
  ldlMgDl?: number
  triglycerideMgDl?: number
}

export interface CholesterolResult {
  ratio: number
  risk: CholesterolRisk
  totalCategory: string
  hdlCategory: string
  ldlCategory?: string
}
