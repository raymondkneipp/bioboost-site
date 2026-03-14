import { assign, setup } from "xstate"
import type { BreathingStage, StageTimings } from "./programs"
import { STAGE_ORDER } from "./programs"

type FeedbackMode = "sound" | "haptic" | "none"

type BreathingContext = {
  programId: string
  programName: string
  stages: StageTimings
  totalReps: number
  currentRep: number
  currentStage: BreathingStage
  countdownValue: number
  feedbackMode: FeedbackMode
  sessionStartTime: number
  stageStartTime: number
  accumulatedInhaleTime: number
  accumulatedHoldInTime: number
  accumulatedExhaleTime: number
  accumulatedHoldOutTime: number
  pausedElapsed: number
}

type BreathingEvent =
  | { type: "START" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "SKIP" }
  | { type: "BACK" }
  | { type: "SET_REPS"; reps: number }
  | { type: "SET_FEEDBACK"; mode: FeedbackMode }
  | { type: "RESET" }

type BreathingInput = {
  programId: string
  programName: string
  stages: StageTimings
  totalReps: number
  feedbackMode?: FeedbackMode
}

function getNextStageInfo(
  currentStage: BreathingStage,
  currentRep: number,
  totalReps: number,
  stages: StageTimings,
): { stage: BreathingStage; rep: number; isComplete: boolean } {
  const currentIndex = STAGE_ORDER.indexOf(currentStage)
  let nextIndex = currentIndex + 1
  let nextRep = currentRep

  if (nextIndex >= STAGE_ORDER.length) {
    nextIndex = 0
    nextRep = currentRep + 1
  }

  if (nextRep > totalReps) {
    return { stage: STAGE_ORDER[0], rep: nextRep, isComplete: true }
  }

  let nextStage = STAGE_ORDER[nextIndex]

  // Skip stages with 0 duration
  while (stages[nextStage] === 0) {
    nextIndex++
    if (nextIndex >= STAGE_ORDER.length) {
      nextIndex = 0
      nextRep++
    }
    if (nextRep > totalReps) {
      return { stage: STAGE_ORDER[0], rep: nextRep, isComplete: true }
    }
    nextStage = STAGE_ORDER[nextIndex]
  }

  return { stage: nextStage, rep: nextRep, isComplete: false }
}

function getPreviousStageInfo(
  currentStage: BreathingStage,
  currentRep: number,
  stages: StageTimings,
): { stage: BreathingStage; rep: number } {
  const currentIndex = STAGE_ORDER.indexOf(currentStage)
  let prevIndex = currentIndex - 1
  let prevRep = currentRep

  if (prevIndex < 0) {
    prevIndex = STAGE_ORDER.length - 1
    prevRep = currentRep - 1
  }

  if (prevRep < 1) {
    return { stage: STAGE_ORDER[0], rep: 1 }
  }

  let prevStage = STAGE_ORDER[prevIndex]

  // Skip stages with 0 duration
  while (stages[prevStage] === 0) {
    prevIndex--
    if (prevIndex < 0) {
      prevIndex = STAGE_ORDER.length - 1
      prevRep--
    }
    if (prevRep < 1) {
      return { stage: STAGE_ORDER[0], rep: 1 }
    }
    prevStage = STAGE_ORDER[prevIndex]
  }

  return { stage: prevStage, rep: prevRep }
}

function accumulateStageTime(stage: BreathingStage, duration: number) {
  switch (stage) {
    case "inhale":
      return { accumulatedInhaleTime: (prev: number) => prev + duration }
    case "holdIn":
      return { accumulatedHoldInTime: (prev: number) => prev + duration }
    case "exhale":
      return { accumulatedExhaleTime: (prev: number) => prev + duration }
    case "holdOut":
      return { accumulatedHoldOutTime: (prev: number) => prev + duration }
  }
}

