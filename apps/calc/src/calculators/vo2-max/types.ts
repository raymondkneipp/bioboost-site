export interface VO2MaxInput {
  distanceMeters: number // distance covered in 12 minutes (Cooper test)
}

export interface VO2MaxResult {
  vo2max: number // ml/kg/min
  fitnessCategory: string
}
