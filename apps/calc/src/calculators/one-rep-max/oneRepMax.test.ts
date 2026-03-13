import { describe, expect, it } from "vitest"
import { calculateOneRepMax } from "./oneRepMax"

describe("calculateOneRepMax", () => {
  describe("Epley (default)", () => {
    it("known value: 100kg for 5 reps", () => {
      // 100 * (1 + 5/30) = 100 * 1.1667 = 116.7
      const result = calculateOneRepMax({ weightKg: 100, reps: 5 })
      expect(result.oneRepMaxKg).toBe(116.7)
      expect(result.formula).toBe("epley")
    })

    it("reps === 1 edge case returns weightKg", () => {
      const result = calculateOneRepMax({ weightKg: 100, reps: 1 })
      expect(result.oneRepMaxKg).toBe(100)
    })
  })

  describe("Brzycki", () => {
    it("known value: 100kg for 5 reps", () => {
      // 100 * (36 / (37 - 5)) = 100 * (36/32) = 112.5
      const result = calculateOneRepMax({ weightKg: 100, reps: 5, formula: "brzycki" })
      expect(result.oneRepMaxKg).toBe(112.5)
      expect(result.formula).toBe("brzycki")
    })

    it("reps === 1 edge case returns weightKg", () => {
      const result = calculateOneRepMax({ weightKg: 80, reps: 1, formula: "brzycki" })
      expect(result.oneRepMaxKg).toBe(80)
    })
  })

  describe("Lombardi", () => {
    it("known value: 100kg for 5 reps", () => {
      // 100 * 5^0.1 = 100 * 1.17462... = 117.5
      const result = calculateOneRepMax({ weightKg: 100, reps: 5, formula: "lombardi" })
      expect(result.oneRepMaxKg).toBe(117.5)
      expect(result.formula).toBe("lombardi")
    })

    it("reps === 1 edge case returns weightKg", () => {
      const result = calculateOneRepMax({ weightKg: 90, reps: 1, formula: "lombardi" })
      expect(result.oneRepMaxKg).toBe(90)
    })
  })

  it("rounds to 1 decimal place", () => {
    const result = calculateOneRepMax({ weightKg: 75, reps: 8 })
    const decimals = result.oneRepMaxKg.toString().split(".")[1]
    expect(!decimals || decimals.length <= 1).toBe(true)
  })
})