export const breathingMachine = setup({
  types: {
    context: {} as BreathingContext,
    events: {} as BreathingEvent,
    input: {} as BreathingInput,
  },
  guards: {
    hasMoreReps: ({ context }) => {
      const next = getNextStageInfo(
        context.currentStage,
        context.currentRep,
        context.totalReps,
        context.stages,
      )
      return !next.isComplete
    },
    canGoBack: ({ context }) => {
      return context.currentRep > 1 || context.currentStage !== "inhale"
    },
  },
  delays: {
    STAGE_DURATION: ({ context }) => {
      return context.stages[context.currentStage] * 1000
    },
    COUNTDOWN_TICK: 1000,
  },
  actions: {
    advanceStage: assign(({ context }) => {
      const now = Date.now()
      const stageDuration = context.stages[context.currentStage]
      const accumulation = accumulateStageTime(
        context.currentStage,
        stageDuration,
      )
      const accumKey = Object.keys(accumulation)[0] as keyof typeof accumulation
      const accumFn = accumulation[accumKey] as (prev: number) => number

      const next = getNextStageInfo(
        context.currentStage,
        context.currentRep,
        context.totalReps,
        context.stages,
      )
      return {
        currentStage: next.stage,
        currentRep: next.rep,
        stageStartTime: now,
        [accumKey]: accumFn(
          context[accumKey as keyof BreathingContext] as number,
        ),
      }
    }),
    goToPreviousStage: assign(({ context }) => {
      const prev = getPreviousStageInfo(
        context.currentStage,
        context.currentRep,
        context.stages,
      )
      return {
        currentStage: prev.stage,
        currentRep: prev.rep,
        stageStartTime: Date.now(),
      }
    }),
    decrementCountdown: assign(({ context }) => ({
      countdownValue: context.countdownValue - 1,
    })),
    setReps: assign((_, params: { reps: number }) => ({
      totalReps: params.reps,
    })),
    setFeedback: assign((_, params: { mode: FeedbackMode }) => ({
      feedbackMode: params.mode,
    })),
    markSessionStart: assign({
      sessionStartTime: () => Date.now(),
      stageStartTime: () => Date.now(),
    }),
    recordPauseTime: assign(({ context }) => ({
      pausedElapsed: Date.now() - context.stageStartTime,
    })),
    restoreAfterPause: assign({
      stageStartTime: ({ context }) => Date.now() - context.pausedElapsed,
    }),
  },
}).createMachine({
  id: "breathing",
  initial: "idle",
  context: ({ input }) => ({
    programId: input.programId,
    programName: input.programName,
    stages: input.stages,
    totalReps: input.totalReps,
    currentRep: 1,
    currentStage: "inhale" as BreathingStage,
    countdownValue: 3,
    feedbackMode: input.feedbackMode ?? "none",
    sessionStartTime: 0,
    stageStartTime: 0,
    accumulatedInhaleTime: 0,
    accumulatedHoldInTime: 0,
    accumulatedExhaleTime: 0,
    accumulatedHoldOutTime: 0,
    pausedElapsed: 0,
  }),
  on: {
    SET_FEEDBACK: {
      actions: {
        type: "setFeedback",
        params: ({ event }) => ({ mode: event.mode }),
      },
    },
  },
  states: {
    idle: {
      on: {
        START: "countdown",
        SET_REPS: {
          actions: {
            type: "setReps",
            params: ({ event }) => ({ reps: event.reps }),
          },
        },
      },
    },
    countdown: {
      on: {
        SET_REPS: {
          actions: {
            type: "setReps",
            params: ({ event }) => ({ reps: event.reps }),
          },
        },
      },
      initial: "tick",
      states: {
        tick: {
          always: [
            {
              guard: ({ context }) => context.countdownValue <= 0,
              target: "#breathing.breathing",
            },
          ],
          after: {
            COUNTDOWN_TICK: {
              actions: "decrementCountdown",
              target: "tick",
              reenter: true,
            },
          },
        },
      },
    },
    breathing: {
      entry: ["markSessionStart"],
      initial: "active",
      states: {
        active: {
          entry: assign(({ context }) => {
            // Find the first non-zero stage starting from inhale
            let stage = context.currentStage
            while (context.stages[stage] === 0) {
              const next = getNextStageInfo(
                stage,
                context.currentRep,
                context.totalReps,
                context.stages,
              )
              if (next.isComplete) break
              stage = next.stage
            }
            return {
              currentStage: stage,
              stageStartTime: Date.now(),
            }
          }),
          after: {
            STAGE_DURATION: [
              {
                guard: "hasMoreReps",
                actions: "advanceStage",
                target: "active",
                reenter: true,
              },
              {
                actions: "advanceStage",
                target: "#breathing.completed",
              },
            ],
          },
          on: {
            PAUSE: {
              target: "paused",
              actions: "recordPauseTime",
            },
            SKIP: [
              {
                guard: "hasMoreReps",
                actions: "advanceStage",
                target: "active",
                reenter: true,
              },
              {
                actions: "advanceStage",
                target: "#breathing.completed",
              },
            ],
            BACK: {
              guard: "canGoBack",
              actions: "goToPreviousStage",
              target: "active",
              reenter: true,
            },
            SET_REPS: {
              actions: {
                type: "setReps",
                params: ({ event }) => ({ reps: event.reps }),
              },
            },
          },
        },
        paused: {
          on: {
            RESUME: {
              target: "active",
              actions: "restoreAfterPause",
            },
            SKIP: [
              {
                guard: "hasMoreReps",
                actions: "advanceStage",
                target: "active",
              },
              {
                actions: "advanceStage",
                target: "#breathing.completed",
              },
            ],
            BACK: {
              guard: "canGoBack",
              actions: "goToPreviousStage",
              target: "active",
            },
            SET_REPS: {
              actions: {
                type: "setReps",
                params: ({ event }) => ({ reps: event.reps }),
              },
            },
          },
        },
      },
    },
    completed: {
      type: "final",
    },
  },
})

