import { describe, expect, it } from "vitest"
import { calculateRunningPace } from "./runningPace"

describe("calculateRunningPace", () => {
  it("10km in 50min → 5:00/km, 12 km/h", () => {
    const result = calculateRunningPace({ distanceKm: 10, hours: 0, minutes: 50, seconds: 0 })
    expect(result.paceSecPerKm).toBe(300)
    expect(result.speedKmh).toBe(12)
  })

  it("pace per mile is longer than pace per km", () => {
    const result = calculateRunningPace({ distanceKm: 10, hours: 0, minutes: 50, seconds: 0 })
    expect(result.paceSecPerMile).toBeGreaterThan(result.paceSecPerKm)
  })

  it("speed in mph is less than km/h", () => {
    const result = calculateRunningPace({ distanceKm: 10, hours: 0, minutes: 50, seconds: 0 })
    expect(result.speedMph).toBeLessThan(result.speedKmh)
  })

  it("5km in 25min → same pace as 10km in 50min", () => {
    const a = calculateRunningPace({ distanceKm: 5, hours: 0, minutes: 25, seconds: 0 })
    const b = calculateRunningPace({ distanceKm: 10, hours: 0, minutes: 50, seconds: 0 })
    expect(a.paceSecPerKm).toBe(b.paceSecPerKm)
  })
})
