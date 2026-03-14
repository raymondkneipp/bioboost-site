import { describe, expect, it } from "vitest"
import { calculateCaffeine } from "./caffeine"

describe("calculateCaffeine", () => {
  it("70kg → max 399mg/day (capped at 400)", () => {
    // 70 * 5.7 = 399
    const result = calculateCaffeine({ weightKg: 70 })
    expect(result.maxMgPerDay).toBe(399)
  })

  it("100kg → capped at 400mg/day", () => {
    // 100 * 5.7 = 570, capped at 400
    const result = calculateCaffeine({ weightKg: 100 })
    expect(result.maxMgPerDay).toBe(400)
  })

  it("pre-workout dose is half of daily max", () => {
    const result = calculateCaffeine({ weightKg: 70 })
    expect(Math.abs(result.maxPreWorkoutMg - result.maxMgPerDay * 0.5)).toBeLessThanOrEqual(1)
  })

  it("coffee cups equivalent > 0", () => {
    const result = calculateCaffeine({ weightKg: 70 })
    expect(result.coffeeCupsEquivalent).toBeGreaterThan(0)
    expect(result.espressoShotsEquivalent).toBeGreaterThan(0)
  })

  it("espresso shots > coffee cups (espresso has less mg per serving)", () => {
    const result = calculateCaffeine({ weightKg: 70 })
    expect(result.espressoShotsEquivalent).toBeGreaterThan(result.coffeeCupsEquivalent)
  })
})
