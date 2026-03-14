import { describe, expect, it } from "vitest"
import {
  STAGE_ORDER,
  getCycleTime,
  getNextStage,
  getProgramById,
  getStageDuration,
  getTimingPattern,
  getTotalTime,
  formatTime,
  formatTimeLong,
} from "./programs"

describe("getNextStage", () => {
  it("inhale → holdIn", () => {
    expect(getNextStage("inhale")).toBe("holdIn")
  })
  it("holdIn → exhale", () => {
    expect(getNextStage("holdIn")).toBe("exhale")
  })
  it("exhale → holdOut", () => {
    expect(getNextStage("exhale")).toBe("holdOut")
  })
  it("holdOut wraps back to inhale", () => {
    expect(getNextStage("holdOut")).toBe("inhale")
  })
})

describe("STAGE_ORDER", () => {
  it("has exactly 4 stages in correct order", () => {
    expect(STAGE_ORDER).toEqual(["inhale", "holdIn", "exhale", "holdOut"])
  })
})

describe("getStageDuration", () => {
  const timings = { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 }
  it("returns correct duration for each stage", () => {
    expect(getStageDuration(timings, "inhale")).toBe(4)
    expect(getStageDuration(timings, "holdIn")).toBe(7)
    expect(getStageDuration(timings, "exhale")).toBe(8)
    expect(getStageDuration(timings, "holdOut")).toBe(0)
  })
})

describe("getCycleTime", () => {
  it("box breathing: 4+4+4+4 = 16s", () => {
    expect(getCycleTime({ inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 })).toBe(16)
  })
  it("4-7-8: 4+7+8+0 = 19s", () => {
    expect(getCycleTime({ inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 })).toBe(19)
  })
  it("calm breathing: 4+0+6+0 = 10s", () => {
    expect(getCycleTime({ inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 })).toBe(10)
  })
})

describe("getTotalTime", () => {
  it("box breathing 4 reps = 64s", () => {
    expect(getTotalTime({ inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }, 4)).toBe(64)
  })
  it("calm breathing 6 reps = 60s", () => {
    expect(getTotalTime({ inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 }, 6)).toBe(60)
  })
})

describe("formatTime", () => {
  it("0s shows 0s", () => {
    expect(formatTime(0)).toBe("0s")
  })
  it("30s shows 30s", () => {
    expect(formatTime(30)).toBe("30s")
  })
  it("60s shows 1m", () => {
    expect(formatTime(60)).toBe("1m")
  })
  it("90s shows 1m 30s", () => {
    expect(formatTime(90)).toBe("1m 30s")
  })
  it("3600s shows 60m", () => {
    expect(formatTime(3600)).toBe("60m")
  })
})

describe("formatTimeLong", () => {
  it("0s shows 0s", () => {
    expect(formatTimeLong(0)).toBe("0s")
  })
  it("45s shows 45s", () => {
    expect(formatTimeLong(45)).toBe("45s")
  })
  it("60s shows 1m", () => {
    expect(formatTimeLong(60)).toBe("1m")
  })
  it("3600s shows 1h", () => {
    expect(formatTimeLong(3600)).toBe("1h")
  })
  it("3660s shows 1h 1m", () => {
    expect(formatTimeLong(3660)).toBe("1h 1m")
  })
  it("90s shows 1m 30s", () => {
    expect(formatTimeLong(90)).toBe("1m 30s")
  })
})

describe("getTimingPattern", () => {
  it("box breathing → 4-4-4-4", () => {
    expect(getTimingPattern({ inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 })).toBe("4-4-4-4")
  })
  it("4-7-8 → 4-7-8-0", () => {
    expect(getTimingPattern({ inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 })).toBe("4-7-8")
  })
  it("calm breathing (no holds) → 4-6", () => {
    expect(getTimingPattern({ inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 })).toBe("4-6")
  })
  it("extended exhale (holdOut > 0) → includes holdOut", () => {
    expect(getTimingPattern({ inhale: 4, holdIn: 0, exhale: 8, holdOut: 2 })).toBe("4-0-8-2")
  })
})

describe("getProgramById", () => {
  it("finds box-breathing", () => {
    const p = getProgramById("box-breathing")
    expect(p).toBeDefined()
    expect(p?.name).toBe("Box Breathing")
  })
  it("finds 4-7-8-relaxation", () => {
    const p = getProgramById("4-7-8-relaxation")
    expect(p?.stages).toEqual({ inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 })
  })
  it("returns undefined for unknown id", () => {
    expect(getProgramById("nonexistent")).toBeUndefined()
  })
})
