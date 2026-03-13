const STORAGE_KEY = "breathe-sessions"

export type SessionRecord = {
  id: string
  programId: string
  programName: string
  date: string
  completedReps: number
  totalReps: number
  completed: boolean
  totalDuration: number
  totalInhaleTime: number
  totalHoldInTime: number
  totalExhaleTime: number
  totalHoldOutTime: number
  totalHoldTime: number
  totalBreathingTime: number
}

export type AggregateStats = {
  totalPracticeTime: number
  totalSessions: number
  completedSessions: number
  completionRate: number
  totalBreaths: number
  totalInhaleTime: number
  totalExhaleTime: number
  totalHoldTime: number
  totalBreathingTime: number
  totalHoldInTime: number
  totalHoldOutTime: number
  longestSession: number
  averageSessionLength: number
  currentStreak: number
  longestStreak: number
  favoriteProgram: { name: string; count: number } | null
  sessionsThisWeek: number
  practiceTimeThisWeek: number
}

export function getSessions(): SessionRecord[] {
  if (typeof window === "undefined") return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    return JSON.parse(data) as SessionRecord[]
  } catch {
    return []
  }
}

export function saveSession(record: SessionRecord): void {
  if (typeof window === "undefined") return
  const sessions = getSessions()
  sessions.push(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function clearSessions(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getDateOnly(dateStr: string): string {
  return dateStr.slice(0, 10)
}

function calculateStreak(sessions: SessionRecord[]): {
  current: number
  longest: number
} {
  if (sessions.length === 0) return { current: 0, longest: 0 }

  const uniqueDays = [
    ...new Set(sessions.map((s) => getDateOnly(s.date))),
  ].sort()

  if (uniqueDays.length === 0) return { current: 0, longest: 0 }

  let longest = 1
  let current = 1

  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1])
    const curr = new Date(uniqueDays[i])
    const diffMs = curr.getTime() - prev.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  // Check if current streak is still active (last session today or yesterday)
  const lastDay = new Date(uniqueDays[uniqueDays.length - 1])
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffMs = today.getTime() - lastDay.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays > 1) {
    current = 0
  }

  return { current, longest }
}

export function getAggregateStats(): AggregateStats {
  const sessions = getSessions()

  if (sessions.length === 0) {
    return {
      totalPracticeTime: 0,
      totalSessions: 0,
      completedSessions: 0,
      completionRate: 0,
      totalBreaths: 0,
      totalInhaleTime: 0,
      totalExhaleTime: 0,
      totalHoldTime: 0,
      totalBreathingTime: 0,
      totalHoldInTime: 0,
      totalHoldOutTime: 0,
      longestSession: 0,
      averageSessionLength: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteProgram: null,
      sessionsThisWeek: 0,
      practiceTimeThisWeek: 0,
    }
  }

  const totalPracticeTime = sessions.reduce(
    (sum, s) => sum + s.totalDuration,
    0,
  )
  const completedSessions = sessions.filter((s) => s.completed).length
  const totalBreaths = sessions.reduce((sum, s) => sum + s.completedReps, 0)
  const totalInhaleTime = sessions.reduce(
    (sum, s) => sum + s.totalInhaleTime,
    0,
  )
  const totalExhaleTime = sessions.reduce(
    (sum, s) => sum + s.totalExhaleTime,
    0,
  )
  const totalHoldInTime = sessions.reduce(
    (sum, s) => sum + s.totalHoldInTime,
    0,
  )
  const totalHoldOutTime = sessions.reduce(
    (sum, s) => sum + s.totalHoldOutTime,
    0,
  )
  const totalHoldTime = totalHoldInTime + totalHoldOutTime
  const totalBreathingTime = totalInhaleTime + totalExhaleTime
  const longestSession = Math.max(...sessions.map((s) => s.totalDuration))

  // Favorite program
  const programCounts: Record<string, { name: string; count: number }> = {}
  for (const s of sessions) {
    if (!programCounts[s.programId]) {
      programCounts[s.programId] = { name: s.programName, count: 0 }
    }
    programCounts[s.programId].count++
  }
  const favoriteProgram =
    Object.values(programCounts).sort((a, b) => b.count - a.count)[0] || null

  // Streak
  const { current: currentStreak, longest: longestStreak } =
    calculateStreak(sessions)

  // This week
  const weekStart = getStartOfWeek(new Date())
  const thisWeekSessions = sessions.filter((s) => new Date(s.date) >= weekStart)
  const sessionsThisWeek = thisWeekSessions.length
  const practiceTimeThisWeek = thisWeekSessions.reduce(
    (sum, s) => sum + s.totalDuration,
    0,
  )

  return {
    totalPracticeTime,
    totalSessions: sessions.length,
    completedSessions,
    completionRate:
      sessions.length > 0 ? (completedSessions / sessions.length) * 100 : 0,
    totalBreaths,
    totalInhaleTime,
    totalExhaleTime,
    totalHoldTime,
    totalBreathingTime,
    totalHoldInTime,
    totalHoldOutTime,
    longestSession,
    averageSessionLength: totalPracticeTime / sessions.length,
    currentStreak,
    longestStreak,
    favoriteProgram,
    sessionsThisWeek,
    practiceTimeThisWeek,
  }
}
