import { createFileRoute } from "@tanstack/react-router"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { useState } from "react"
import { formatTimeLong } from "@/lib/programs"
import type { SessionRecord } from "@/lib/stats"
import {
  type AggregateStats,
  clearSessions,
  getAggregateStats,
  getSessions,
} from "@/lib/stats"

export const Route = createFileRoute("/stats")({ component: StatsPage })

function StatsPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>(() => getSessions())
  const [stats, setStats] = useState<AggregateStats>(() => getAggregateStats())
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  function handleClear() {
    clearSessions()
    setSessions([])
    setStats(getAggregateStats())
    setShowConfirmClear(false)
  }

  const hasData = sessions.length > 0

  return (
    <div className="container py-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black uppercase italic">
          Your Stats
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your breathing practice over time.
        </p>
      </div>

      {!hasData ? (
        <EmptyState />
      ) : (
        <>
          {/* Overview cards */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Practice"
              value={formatTimeLong(stats.totalPracticeTime)}
            />
            <StatCard label="Sessions" value={stats.totalSessions.toString()} />
            <StatCard
              label="Current Streak"
              value={`${stats.currentStreak}d`}
            />
            <StatCard
              label="Completion Rate"
              value={`${Math.round(stats.completionRate)}%`}
            />
          </section>

          {/* Time breakdown */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Time Breakdown</h2>
            <TimeBreakdown stats={stats} />
          </section>

          {/* Activity stats */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">Activity</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                label="This Week"
                value={`${stats.sessionsThisWeek} sessions`}
                subtitle={formatTimeLong(stats.practiceTimeThisWeek)}
              />
              <StatCard
                label="Longest Session"
                value={formatTimeLong(stats.longestSession)}
              />
              <StatCard
                label="Avg Session"
                value={formatTimeLong(Math.round(stats.averageSessionLength))}
              />
              <StatCard
                label="Total Breaths"
                value={stats.totalBreaths.toString()}
              />
              <StatCard
                label="Longest Streak"
                value={`${stats.longestStreak}d`}
              />
              {stats.favoriteProgram && (
                <StatCard
                  label="Favorite Program"
                  value={stats.favoriteProgram.name}
                  subtitle={`${stats.favoriteProgram.count} sessions`}
                />
              )}
            </div>
          </section>

          {/* Session history */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Session History</h2>
              {showConfirmClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Clear all data?
                  </span>
                  <Button variant="destructive" size="sm" onClick={handleClear}>
                    Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmClear(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmClear(true)}
                  className="text-muted-foreground"
                >
                  Clear History
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {sessions
                .slice()
                .reverse()
                .map((session) => (
                  <SessionRow key={session.id} session={session} />
                ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
          aria-hidden="true"
        >
          <path d="M12 20v-6M6 20V10M18 20V4" />
        </svg>
      </div>
      <h3 className="text-lg font-bold">No sessions yet</h3>
      <p className="text-muted-foreground max-w-sm">
        Complete your first breathing session to start tracking your practice.
      </p>
    </div>
  )
}

function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string
  value: string
  subtitle?: string
}) {
  return (
    <div className="flex flex-col gap-1 p-4 rounded-xl bg-card border">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xl font-bold">{value}</span>
      {subtitle && (
        <span className="text-xs text-muted-foreground">{subtitle}</span>
      )}
    </div>
  )
}

function TimeBreakdown({ stats }: { stats: AggregateStats }) {
  const total =
    stats.totalInhaleTime +
    stats.totalHoldInTime +
    stats.totalExhaleTime +
    stats.totalHoldOutTime

  if (total === 0) return null

  const segments = [
    {
      label: "Inhale",
      value: stats.totalInhaleTime,
      color: "bg-primary",
    },
    {
      label: "Hold In",
      value: stats.totalHoldInTime,
      color: "bg-primary/70",
    },
    {
      label: "Exhale",
      value: stats.totalExhaleTime,
      color: "bg-primary/40",
    },
    {
      label: "Hold Out",
      value: stats.totalHoldOutTime,
      color: "bg-primary/20",
    },
  ].filter((s) => s.value > 0)

  return (
    <div className="flex flex-col gap-4 p-6 rounded-xl bg-card border">
      {/* Stacked bar */}
      <div className="flex h-6 rounded-full overflow-hidden bg-muted">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={`${segment.color} transition-all`}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2">
            <div className={`size-3 rounded-full ${segment.color}`} />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">
                {segment.label}
              </span>
              <span className="text-sm font-medium">
                {formatTimeLong(Math.round(segment.value))}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round((segment.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SessionRow({ session }: { session: SessionRecord }) {
  const date = new Date(session.date)
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-card border">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-medium">{session.programName}</span>
          <Badge
            variant={session.completed ? "default" : "secondary"}
            className="text-[0.625rem] h-5 px-1.5"
          >
            {session.completed ? "Completed" : "Exited"}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground">
          {formattedDate} at {formattedTime}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          {session.completedReps}/{session.totalReps} reps
        </span>
        <span className="font-medium text-foreground">
          {formatTimeLong(Math.round(session.totalDuration))}
        </span>
      </div>
    </div>
  )
}
