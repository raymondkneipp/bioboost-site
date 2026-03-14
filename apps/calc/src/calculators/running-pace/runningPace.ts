import { round } from "../../math/round"
import type { RunningPaceInput, RunningPaceResult } from "./types"

const KM_PER_MILE = 1.60934

export function calculateRunningPace({ distanceKm, hours, minutes, seconds }: RunningPaceInput): RunningPaceResult {
  const totalSeconds = hours * 3600 + minutes * 60 + seconds
  const paceSecPerKm = totalSeconds / distanceKm
  const paceSecPerMile = paceSecPerKm * KM_PER_MILE
  const speedKmh = round(distanceKm / (totalSeconds / 3600), 2)
  const speedMph = round(speedKmh / KM_PER_MILE, 2)
  return {
    paceSecPerKm: round(paceSecPerKm, 1),
    paceSecPerMile: round(paceSecPerMile, 1),
    speedKmh,
    speedMph,
  }
}
