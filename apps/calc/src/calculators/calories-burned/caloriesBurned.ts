import { round } from "../../math/round"
import type { ActivityInfo, ActivityLevel, CaloriesBurnedInput, CaloriesBurnedResult } from "./types"

export const ACTIVITIES: Record<ActivityLevel, ActivityInfo> = {
  "walking-slow": { label: "Walking (slow, 2 mph)", met: 2.5 },
  "walking-moderate": { label: "Walking (moderate, 3 mph)", met: 3.5 },
  "walking-fast": { label: "Walking (fast, 4 mph)", met: 5.0 },
  "running-slow": { label: "Running (slow, 5 mph)", met: 8.0 },
  "running-moderate": { label: "Running (moderate, 6 mph)", met: 9.8 },
  "running-fast": { label: "Running (fast, 8 mph)", met: 11.8 },
  "cycling-slow": { label: "Cycling (slow, <10 mph)", met: 4.0 },
  "cycling-moderate": { label: "Cycling (moderate, 12-14 mph)", met: 8.0 },
  "cycling-fast": { label: "Cycling (fast, >16 mph)", met: 12.0 },
  "swimming-slow": { label: "Swimming (leisure)", met: 6.0 },
  "swimming-moderate": { label: "Swimming (moderate laps)", met: 8.3 },
  "strength-training": { label: "Strength Training", met: 3.5 },
  yoga: { label: "Yoga", met: 2.5 },
  hiit: { label: "HIIT", met: 8.0 },
  rowing: { label: "Rowing (moderate)", met: 7.0 },
  "jump-rope": { label: "Jump Rope", met: 11.0 },
  dancing: { label: "Dancing (general)", met: 4.8 },
  hiking: { label: "Hiking", met: 5.3 },
  elliptical: { label: "Elliptical (moderate)", met: 5.0 },
}

export function calculateCaloriesBurned({ activity, weightKg, durationMinutes }: CaloriesBurnedInput): CaloriesBurnedResult {
  const info = ACTIVITIES[activity]
  const kcal = round(info.met * weightKg * (durationMinutes / 60), 0)
  return { kcal, activityLabel: info.label, met: info.met }
}
