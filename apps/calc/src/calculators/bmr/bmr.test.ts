import { describe, expect, it } from "vitest"
import { calculateBMR } from "./bmr"

describe("calculateBMR", () => {
  describe("Mifflin-St Jeor (default)", () => {
    it("male reference value", () => {
      // 10*80 + 6.25*175 - 5*30 + 5 = 800 + 1093.75 - 150 + 5 = 1748.75 → 1749
      const result = calculateBMR({ weightKg: 80, heightCm: 175, ageYears: 30, sex: "male" })
      expect(result.bmr).toBe(1749)
      expect(result.formula).toBe("mifflin-st-jeor")
    })

    it("female reference value", () => {
      // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 → 1345
      const result = calculateBMR({ weightKg: 60, heightCm: 165, ageYears: 25, sex: "female" })
      expect(result.bmr).toBe(1345)
      expect(result.formula).toBe("mifflin-st-jeor")
    })
  })

  describe("Harris-Benedict", () => {
    it("male reference value", () => {
      // 88.362 + 13.397*80 + 4.799*175 - 5.677*30
      // = 88.362 + 1071.76 + 839.825 - 170.31 = 1829.637 → 1830
      const result = calculateBMR({
        weightKg: 80,
        heightCm: 175,
        ageYears: 30,
        sex: "male",
        formula: "harris-benedict",
      })
      expect(result.bmr).toBe(1830)
      expect(result.formula).toBe("harris-benedict")
    })

    it("female reference value", () => {
      // 447.593 + 9.247*60 + 3.098*165 - 4.33*25
      // = 447.593 + 554.82 + 511.17 - 108.25 = 1405.333 → 1405
      const result = calculateBMR({
        weightKg: 60,
        heightCm: 165,
        ageYears: 25,
        sex: "female",
        formula: "harris-benedict",
      })
      expect(result.bmr).toBe(1405)
      expect(result.formula).toBe("harris-benedict")
    })
  })

  it("rounds to 0 decimal places", () => {
    const result = calculateBMR({ weightKg: 75, heightCm: 170, ageYears: 35, sex: "male" })
    expect(Number.isInteger(result.bmr)).toBe(true)
  })
})
