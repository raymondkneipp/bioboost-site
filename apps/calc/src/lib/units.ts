export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalInches = cm / 2.54
  const ft = Math.floor(totalInches / 12)
  const inches = Math.round((totalInches % 12) * 10) / 10
  return { ft, in: inches }
}

export function ftInToCm(ft: number, inches: number): number {
  return (ft * 12 + inches) * 2.54
}

export function kgToLb(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10
}

export function lbToKg(lb: number): number {
  return Math.round((lb / 2.20462) * 10) / 10
}
