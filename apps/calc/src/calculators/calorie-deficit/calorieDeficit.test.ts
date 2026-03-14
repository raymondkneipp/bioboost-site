import { describe, expect, it } from "vitest"
import { calculateCalorieDeficit } from "./calorieDeficit"

describe("calculateCalorieDeficit", () => {
  it("mild: -250 kcal/day", () => {
    const result = calculateCalorieDeficit({ tdee: 2500, deficitLevel: "mild" })
    expect(result.dailyCalories).toBe(2250)
    expect(result.weeklyDeficitKcal).toBe(1750)
    expect(result.estimatedWeeklyLossKg).toBeCloseTo(0.23, 1)
  })

  it("moderate: -500 kcal/day", () => {
    const result = calculateCalorieDeficit({ tdee: 2500, deficitLevel: "moderate" })
    expect(result.dailyCalories).toBe(2000)
    expect(result.weeklyDeficitKcal).toBe(3500)
    expect(result.estimatedWeeklyLossKg).toBeCloseTo(0.45, 1)
  })

  it("aggressive: -750 kcal/day", () => {
    const result = calculateCalorieDeficit({ tdee: 2500, deficitLevel: "aggressive" })
    expect(result.dailyCalories).toBe(1750)
    expect(result.weeklyDeficitKcal).toBe(5250)
    expect(result.estimatedWeeklyLossKg).toBeCloseTo(0.68, 1)
  })
})
