import { describe, expect, it } from "vitest"
import { calculateBloodPressure } from "./bloodPressure"

describe("calculateBloodPressure", () => {
  it("115/75 → Normal", () => {
    expect(calculateBloodPressure({ systolic: 115, diastolic: 75 }).category).toBe("Normal")
  })

  it("125/75 → Elevated", () => {
    expect(calculateBloodPressure({ systolic: 125, diastolic: 75 }).category).toBe("Elevated")
  })

  it("135/85 → High Stage 1", () => {
    expect(calculateBloodPressure({ systolic: 135, diastolic: 85 }).category).toBe("High Stage 1")
  })

  it("150/95 → High Stage 2", () => {
    expect(calculateBloodPressure({ systolic: 150, diastolic: 95 }).category).toBe("High Stage 2")
  })

  it("185/100 → Hypertensive Crisis", () => {
    expect(calculateBloodPressure({ systolic: 185, diastolic: 100 }).category).toBe("Hypertensive Crisis")
  })

  it("85/55 → Low", () => {
    expect(calculateBloodPressure({ systolic: 85, diastolic: 55 }).category).toBe("Low")
  })

  it("echoes back systolic and diastolic", () => {
    const result = calculateBloodPressure({ systolic: 120, diastolic: 80 })
    expect(result.systolic).toBe(120)
    expect(result.diastolic).toBe(80)
  })
})
