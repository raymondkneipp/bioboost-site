import { round } from "../../math/round"
import type { DotsInput, DotsResult } from "./types"

// DOTS coefficients — Tim Kohlenberg 2019
const MALE = [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093]
const FEMALE = [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706822]

function dotsCoefficient(bw: number, coeffs: number[]): number {
  const [a, b, c, d, e] = coeffs
  const denominator = a + b * bw + c * bw ** 2 + d * bw ** 3 + e * bw ** 4
  return 500 / denominator
}

export function calculateDots({ sex, bodyWeightKg, liftedKg }: DotsInput): DotsResult {
  const coeffs = sex === "male" ? MALE : FEMALE
  const dots = round(liftedKg * dotsCoefficient(bodyWeightKg, coeffs), 2)
  return { dots }
}
