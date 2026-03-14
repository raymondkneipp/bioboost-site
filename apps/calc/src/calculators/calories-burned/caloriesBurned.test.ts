import { describe, expect, it } from "vitest"
import { calculateCaloriesBurned } from "./caloriesBurned"

describe("calculateCaloriesBurned", () => {
  it("70kg running moderate for 30min → ~172 kcal", () => {
    // MET 9.8 * 70 * 0.5 = 343 kcal
    const result = calculateCaloriesBurned({
      activity: "running-moderate",
      weightKg: 70,
      durationMinutes: 30,
    })
    expect(result.kcal).toBe(343)
  })

  it("heavier person burns more calories for same activity/duration", () => {
    const light = calculateCaloriesBurned({ activity: "walking-moderate", weightKg: 60, durationMinutes: 30 })
    const heavy = calculateCaloriesBurned({ activity: "walking-moderate", weightKg: 90, durationMinutes: 30 })
    expect(heavy.kcal).toBeGreaterThan(light.kcal)
  })

  it("longer duration burns more calories", () => {
    const short = calculateCaloriesBurned({ activity: "cycling-moderate", weightKg: 75, durationMinutes: 30 })
    const long = calculateCaloriesBurned({ activity: "cycling-moderate", weightKg: 75, durationMinutes: 60 })
    expect(long.kcal).toBeGreaterThan(short.kcal)
  })

  it("returns activity label and MET value", () => {
    const result = calculateCaloriesBurned({ activity: "yoga", weightKg: 65, durationMinutes: 60 })
    expect(result.activityLabel).toBe("Yoga")
    expect(result.met).toBe(2.5)
  })
})
