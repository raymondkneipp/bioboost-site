import { describe, expect, it } from "vitest"
import { calculateMaxHR, calculateTargetHR } from "./heartRate"

describe("calculateMaxHR", () => {
  it("Tanaka age 30 → 187 bpm (default)", () => {
    const result = calculateMaxHR({ age: 30 })
    expect(result.maxHR).toBe(187)
    expect(result.formula).toBe("tanaka")
  })

  it("Fox age 30 → 190 bpm", () => {
    const result = calculateMaxHR({ age: 30, formula: "fox" })
    expect(result.maxHR).toBe(190)
  })

  it("Gulati age 40 → 171 bpm", () => {
    // 206 - 0.88*40 = 206 - 35.2 = 170.8 → 171
    const result = calculateMaxHR({ age: 40, formula: "gulati" })
    expect(result.maxHR).toBe(171)
  })

  it("older age → lower max HR", () => {
    const young = calculateMaxHR({ age: 20 })
    const old = calculateMaxHR({ age: 60 })
    expect(old.maxHR).toBeLessThan(young.maxHR)
  })
})

describe("calculateTargetHR", () => {
  it("produces 5 zones", () => {
    expect(calculateTargetHR({ age: 30, restingHR: 65 }).zones).toHaveLength(5)
  })

  it("aerobic zone age 30, resting 65 (Tanaka)", () => {
    // maxHR=187, hrr=122, aerobic 70–80%
    // min=round(122*0.7+65)=round(150.4)=150, max=round(122*0.8+65)=round(162.6)=163
    const { zones } = calculateTargetHR({ age: 30, restingHR: 65 })
    // biome-ignore lint/style/noNonNullAssertion: find() result is guaranteed in test data
    const aerobic = zones.find((z) => z.zone === "aerobic")!
    expect(aerobic.minBPM).toBe(150)
    expect(aerobic.maxBPM).toBe(163)
  })

  it("zones minBPM increase across zones", () => {
    const { zones } = calculateTargetHR({ age: 30, restingHR: 60 })
    for (let i = 1; i < zones.length; i++) {
      expect(zones[i].minBPM).toBeGreaterThan(zones[i - 1].minBPM)
    }
  })
})
