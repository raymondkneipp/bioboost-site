import { describe, expect, it } from "vitest"
import { calculateWeightLossTimeline } from "./weightLossTimeline"

describe("calculateWeightLossTimeline", () => {
  it("10kg to lose at 500 kcal/day deficit → ~15.4 weeks", () => {
    // 10kg * 7700 kcal/kg = 77000 kcal total, 77000 / (500*7) = 22 weeks
    const result = calculateWeightLossTimeline({
      currentWeightKg: 80,
      targetWeightKg: 70,
      weeklyDeficitKcal: 3500,
    })
    expect(result.weightToLoseKg).toBe(10)
    expect(result.totalKcalDeficit).toBe(77000)
    expect(result.weeks).toBeCloseTo(22, 0)
  })

  it("larger deficit → fewer weeks", () => {
    const slow = calculateWeightLossTimeline({
      currentWeightKg: 90,
      targetWeightKg: 80,
      weeklyDeficitKcal: 1750,
    })
    const fast = calculateWeightLossTimeline({
      currentWeightKg: 90,
      targetWeightKg: 80,
      weeklyDeficitKcal: 3500,
    })
    expect(fast.weeks).toBeLessThan(slow.weeks)
  })

  it("months ≈ weeks / 4.33", () => {
    const result = calculateWeightLossTimeline({
      currentWeightKg: 85,
      targetWeightKg: 80,
      weeklyDeficitKcal: 3500,
    })
    expect(result.months).toBeCloseTo(result.weeks / 4.33, 0)
  })

  it("returns a non-empty target date string", () => {
    const result = calculateWeightLossTimeline({
      currentWeightKg: 80,
      targetWeightKg: 75,
      weeklyDeficitKcal: 2000,
    })
    expect(result.targetDate).toBeTruthy()
    expect(typeof result.targetDate).toBe("string")
  })
})
