import { describe, expect, it } from "vitest"
import { calculateWilks } from "./wilks"

describe("calculateWilks", () => {
  it("male 90kg, 500kg total → ~383", () => {
    const result = calculateWilks({ sex: "male", bodyWeightKg: 90, liftedKg: 500 })
    expect(result.wilks).toBeGreaterThan(375)
    expect(result.wilks).toBeLessThan(395)
  })

  it("female 60kg, 300kg total → reasonable range", () => {
    const result = calculateWilks({ sex: "female", bodyWeightKg: 60, liftedKg: 300 })
    expect(result.wilks).toBeGreaterThan(300)
    expect(result.wilks).toBeLessThan(450)
  })

  it("heavier lift → higher Wilks at same bodyweight", () => {
    const lower = calculateWilks({ sex: "male", bodyWeightKg: 80, liftedKg: 400 })
    const higher = calculateWilks({ sex: "male", bodyWeightKg: 80, liftedKg: 500 })
    expect(higher.wilks).toBeGreaterThan(lower.wilks)
  })

  it("rounds to 1 decimal place", () => {
    const result = calculateWilks({ sex: "male", bodyWeightKg: 80, liftedKg: 450 })
    const dec = result.wilks.toString().split(".")[1]
    expect(!dec || dec.length <= 1).toBe(true)
  })
})
