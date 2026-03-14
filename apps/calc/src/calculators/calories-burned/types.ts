export type ActivityLevel =
  | "walking-slow"
  | "walking-moderate"
  | "walking-fast"
  | "running-slow"
  | "running-moderate"
  | "running-fast"
  | "cycling-slow"
  | "cycling-moderate"
  | "cycling-fast"
  | "swimming-slow"
  | "swimming-moderate"
  | "strength-training"
  | "yoga"
  | "hiit"
  | "rowing"
  | "jump-rope"
  | "dancing"
  | "hiking"
  | "elliptical"

export interface ActivityInfo {
  label: string
  met: number
}

export interface CaloriesBurnedInput {
  activity: ActivityLevel
  weightKg: number
  durationMinutes: number
}

export interface CaloriesBurnedResult {
  kcal: number
  activityLabel: string
  met: number
}
