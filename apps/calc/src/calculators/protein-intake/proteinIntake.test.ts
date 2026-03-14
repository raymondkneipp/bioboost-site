import { describe, expect, it } from "vitest"
import { calculateProteinIntake } from "./proteinIntake"

describe("calculateProteinIntake", () => {
  it("sedentary 80kg → 64–80g", () => {
    const result = calculateProteinIntake({ weightKg: 80, goal: "sedentary" })
    expect(result.minGrams).toBe(64)
    expect(result.maxGrams).toBe(80)
    expect(result.goal).toBe("sedentary")
  })

  it("active 80kg → 96–128g", () => {
    const result = calculateProteinIntake({ weightKg: 80, goal: "active" })
    expect(result.minGrams).toBe(96)
    expect(result.maxGrams).toBe(128)
  })

  it("strength 70kg → 126–168g", () => {
    const result = calculateProteinIntake({ weightKg: 70, goal: "strength" })
    expect(result.minGrams).toBe(126)
    expect(result.maxGrams).toBe(168)
  })

  it("min is always less than max", () => {
    const goals: Array<import("./types").ProteinGoal> = ["sedentary", "active", "athlete", "strength"]
    for (const goal of goals) {
      const { minGrams, maxGrams } = calculateProteinIntake({ weightKg: 70, goal })
      expect(minGrams).toBeLessThan(maxGrams)
    }
  })
})
