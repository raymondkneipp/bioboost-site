import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useActorRef, useSelector } from "@xstate/react"
import { useCallback, useEffect, useRef } from "react"
import { SessionView } from "@/components/session-view"
import { breathingMachine } from "@/lib/breathing-machine"
import type { FeedbackMode } from "@/lib/feedback"
import { getProgramById } from "@/lib/programs"
import type { SessionRecord } from "@/lib/stats"
import { saveSession } from "@/lib/stats"

type SessionSearch = {
  inhale?: number
  holdIn?: number
  exhale?: number
  holdOut?: number
  reps?: number
}

export const Route = createFileRoute("/programs/$id")({
  component: SessionPage,
  validateSearch: (search: Record<string, unknown>): SessionSearch => ({
    inhale: search.inhale ? Number(search.inhale) : undefined,
    holdIn: search.holdIn ? Number(search.holdIn) : undefined,
    exhale: search.exhale ? Number(search.exhale) : undefined,
    holdOut: search.holdOut ? Number(search.holdOut) : undefined,
    reps: search.reps ? Number(search.reps) : undefined,
  }),
})

function SessionPage() {
  const { id } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const savedRef = useRef(false)
  const hapticTriggerRef = useRef<((input: string) => Promise<void>) | null>(
    null,
  )

  // Initialize web-haptics lazily on client side
  useEffect(() => {
    let cleanup: (() => void) | undefined
    async function init() {
      try {
        const { WebHaptics } = await import("web-haptics")
        const haptics = new WebHaptics()
        hapticTriggerRef.current = (input: string) => haptics.trigger(input)
        cleanup = () => haptics.destroy()
      } catch {
        // web-haptics may not be available
      }
    }
    init()
    return () => cleanup?.()
  }, [])

  const program = getProgramById(id)

  const isCustom = id === "custom"
  const programName = isCustom ? "Custom Program" : (program?.name ?? "Unknown")
  const stages = isCustom
    ? {
        inhale: search.inhale ?? 4,
        holdIn: search.holdIn ?? 0,
        exhale: search.exhale ?? 4,
        holdOut: search.holdOut ?? 0,
      }
    : (program?.stages ?? { inhale: 4, holdIn: 0, exhale: 4, holdOut: 0 })
  const totalReps = isCustom ? (search.reps ?? 4) : (program?.defaultReps ?? 4)

  const feedbackMode: FeedbackMode = "none"

  const actorRef = useActorRef(breathingMachine, {
    input: {
      programId: id,
      programName,
      stages,
      totalReps,
      feedbackMode,
    },
  })

  const snapshot = useSelector(actorRef, (s) => s)

  const saveSessionRecord = useCallback(
    (completed: boolean) => {
      if (savedRef.current) return
      savedRef.current = true

      const ctx = snapshot.context
      const duration =
        ctx.sessionStartTime > 0
          ? Math.round((Date.now() - ctx.sessionStartTime) / 1000)
          : 0

      if (duration === 0) return

      const record: SessionRecord = {
        id: crypto.randomUUID(),
        programId: id,
        programName,
        date: new Date().toISOString(),
        completedReps: completed
          ? ctx.totalReps
          : Math.max(0, ctx.currentRep - 1),
        totalReps: ctx.totalReps,
        completed,
        totalDuration: duration,
        totalInhaleTime: ctx.accumulatedInhaleTime,
        totalHoldInTime: ctx.accumulatedHoldInTime,
        totalExhaleTime: ctx.accumulatedExhaleTime,
        totalHoldOutTime: ctx.accumulatedHoldOutTime,
        totalHoldTime: ctx.accumulatedHoldInTime + ctx.accumulatedHoldOutTime,
        totalBreathingTime:
          ctx.accumulatedInhaleTime + ctx.accumulatedExhaleTime,
      }

      saveSession(record)
    },
    [snapshot.context, id, programName],
  )

  const handleComplete = useCallback(() => {
    saveSessionRecord(true)
  }, [saveSessionRecord])

  const handleExit = useCallback(() => {
    if (
      snapshot.matches("breathing") &&
      snapshot.context.sessionStartTime > 0
    ) {
      saveSessionRecord(false)
    }
    navigate({ to: "/programs" })
  }, [snapshot, saveSessionRecord, navigate])

  if (!program && !isCustom) {
    return (
      <div className="min-h-svh flex items-center justify-center container">
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Program Not Found</h2>
          <p className="text-muted-foreground">
            The breathing program "{id}" does not exist.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/programs" })}
            className="text-primary underline"
          >
            Back to Programs
          </button>
        </div>
      </div>
    )
  }

  return (
    <SessionView
      actor={actorRef}
      hapticTrigger={hapticTriggerRef.current}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  )
}
