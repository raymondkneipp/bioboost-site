import { describe, expect, it } from "vitest"
import { calculateTrainingMax } from "./trainingMax"

describe("calculateTrainingMax", () => {
  it("default 90% of 100kg → 90.0", () => {
    const result = calculateTrainingMax({ oneRepMaxKg: 100 })
    expect(result.trainingMaxKg).toBe(90.0)
    expect(result.percentage).toBe(90)
  })

  it("custom 85% of 200kg → 170.0", () => {
    const result = calculateTrainingMax({ oneRepMaxKg: 200, percentage: 85 })
    expect(result.trainingMaxKg).toBe(170.0)
    expect(result.percentage).toBe(85)
  })

  it("rounds to 1 decimal place", () => {
    // 102.5 * 0.9 = 92.25 → 92.3
    const result = calculateTrainingMax({ oneRepMaxKg: 102.5 })
    expect(result.trainingMaxKg).toBe(92.3)
  })

  it("training max is always less than 1RM for default percentage", () => {
    const result = calculateTrainingMax({ oneRepMaxKg: 150 })
    expect(result.trainingMaxKg).toBeLessThan(150)
  })
})
