import { describe, expect, it } from "vitest"
import { calculateVO2Max } from "./vo2Max"

describe("calculateVO2Max (Cooper 12-min test)", () => {
  it("2400m → ~42.4 ml/kg/min (Good)", () => {
    // (2400 - 504.9) / 44.73 = 1895.1 / 44.73 ≈ 42.4
    const result = calculateVO2Max({ distanceMeters: 2400 })
    expect(result.vo2max).toBeCloseTo(42.4, 0)
    expect(result.fitnessCategory).toBe("Good")
  })

  it("3200m → Superior", () => {
    // (3200 - 504.9) / 44.73 ≈ 60.2
    const result = calculateVO2Max({ distanceMeters: 3200 })
    expect(result.vo2max).toBeGreaterThan(58)
    expect(result.fitnessCategory).toBe("Superior")
  })

  it("1800m → Poor", () => {
    // (1800 - 504.9) / 44.73 ≈ 28.9
    const result = calculateVO2Max({ distanceMeters: 1800 })
    expect(result.fitnessCategory).toBe("Poor")
  })

  it("farther distance → higher VO2max", () => {
    const slow = calculateVO2Max({ distanceMeters: 2000 })
    const fast = calculateVO2Max({ distanceMeters: 3000 })
    expect(fast.vo2max).toBeGreaterThan(slow.vo2max)
  })
})
