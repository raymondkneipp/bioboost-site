export interface RepMaxInput {
  oneRepMaxKg: number
}

export interface RepMaxEntry {
  percentage: number
  weightKg: number
}

export interface RepMaxResult {
  entries: RepMaxEntry[]
}
