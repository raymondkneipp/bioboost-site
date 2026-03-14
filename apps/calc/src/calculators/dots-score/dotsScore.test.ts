import { describe, expect, it } from "vitest"
import { calculateDots } from "./dotsScore"

describe("calculateDots", () => {
  it("83kg male lifting 600kg total → ~408 DOTS", () => {
    // Reference value from DOTS formula
    const result = calculateDots({ sex: "male", bodyWeightKg: 83, liftedKg: 600 })
    expect(result.dots).toBeGreaterThan(400)
    expect(result.dots).toBeLessThan(430)
  })

  it("72kg female lifting 400kg total → ~370+ DOTS", () => {
    const result = calculateDots({ sex: "female", bodyWeightKg: 72, liftedKg: 400 })
    expect(result.dots).toBeGreaterThan(350)
    expect(result.dots).toBeLessThan(450)
  })

  it("heavier total → higher DOTS at same body weight", () => {
    const low = calculateDots({ sex: "male", bodyWeightKg: 90, liftedKg: 500 })
    const high = calculateDots({ sex: "male", bodyWeightKg: 90, liftedKg: 700 })
    expect(high.dots).toBeGreaterThan(low.dots)
  })

  it("female and male get different scores for same inputs", () => {
    const male = calculateDots({ sex: "male", bodyWeightKg: 80, liftedKg: 500 })
    const female = calculateDots({ sex: "female", bodyWeightKg: 80, liftedKg: 500 })
    expect(male.dots).not.toBe(female.dots)
  })

  it("returns a positive score", () => {
    const result = calculateDots({ sex: "male", bodyWeightKg: 100, liftedKg: 800 })
    expect(result.dots).toBeGreaterThan(0)
  })
})
