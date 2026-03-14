import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PauseIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useSelector } from "@xstate/react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { ActorRefFrom } from "xstate"
import { CountdownOverlay } from "@/components/countdown-overlay"
import { FeedbackToggle } from "@/components/feedback-toggle"
import type { breathingMachine } from "@/lib/breathing-machine"
import type { FeedbackMode } from "@/lib/feedback"
import { triggerFeedback } from "@/lib/feedback"
import type { BreathingStage } from "@/lib/programs"
import { formatTime, getNextStage, STAGE_LABELS } from "@/lib/programs"

type SessionViewProps = {
  actor: ActorRefFrom<typeof breathingMachine>
  hapticTrigger: ((input: string) => Promise<void>) | null
  onComplete: () => void
  onExit: () => void
}

function getStageLabel(stage: BreathingStage): string {
  return STAGE_LABELS[stage]
}

function getNextStageLabel(
  stage: BreathingStage,
  currentRep: number,
  totalReps: number,
  stages: { inhale: number; holdIn: number; exhale: number; holdOut: number },
): string | null {
  let nextStage = getNextStage(stage)
  let nextRep = currentRep

  // Check if we're at the end of a cycle
  if (nextStage === "inhale") {
    nextRep++
  }

  if (nextRep > totalReps) return null

  // Skip 0-duration stages for display
  while (stages[nextStage] === 0) {
    const following = getNextStage(nextStage)
    if (following === "inhale") nextRep++
    if (nextRep > totalReps) return null
    nextStage = following
  }

  return STAGE_LABELS[nextStage]
}

