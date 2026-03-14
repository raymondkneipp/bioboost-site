import { describe, expect, it } from "vitest"
import { calculateRepMax } from "./repMax"

describe("calculateRepMax", () => {
  it("generates 11 entries", () => {
    expect(calculateRepMax({ oneRepMaxKg: 100 }).entries).toHaveLength(11)
  })

  it("100% entry equals 1RM", () => {
    const { entries } = calculateRepMax({ oneRepMaxKg: 100 })
    expect(entries[0]).toEqual({ percentage: 100, weightKg: 100 })
  })

  it("50% entry is half of 1RM", () => {
    const { entries } = calculateRepMax({ oneRepMaxKg: 100 })
    const fifty = entries.find((e) => e.percentage === 50)
    expect(fifty?.weightKg).toBe(50)
  })

  it("90% of 150kg → 135kg", () => {
    const { entries } = calculateRepMax({ oneRepMaxKg: 150 })
    const ninety = entries.find((e) => e.percentage === 90)
    expect(ninety?.weightKg).toBe(135)
  })

  it("entries are in descending percentage order", () => {
    const { entries } = calculateRepMax({ oneRepMaxKg: 100 })
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].percentage).toBeLessThan(entries[i - 1].percentage)
    }
  })
})
