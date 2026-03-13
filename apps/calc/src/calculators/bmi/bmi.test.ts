import { describe, expect, it } from "vitest"
import { calculateBMI } from "./bmi"

describe("calculateBMI", () => {
  it("underweight: BMI < 18.5", () => {
    const result = calculateBMI({ weightKg: 45, heightM: 1.75 })
    expect(result.bmi).toBe(14.7)
    expect(result.category).toBe("Underweight")
  })

  it("normal: 18.5 ≤ BMI < 25", () => {
    const result = calculateBMI({ weightKg: 70, heightM: 1.75 })
    expect(result.bmi).toBe(22.9)
    expect(result.category).toBe("Normal")
  })

  it("overweight: 25 ≤ BMI < 30", () => {
    const result = calculateBMI({ weightKg: 85, heightM: 1.75 })
    expect(result.bmi).toBe(27.8)
    expect(result.category).toBe("Overweight")
  })

  it("obese class I: 30 ≤ BMI < 35", () => {
    const result = calculateBMI({ weightKg: 100, heightM: 1.75 })
    expect(result.bmi).toBe(32.7)
    expect(result.category).toBe("Obese Class I")
  })

  it("obese class II: 35 ≤ BMI < 40", () => {
    const result = calculateBMI({ weightKg: 115, heightM: 1.75 })
    expect(result.bmi).toBe(37.6)
    expect(result.category).toBe("Obese Class II")
  })

  it("obese class III: BMI ≥ 40", () => {
    const result = calculateBMI({ weightKg: 135, heightM: 1.75 })
    expect(result.bmi).toBe(44.1)
    expect(result.category).toBe("Obese Class III")
  })

  it("rounds to 1 decimal place", () => {
    const result = calculateBMI({ weightKg: 68, heightM: 1.72 })
    expect(result.bmi).toBe(23.0)
  })
})
