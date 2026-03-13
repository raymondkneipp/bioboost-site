import { round } from "../math/round"

export function cmToMeters(cm: number): number {
  return cm / 100
}

export function metersToCm(m: number): number {
  return m * 100
}

export function inchesToCm(inches: number): number {
  return inches * 2.54
}

export function feetInchesToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * 2.54
}

export function cmToFeetInches(cm: number): { ft: number; in: number } {
  const totalInches = cm / 2.54
  const ft = Math.floor(totalInches / 12)
  const inches = round(totalInches % 12, 1)
  return { ft, in: inches }
}
