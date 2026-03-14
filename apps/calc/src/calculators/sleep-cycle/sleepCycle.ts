import type { SleepCycleInput, SleepCycleResult, SleepTime } from "./types"

const CYCLE_MINUTES = 90
const DEFAULT_FALL_ASLEEP_MINUTES = 14

function formatTime(hour: number, minute: number): string {
  const h = hour % 24
  const period = h >= 12 ? "PM" : "AM"
  const displayHour = h % 12 === 0 ? 12 : h % 12
  const displayMinute = String(minute).padStart(2, "0")
  return `${displayHour}:${displayMinute} ${period}`
}

function subtractMinutes(hour: number, minute: number, totalMinutes: number): { hour: number; minute: number } {
  const totalWakeMinutes = hour * 60 + minute
  let bedMinutes = totalWakeMinutes - totalMinutes
  if (bedMinutes < 0) bedMinutes += 24 * 60
  return { hour: Math.floor(bedMinutes / 60) % 24, minute: bedMinutes % 60 }
}

export function calculateSleepCycle({ wakeHour, wakeMinute, fallAsleepMinutes = DEFAULT_FALL_ASLEEP_MINUTES }: SleepCycleInput): SleepCycleResult {
  const bedtimes: SleepTime[] = []

  for (let cycles = 6; cycles >= 3; cycles--) {
    const totalMinutes = cycles * CYCLE_MINUTES + fallAsleepMinutes
    const { hour, minute } = subtractMinutes(wakeHour, wakeMinute, totalMinutes)
    bedtimes.push({
      hour,
      minute,
      label: formatTime(hour, minute),
      cycles,
    })
  }

  return { bedtimes }
}
