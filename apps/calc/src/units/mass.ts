const LB_TO_KG = 0.45359237

export function poundsToKg(lb: number): number {
  return lb * LB_TO_KG
}

export function kgToPounds(kg: number): number {
  return kg / LB_TO_KG
}
