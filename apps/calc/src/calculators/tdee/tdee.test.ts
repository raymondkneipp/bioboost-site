import { describe, expect, it } from "vitest"
import { calculateTDEE } from "./tdee"

describe("calculateTDEE", () => {
  it("male moderate activity", () => {
    // BMR (Mifflin) = 10*80 + 6.25*175 - 5*30 + 5 = 1749, TDEE = round(1749 * 1.55) = 2711
    const result = calculateTDEE({
      weightKg: 80,
      heightCm: 175,
      ageYears: 30,
      sex: "male",
      activityLevel: "moderate",
    })
    expect(result.bmr).toBe(1749)
    expect(result.tdee).toBe(2711)
    expect(result.activityLevel).toBe("moderate")
  })

  it("female sedentary", () => {
    // BMR (Mifflin) = 10*60 + 6.25*165 - 5*25 - 161 = 1345, TDEE = round(1345 * 1.2) = 1614
    const result = calculateTDEE({
      weightKg: 60,
      heightCm: 165,
      ageYears: 25,
      sex: "female",
      activityLevel: "sedentary",
    })
    expect(result.bmr).toBe(1345)
    expect(result.tdee).toBe(1614)
  })

  it("very-active uses 1.9 multiplier", () => {
    // 1749 * 1.9 = 3323.1 → 3323
    const result = calculateTDEE({
      weightKg: 80,
      heightCm: 175,
      ageYears: 30,
      sex: "male",
      activityLevel: "very-active",
    })
    expect(result.tdee).toBe(3323)
  })

  it("harris-benedict formula produces different BMR", () => {
    const mifflin = calculateTDEE({ weightKg: 80, heightCm: 175, ageYears: 30, sex: "male", activityLevel: "moderate", formula: "mifflin-st-jeor" })
    const harris = calculateTDEE({ weightKg: 80, heightCm: 175, ageYears: 30, sex: "male", activityLevel: "moderate", formula: "harris-benedict" })
    expect(mifflin.bmr).not.toBe(harris.bmr)
  })
})
