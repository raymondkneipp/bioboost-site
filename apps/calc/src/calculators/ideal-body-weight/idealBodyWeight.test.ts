import { describe, expect, it } from "vitest"
import { calculateIBW } from "./idealBodyWeight"

describe("calculateIBW", () => {
  describe("Devine (default)", () => {
    it("male 175cm", () => {
      // heightIn=68.898, over60=8.898, IBW = 50 + 2.3*8.898 = 70.5
      const result = calculateIBW({ sex: "male", heightCm: 175 })
      expect(result.idealWeightKg).toBeCloseTo(70.5, 0)
      expect(result.formula).toBe("devine")
    })

    it("female 165cm", () => {
      // heightIn=64.961, over60=4.961, IBW = 45.5 + 2.3*4.961 = 56.9
      const result = calculateIBW({ sex: "female", heightCm: 165 })
      expect(result.idealWeightKg).toBeCloseTo(56.9, 0)
    })
  })

  it("Robinson male 175cm", () => {
    // 52 + 1.9*8.898 = 68.9
    const result = calculateIBW({ sex: "male", heightCm: 175, formula: "robinson" })
    expect(result.idealWeightKg).toBeCloseTo(68.9, 0)
    expect(result.formula).toBe("robinson")
  })

  it("Miller female 165cm", () => {
    // 53.1 + 1.36*4.961 = 59.8
    const result = calculateIBW({ sex: "female", heightCm: 165, formula: "miller" })
    expect(result.idealWeightKg).toBeCloseTo(59.8, 0)
  })

  it("Hamwi male 175cm", () => {
    // 48 + 2.7*8.898 = 72.0
    const result = calculateIBW({ sex: "male", heightCm: 175, formula: "hamwi" })
    expect(result.idealWeightKg).toBeCloseTo(72.0, 0)
  })
})
