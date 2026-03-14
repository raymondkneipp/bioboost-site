export interface SleepCycleInput {
  wakeHour: number
  wakeMinute: number
  fallAsleepMinutes?: number
}

export interface SleepTime {
  hour: number
  minute: number
  label: string
  cycles: number
}

export interface SleepCycleResult {
  bedtimes: SleepTime[]
}
