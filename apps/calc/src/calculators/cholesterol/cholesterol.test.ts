import { describe, expect, it } from "vitest"
import { calculateCholesterol } from "./cholesterol"

describe("calculateCholesterol", () => {
  it("ratio < 3.5 → Optimal", () => {
    const result = calculateCholesterol({ totalMgDl: 170, hdlMgDl: 60 })
    expect(result.ratio).toBeCloseTo(2.83, 1)
    expect(result.risk).toBe("Optimal")
  })

  it("ratio 4.0 → Good", () => {
    const result = calculateCholesterol({ totalMgDl: 200, hdlMgDl: 50 })
    expect(result.ratio).toBe(4)
    expect(result.risk).toBe("Good")
  })

  it("ratio 5.5 → Borderline", () => {
    const result = calculateCholesterol({ totalMgDl: 220, hdlMgDl: 40 })
    expect(result.ratio).toBe(5.5)
    expect(result.risk).toBe("Borderline")
  })

  it("ratio ≥ 6 → High Risk", () => {
    const result = calculateCholesterol({ totalMgDl: 240, hdlMgDl: 35 })
    expect(result.ratio).toBeGreaterThanOrEqual(6)
    expect(result.risk).toBe("High Risk")
  })

  it("total < 200 → Desirable", () => {
    const result = calculateCholesterol({ totalMgDl: 190, hdlMgDl: 55 })
    expect(result.totalCategory).toBe("Desirable")
  })

  it("includes LDL category when provided", () => {
    const result = calculateCholesterol({ totalMgDl: 200, hdlMgDl: 50, ldlMgDl: 90 })
    expect(result.ldlCategory).toBe("Optimal")
  })

  it("omits LDL category when not provided", () => {
    const result = calculateCholesterol({ totalMgDl: 200, hdlMgDl: 50 })
    expect(result.ldlCategory).toBeUndefined()
  })
})
