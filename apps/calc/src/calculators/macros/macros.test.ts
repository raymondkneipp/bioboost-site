import { describe, expect, it } from "vitest"
import { calculateMacros } from "./macros"

describe("calculateMacros", () => {
  it("maintenance 2000 kcal (30/40/30)", () => {
    const result = calculateMacros({ calories: 2000, goal: "maintenance" })
    expect(result.proteinG).toBe(150)
    expect(result.carbsG).toBe(200)
    expect(result.fatG).toBe(67)
  })

  it("fat-loss 2000 kcal (40/30/30)", () => {
    const result = calculateMacros({ calories: 2000, goal: "fat-loss" })
    expect(result.proteinG).toBe(200)
    expect(result.carbsG).toBe(150)
    expect(result.fatG).toBe(67)
  })

  it("muscle-gain 2500 kcal (30/50/20)", () => {
    const result = calculateMacros({ calories: 2500, goal: "muscle-gain" })
    expect(result.proteinG).toBe(188)
    expect(result.carbsG).toBe(313)
    expect(result.fatG).toBe(56)
  })

  it("keto 2000 kcal (25/5/70)", () => {
    const result = calculateMacros({ calories: 2000, goal: "keto" })
    expect(result.proteinG).toBe(125)
    expect(result.carbsG).toBe(25)
    expect(result.fatG).toBe(156)
  })

  it("percentages stored in result", () => {
    const result = calculateMacros({ calories: 2000, goal: "fat-loss" })
    expect(result.proteinPct).toBe(40)
    expect(result.carbsPct).toBe(30)
    expect(result.fatPct).toBe(30)
  })
})