export function SessionView({
  actor,
  hapticTrigger,
  onComplete,
  onExit,
}: SessionViewProps) {
  const state = useSelector(actor, (s) => s)
  const context = state.context
  const [stageElapsed, setStageElapsed] = useState(0)
  const prevStageRef = useRef<string>("")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isIdle = state.matches("idle")
  const isCountdown = state.matches("countdown")
  const isBreathing = state.matches("breathing")
  const isPaused = state.matches({ breathing: "paused" })
  const isCompleted = state.matches("completed")

  // Track stage changes for feedback
  useEffect(() => {
    if (!isBreathing) return

    const stageKey = `${context.currentStage}-${context.currentRep}`
    if (prevStageRef.current && prevStageRef.current !== stageKey) {
      triggerFeedback(context.feedbackMode, hapticTrigger)
    }
    prevStageRef.current = stageKey
  }, [
    context.currentStage,
    context.currentRep,
    context.feedbackMode,
    hapticTrigger,
    isBreathing,
  ])

  // Stage elapsed timer
  // biome-ignore lint/correctness/useExhaustiveDependencies: stage/rep changes should restart the interval
  useEffect(() => {
    if (isPaused || !isBreathing || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    setStageElapsed(0)
    timerRef.current = setInterval(() => {
      if (context.stageStartTime > 0) {
        const elapsed = (Date.now() - context.stageStartTime) / 1000
        setStageElapsed(elapsed)
      }
    }, 50)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [
    context.currentStage,
    context.currentRep,
    isPaused,
    isBreathing,
    isCompleted,
    context.stageStartTime,
  ])

  // Notify on completion
  useEffect(() => {
    if (isCompleted) {
      onComplete()
    }
  }, [isCompleted, onComplete])

  // Start automatically when idle
  useEffect(() => {
    if (isIdle) {
      actor.send({ type: "START" })
    }
  }, [isIdle, actor])

  const stageDuration = context.stages[context.currentStage]
  const stageTimeRemaining = Math.max(0, stageDuration - stageElapsed)

  const cycleTime =
    context.stages.inhale +
    context.stages.holdIn +
    context.stages.exhale +
    context.stages.holdOut
  const totalTime = cycleTime * context.totalReps

  // Position-based elapsed: derived from current rep/stage + stageElapsed.
  // This stays accurate when going back and freezes when paused.
  const stageOrderList = ["inhale", "holdIn", "exhale", "holdOut"] as const
  const stageIndex = stageOrderList.indexOf(context.currentStage)
  const timeBeforeCurrentStage = stageOrderList
    .slice(0, stageIndex)
    .reduce((sum, s) => sum + context.stages[s], 0)
  const positionElapsed =
    (context.currentRep - 1) * cycleTime +
    timeBeforeCurrentStage +
    Math.min(stageElapsed, stageDuration)
  const totalRemaining = Math.max(0, totalTime - positionElapsed)
  const sessionElapsed = Math.round(positionElapsed)
  const breathingProgress = totalTime > 0 ? Math.min(1, positionElapsed / totalTime) : 0

  const nextLabel = isBreathing
    ? getNextStageLabel(
        context.currentStage,
        context.currentRep,
        context.totalReps,
        context.stages,
      )
    : null

  const handleFeedbackChange = useCallback(
    (mode: FeedbackMode) => {
      actor.send({ type: "SET_FEEDBACK", mode })
    },
    [actor],
  )

  if (isCountdown) {
    return <CountdownOverlay value={context.countdownValue} />
  }

  if (isCompleted) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center gap-8 container">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic text-primary">
            Session Complete
          </h2>
          <p className="text-muted-foreground text-lg">
            Great work! Here's your session summary.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          <SummaryCard
            label="Duration"
            value={formatTime(Math.round(sessionElapsed))}
          />
          <SummaryCard
            label="Reps"
            value={`${context.currentRep - 1} / ${context.totalReps}`}
          />
          <SummaryCard
            label="Inhale Time"
            value={formatTime(Math.round(context.accumulatedInhaleTime))}
          />
          <SummaryCard
            label="Exhale Time"
            value={formatTime(Math.round(context.accumulatedExhaleTime))}
          />
          <SummaryCard
            label="Hold In"
            value={formatTime(Math.round(context.accumulatedHoldInTime))}
          />
          <SummaryCard
            label="Hold Out"
            value={formatTime(Math.round(context.accumulatedHoldOutTime))}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onExit}>
            Back to Programs
          </Button>
          <Button
            onClick={() => {
              actor.send({ type: "RESET" })
              window.location.reload()
            }}
          >
            Repeat
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center container relative">
      {/* Top info bar */}
      <div className="absolute top-4 inset-x-0 container flex items-center justify-between text-sm text-muted-foreground">
        <Button variant="ghost" onClick={onExit}>
          Exit
        </Button>
        <div className="flex items-center gap-4">
          <span>
            Rep {context.currentRep} / {context.totalReps}
          </span>
          <span>{formatTime(totalRemaining)} left</span>
        </div>
        <FeedbackToggle
          mode={context.feedbackMode}
          onChange={handleFeedbackChange}
        />
      </div>

      {/* Main breathing visual */}
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          {/* Centered stage label */}
          <div className="flex flex-col items-center justify-center">
            <span
              key={`${context.currentStage}-${context.currentRep}`}
              className="text-3xl md:text-4xl font-black uppercase tracking-wider animate-in fade-in duration-300"
            >
              {getStageLabel(context.currentStage)}
            </span>
            <span className="text-4xl md:text-5xl font-black tabular-nums text-primary mt-1">
              {Math.ceil(stageTimeRemaining)}
            </span>
          </div>
        </div>

        {/* Next stage indicator */}
        <div className="text-sm text-muted-foreground h-5">
          {nextLabel ? (
            <span>
              Next: <strong className="text-foreground">{nextLabel}</strong>
            </span>
          ) : (
            <span>Final stage</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 inset-x-0 container">
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => actor.send({ type: "BACK" })}
            aria-label="Previous stage"
            disabled={
              context.currentRep === 1 && context.currentStage === "inhale"
            }
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} />
          </Button>

          <Button
            size="icon-lg"
            onClick={() => actor.send({ type: isPaused ? "RESUME" : "PAUSE" })}
            className={cn(isPaused && "animate-pulse")}
            aria-label={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <HugeiconsIcon icon={PlayIcon} />
            ) : (
              <HugeiconsIcon icon={PauseIcon} />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => actor.send({ type: "SKIP" })}
            aria-label="Next stage"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </Button>

          {/* Reps adjuster */}
          <div className="flex items-center gap-1 ml-4">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() =>
                actor.send({
                  type: "SET_REPS",
                  reps: Math.max(1, context.totalReps - 1),
                })
              }
              disabled={context.totalReps <= 1}
              aria-label="Decrease reps"
            >
              -
            </Button>
            <span className="text-xs tabular-nums w-8 text-center text-muted-foreground">
              {context.totalReps}x
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() =>
                actor.send({
                  type: "SET_REPS",
                  reps: Math.min(50, context.totalReps + 1),
                })
              }
              disabled={context.totalReps >= 50}
              aria-label="Increase reps"
            >
              +
            </Button>
          </div>
        </div>

        {/* Total time info */}
        <div className="flex justify-center mt-4 text-xs text-muted-foreground gap-4">
          <span>Total: {formatTime(totalTime)}</span>
          <span>Elapsed: {formatTime(sessionElapsed)}</span>
        </div>
      </div>

      {/* Total progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-muted">
        <div
          className="h-full bg-primary"
          style={{ width: `${breathingProgress * 100}%` }}
        />
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl bg-card border text-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-lg font-bold">{value}</span>
    </div>
  )
}
