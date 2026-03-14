import { round } from "../../math/round"
import type { WilksInput, WilksResult } from "./types"

const COEFFICIENTS = {
  male: { a: -216.0475144, b: 16.2606339, c: -0.002388645, d: -0.00113732, e: 7.01863e-6, f: -1.291e-8 },
  female: { a: 594.31747775582, b: -27.23842536447, c: 0.82112226871, d: -0.00930733913, e: 4.731582e-5, f: -9.054e-8 },
}

function denominator(bw: number, sex: "male" | "female"): number {
  const { a, b, c, d, e, f } = COEFFICIENTS[sex]
  return a + b * bw + c * bw ** 2 + d * bw ** 3 + e * bw ** 4 + f * bw ** 5
}

export function calculateWilks({ sex, bodyWeightKg, liftedKg }: WilksInput): WilksResult {
  return { wilks: round((liftedKg * 600) / denominator(bodyWeightKg, sex), 1) }
}
