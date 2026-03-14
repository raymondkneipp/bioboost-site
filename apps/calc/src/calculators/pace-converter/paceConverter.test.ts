import { describe, expect, it } from "vitest"
import { convertPace } from "./paceConverter"

describe("convertPace", () => {
  it("12 km/h → 5:00/km pace", () => {
    const result = convertPace({ speedKmh: 12 })
    expect(result.paceMinPerKm).toBeCloseTo(5, 2)
    expect(result.paceSecPerKm).toBe(300)
  })

  it("speed in mph converts correctly", () => {
    // 7.456 mph ≈ 12 km/h
    const result = convertPace({ speedMph: 7.456 })
    expect(result.speedKmh).toBeCloseTo(12, 0)
  })

  it("pace per mile is longer than pace per km", () => {
    const result = convertPace({ speedKmh: 10 })
    expect(result.paceMinPerMile).toBeGreaterThan(result.paceMinPerKm)
  })

  it("pace per km input matches speed output", () => {
    // 5 min/km = 12 km/h
    const result = convertPace({ paceMinPerKm: 5 })
    expect(result.speedKmh).toBeCloseTo(12, 1)
  })

  it("pace per mile input converts correctly", () => {
    // 8 min/mile = 7.5 mph ≈ 12.07 km/h
    const result = convertPace({ paceMinPerMile: 8 })
    expect(result.speedMph).toBeCloseTo(7.5, 1)
  })

  it("throws when no input provided", () => {
    expect(() => convertPace({})).toThrow()
  })
})
