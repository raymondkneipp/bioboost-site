export interface RunningPaceInput {
  distanceKm: number
  hours: number
  minutes: number
  seconds: number
}

export interface RunningPaceResult {
  paceSecPerKm: number
  paceSecPerMile: number
  speedKmh: number
  speedMph: number
}
