export interface PaceConverterInput {
  paceMinPerKm?: number
  paceMinPerMile?: number
  speedKmh?: number
  speedMph?: number
}

export interface PaceConverterResult {
  paceMinPerKm: number
  paceSecPerKm: number
  paceMinPerMile: number
  paceSecPerMile: number
  speedKmh: number
  speedMph: number
}
