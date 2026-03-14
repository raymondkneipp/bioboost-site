import { describe, expect, it } from "vitest"
import { calculateSleepCycle } from "./sleepCycle"

describe("calculateSleepCycle", () => {
  it("wake at 7:00 AM → returns 4 bedtime options (6,5,4,3 cycles)", () => {
    const result = calculateSleepCycle({ wakeHour: 7, wakeMinute: 0 })
    expect(result.bedtimes).toHaveLength(4)
    expect(result.bedtimes[0].cycles).toBe(6)
    expect(result.bedtimes[3].cycles).toBe(3)
  })

  it("6-cycle bedtime is 9h14m before wake time (6*90+14 = 554min)", () => {
    // Wake 7:00 - 554min = 7:00 - 9h14m = 21:46 (9:46 PM)
    const result = calculateSleepCycle({ wakeHour: 7, wakeMinute: 0 })
    // biome-ignore lint/style/noNonNullAssertion: find() result is guaranteed in test data
    const sixCycle = result.bedtimes.find((b) => b.cycles === 6)!
    expect(sixCycle.hour).toBe(21)
    expect(sixCycle.minute).toBe(46)
  })

  it("3-cycle bedtime is 4h44m before wake time (3*90+14 = 284min)", () => {
    // Wake 7:00 - 284min = 7:00 - 4h44m = 2:16 AM
    const result = calculateSleepCycle({ wakeHour: 7, wakeMinute: 0 })
    // biome-ignore lint/style/noNonNullAssertion: find() result is guaranteed in test data
    const threeCycle = result.bedtimes.find((b) => b.cycles === 3)!
    expect(threeCycle.hour).toBe(2)
    expect(threeCycle.minute).toBe(16)
  })

  it("custom fall-asleep time adjusts bedtimes", () => {
    const defaultResult = calculateSleepCycle({ wakeHour: 7, wakeMinute: 0 })
    const customResult = calculateSleepCycle({ wakeHour: 7, wakeMinute: 0, fallAsleepMinutes: 20 })
    // Custom should be 6 minutes earlier than default (14 vs 20)
    const defaultMinutes = defaultResult.bedtimes[0].hour * 60 + defaultResult.bedtimes[0].minute
    const customMinutes = customResult.bedtimes[0].hour * 60 + customResult.bedtimes[0].minute
    const diff = (defaultMinutes - customMinutes + 24 * 60) % (24 * 60)
    expect(diff).toBe(6)
  })

  it("each bedtime label is a non-empty string", () => {
    const result = calculateSleepCycle({ wakeHour: 6, wakeMinute: 30 })
    result.bedtimes.forEach((b) => {
      expect(b.label).toBeTruthy()
      expect(b.label).toMatch(/\d+:\d{2} (AM|PM)/)
    })
  })
})
