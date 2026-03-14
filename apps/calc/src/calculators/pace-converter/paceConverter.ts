import { round } from "../../math/round"
import type { PaceConverterInput, PaceConverterResult } from "./types"

const KM_PER_MILE = 1.60934

export function convertPace(input: PaceConverterInput): PaceConverterResult {
  let speedKmh: number

  if (input.speedKmh !== undefined) {
    speedKmh = input.speedKmh
  } else if (input.speedMph !== undefined) {
    speedKmh = input.speedMph * KM_PER_MILE
  } else if (input.paceMinPerKm !== undefined) {
    speedKmh = 60 / input.paceMinPerKm
  } else if (input.paceMinPerMile !== undefined) {
    speedKmh = (60 / input.paceMinPerMile) * KM_PER_MILE
  } else {
    throw new Error("At least one input value is required")
  }

  const speedMph = round(speedKmh / KM_PER_MILE, 2)
  const paceMinPerKm = round(60 / speedKmh, 4)
  const paceMinPerMile = round(60 / speedMph, 4)
  const paceSecPerKm = round(paceMinPerKm * 60, 1)
  const paceSecPerMile = round(paceMinPerMile * 60, 1)

  return {
    paceMinPerKm,
    paceSecPerKm,
    paceMinPerMile,
    paceSecPerMile,
    speedKmh: round(speedKmh, 2),
    speedMph,
  }
}
