export type BreathingStage = "inhale" | "holdIn" | "exhale" | "holdOut"

export type StageTimings = {
  inhale: number
  holdIn: number
  exhale: number
  holdOut: number
}

export type BreathingProgram = {
  id: string
  name: string
  description: string
  benefits: string[]
  bestFor: string
  stages: StageTimings
  defaultReps: number
}

export const STAGE_LABELS: Record<BreathingStage, string> = {
  inhale: "Inhale",
  holdIn: "Hold",
  exhale: "Exhale",
  holdOut: "Hold",
}

export const STAGE_ORDER: BreathingStage[] = [
  "inhale",
  "holdIn",
  "exhale",
  "holdOut",
]

export function getNextStage(stage: BreathingStage): BreathingStage {
  const index = STAGE_ORDER.indexOf(stage)
  return STAGE_ORDER[(index + 1) % STAGE_ORDER.length]
}

export function getPreviousStage(stage: BreathingStage): BreathingStage {
  const index = STAGE_ORDER.indexOf(stage)
  return STAGE_ORDER[(index - 1 + STAGE_ORDER.length) % STAGE_ORDER.length]
}

export function getStageDuration(
  stages: StageTimings,
  stage: BreathingStage,
): number {
  return stages[stage]
}

export function getCycleTime(stages: StageTimings): number {
  return stages.inhale + stages.holdIn + stages.exhale + stages.holdOut
}

export function getTotalTime(stages: StageTimings, reps: number): number {
  return getCycleTime(stages) * reps
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  if (mins === 0) return `${secs}s`
  if (secs === 0) return `${mins}m`
  return `${mins}m ${secs}s`
}

export function formatTimeLong(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.round(seconds % 60)
  if (hours > 0) {
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }
  if (mins === 0) return `${secs}s`
  if (secs === 0) return `${mins}m`
  return `${mins}m ${secs}s`
}

export function getTimingPattern(stages: StageTimings): string {
  const parts = [stages.inhale]
  if (stages.holdIn > 0 || stages.holdOut > 0) {
    parts.push(stages.holdIn)
  }
  parts.push(stages.exhale)
  if (stages.holdOut > 0) {
    parts.push(stages.holdOut)
  }
  return parts.join("-")
}

export const PROGRAMS: BreathingProgram[] = [
  {
    id: "box-breathing",
    name: "Box Breathing",
    description:
      "Equal parts inhale, hold, exhale, and hold. Used by Navy SEALs and first responders to stay calm under pressure.",
    benefits: ["Stress relief", "Sharper focus", "Emotional regulation"],
    bestFor: "Stressful moments & focus",
    stages: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
    defaultReps: 4,
  },
  {
    id: "4-7-8-relaxation",
    name: "4-7-8 Relaxation",
    description:
      "Developed by Dr. Andrew Weil, this technique acts as a natural tranquilizer for the nervous system.",
    benefits: ["Better sleep", "Reduced anxiety", "Lower heart rate"],
    bestFor: "Sleep & anxiety relief",
    stages: { inhale: 4, holdIn: 7, exhale: 8, holdOut: 0 },
    defaultReps: 4,
  },
  {
    id: "calm-breathing",
    name: "Calm Breathing",
    description:
      "A simple, gentle pattern with a longer exhale that activates the parasympathetic nervous system.",
    benefits: ["General relaxation", "Accessible for beginners", "Calming"],
    bestFor: "Daily relaxation",
    stages: { inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 },
    defaultReps: 6,
  },
  {
    id: "energizing-breath",
    name: "Energizing Breath",
    description:
      "Quick, rhythmic breathing that increases oxygen flow and activates the sympathetic nervous system for an energy boost.",
    benefits: ["Increased energy", "Mental alertness", "Improved circulation"],
    bestFor: "Morning routine & energy",
    stages: { inhale: 2, holdIn: 0, exhale: 2, holdOut: 0 },
    defaultReps: 15,
  },
  {
    id: "resonance-breathing",
    name: "Resonance Breathing",
    description:
      "Breathing at 5-second intervals optimizes heart rate variability (HRV), a key marker of cardiovascular health.",
    benefits: ["Better HRV", "Cardiovascular health", "Emotional resilience"],
    bestFor: "Heart health & resilience",
    stages: { inhale: 5, holdIn: 0, exhale: 5, holdOut: 0 },
    defaultReps: 6,
  },
  {
    id: "extended-exhale",
    name: "Extended Exhale",
    description:
      "A 1:2 inhale-to-exhale ratio with a brief pause, designed to deeply activate the body's rest-and-digest response.",
    benefits: ["Deep calm", "Nervous system reset", "Tension release"],
    bestFor: "Deep relaxation & recovery",
    stages: { inhale: 4, holdIn: 0, exhale: 8, holdOut: 2 },
    defaultReps: 4,
  },
]

export function getProgramById(id: string): BreathingProgram | undefined {
  return PROGRAMS.find((p) => p.id === id)
}
