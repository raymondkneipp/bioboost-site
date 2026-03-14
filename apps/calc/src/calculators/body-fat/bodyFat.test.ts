import { describe, expect, it } from "vitest"
import { calculateBodyFat } from "./bodyFat"

describe("calculateBodyFat (US Navy formula)", () => {
  it("male reference value", () => {
    // 495 / (1.0324 - 0.19077*log10(47) + 0.15456*log10(175)) - 450 ≈ 16.9%
    const result = calculateBodyFat({
      sex: "male",
      weightKg: 80,
      heightCm: 175,
      waistCm: 85,
      neckCm: 38,
    })
    expect(result.bodyFatPct).toBeCloseTo(16.9, 0)
    expect(result.fatMassKg + result.leanMassKg).toBeCloseTo(80, 1)
  })

  it("female reference value", () => {
    // waist=72, hip=97, neck=33, height=165 → ~26.4%
    const result = calculateBodyFat({
      sex: "female",
      weightKg: 60,
      heightCm: 165,
      waistCm: 72,
      neckCm: 33,
      hipCm: 97,
    })
    expect(result.bodyFatPct).toBeCloseTo(26.4, 0)
    expect(result.fatMassKg + result.leanMassKg).toBeCloseTo(60, 1)
  })

  it("fat + lean mass equals total weight", () => {
    const result = calculateBodyFat({ sex: "male", weightKg: 75, heightCm: 178, waistCm: 82, neckCm: 37 })
    expect(result.fatMassKg + result.leanMassKg).toBeCloseTo(75, 0)
  })
})
