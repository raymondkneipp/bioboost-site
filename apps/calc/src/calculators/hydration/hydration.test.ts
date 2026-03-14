import { describe, expect, it } from "vitest"
import { calculateHydration } from "./hydration"

describe("calculateHydration", () => {
  it("70kg no exercise → 2.45L/day", () => {
    const result = calculateHydration({ weightKg: 70 })
    expect(result.baselineLiters).toBe(2.45)
    expect(result.exerciseLiters).toBe(0)
    expect(result.dailyLiters).toBe(2.45)
  })

  it("60min exercise adds 1L", () => {
    const base = calculateHydration({ weightKg: 70 })
    const active = calculateHydration({ weightKg: 70, activityMinutes: 60 })
    expect(active.dailyLiters).toBeCloseTo(base.dailyLiters + 1, 2)
  })

  it("heavier person needs more water", () => {
    const light = calculateHydration({ weightKg: 60 })
    const heavy = calculateHydration({ weightKg: 90 })
    expect(heavy.dailyLiters).toBeGreaterThan(light.dailyLiters)
  })

  it("returns oz equivalent", () => {
    const result = calculateHydration({ weightKg: 70 })
    expect(result.dailyOz).toBeGreaterThan(0)
    expect(result.glasses8oz).toBeGreaterThan(0)
  })

  it("45min exercise adds 500ml (rounds down to 1 * 30min interval)", () => {
    const result = calculateHydration({ weightKg: 70, activityMinutes: 45 })
    expect(result.exerciseLiters).toBe(0.5)
  })
})
