import { describe, expect, it } from "vitest"
import { calculateLBM } from "./leanBodyMass"

describe("calculateLBM", () => {
  describe("Boer (default)", () => {
    it("male 80kg 175cm", () => {
      // 0.407*80 + 0.267*175 - 19.2 = 32.56 + 46.725 - 19.2 = 60.1
      const result = calculateLBM({ sex: "male", weightKg: 80, heightCm: 175 })
      expect(result.leanMassKg).toBeCloseTo(60.1, 0)
      expect(result.formula).toBe("boer")
    })

    it("female 60kg 165cm", () => {
      // 0.252*60 + 0.473*165 - 48.3 = 15.12 + 78.045 - 48.3 = 44.9
      const result = calculateLBM({ sex: "female", weightKg: 60, heightCm: 165 })
      expect(result.leanMassKg).toBeCloseTo(44.9, 0)
    })
  })

  it("James male 80kg 175cm", () => {
    // ratio=80/175=0.4571; 1.1*80 - 128*(0.4571²) = 88 - 26.7 = 61.3
    const result = calculateLBM({ sex: "male", weightKg: 80, heightCm: 175, formula: "james" })
    expect(result.leanMassKg).toBeCloseTo(61.3, 0)
    expect(result.formula).toBe("james")
  })

  it("Hume female 60kg 165cm", () => {
    // 0.29569*60 + 0.41813*165 - 43.2933 = 17.74 + 68.99 - 43.29 = 43.4
    const result = calculateLBM({ sex: "female", weightKg: 60, heightCm: 165, formula: "hume" })
    expect(result.leanMassKg).toBeCloseTo(43.4, 0)
  })

  it("LBM is less than total weight", () => {
    const result = calculateLBM({ sex: "male", weightKg: 80, heightCm: 175 })
    expect(result.leanMassKg).toBeLessThan(80)
  })
})
