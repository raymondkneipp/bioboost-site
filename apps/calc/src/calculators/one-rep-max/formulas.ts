export function epley(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg
  return weightKg * (1 + reps / 30)
}

export function brzycki(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg
  return weightKg * (36 / (37 - reps))
}

export function lombardi(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg
  return weightKg * reps ** 0.1
}
