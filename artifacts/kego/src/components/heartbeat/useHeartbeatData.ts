/**
 * Heartbeat Data Hook — Fetches and Processes Real Project History
 *
 * Queries Supabase in parallel, transforms raw rows into RingEvent[],
 * detects gaps and abandonment, calculates stats.
 * Falls back to demo data when Supabase is unavailable.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '../../lib/supabase/client'
import type { RingEvent, ProjectStats, HeartbeatDataResult } from './heartbeatTypes'

// ─── Helpers ────────────────────────────────────────────────

function differenceInDays(a: Date, b: Date): number {
  const msPerDay = 86400000
  return Math.round((a.getTime() - b.getTime()) / msPerDay)
}

const GAP_THRESHOLD_DAYS = 5
const CACHE_KEY_PREFIX = 'kego_heartbeat_'
const CACHE_TTL_MS = 5 * 60 * 1000  // 5 minutes

// ─── Cache Helpers ──────────────────────────────────────────

interface CachedData {
  events: Array<SerializedRingEvent>
  projectStats: ProjectStats
  timestamp: number
}

interface SerializedRingEvent {
  type: RingEvent['type']
  date: string
  durationDays?: number
  content?: string
  intensity: number
}

function deserializeRingEvents(serialized: SerializedRingEvent[]): RingEvent[] {
  return serialized.map(s => ({
    ...s,
    date: new Date(s.date),
  }))
}

function serializeRingEvents(events: RingEvent[]): SerializedRingEvent[] {
  return events.map(e => ({
    ...e,
    date: e.date.toISOString(),
  }))
}

function getCachedData(projectId: string): { events: RingEvent[]; projectStats: ProjectStats } | null {
  try {
    const raw = sessionStorage.getItem(`${CACHE_KEY_PREFIX}${projectId}`)
    if (!raw) return null
    const cached: CachedData = JSON.parse(raw)
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      sessionStorage.removeItem(`${CACHE_KEY_PREFIX}${projectId}`)
      return null
    }
    return {
      events: deserializeRingEvents(cached.events),
      projectStats: cached.projectStats,
    }
  } catch {
    return null
  }
}

function setCachedData(projectId: string, events: RingEvent[], projectStats: ProjectStats): void {
  try {
    const cached: CachedData = {
      events: serializeRingEvents(events),
      projectStats,
      timestamp: Date.now(),
    }
    sessionStorage.setItem(`${CACHE_KEY_PREFIX}${projectId}`, JSON.stringify(cached))
  } catch {
    // sessionStorage full or unavailable — non-critical
  }
}

// ─── Main Hook ──────────────────────────────────────────────

export function useHeartbeatData(projectId: string): HeartbeatDataResult {
  const [events, setEvents] = useState<RingEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null)
  const hasFetched = useRef(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    // Check cache first
    const cached = getCachedData(projectId)
    if (cached) {
      setEvents(cached.events)
      setProjectStats(cached.projectStats)
      setIsLoading(false)
      return
    }

    const client = await createClient()

    if (!client) {
      // Supabase unavailable — use demo data
      const { events: demoEvents, stats } = generateDemoData(projectId)
      setEvents(demoEvents)
      setProjectStats(stats)
      setCachedData(projectId, demoEvents, stats)
      setIsLoading(false)
      return
    }

    try {
      // Parallel queries
      const [
        checkinsResult,
        decisionsResult,
        milestonesResult,
        blockersResult,
        projectResult,
        taskWeeksResult,
      ] = await Promise.all([
        client.from('checkins').select('checkin_date, ai_summary').eq('project_id', projectId).order('checkin_date', { ascending: true }).limit(500),
        client.from('decisions').select('decided_at, title, confidence').eq('project_id', projectId).order('decided_at', { ascending: true }).limit(200),
        client.from('phases').select('updated_at, title').eq('project_id', projectId).eq('status', 'done').order('updated_at', { ascending: true }).limit(100),
        client.from('project_memory').select('created_at, content').eq('project_id', projectId).eq('memory_type', 'blocker').order('created_at', { ascending: true }).limit(100),
        client.from('projects').select('created_at, name, started_at').eq('id', projectId).limit(1),
        client.from('tasks').select('completed_at').eq('project_id', projectId).eq('status', 'done').limit(1000),
      ])

      // Collect errors
      const errors = [
        checkinsResult.error,
        decisionsResult.error,
        milestonesResult.error,
        blockersResult.error,
        projectResult.error,
        taskWeeksResult.error,
      ].filter(Boolean)

      if (errors.length > 0) {
        setError(new Error(errors[0]?.message ?? 'Data fetch failed'))
        setIsLoading(false)
        return
      }

      // Process task completions by week for intensity calculation
      const taskWeekMap = new Map<string, number>()
      const tasks = (taskWeeksResult.data ?? []) as Array<{ completed_at: string | null }>
      for (const task of tasks) {
        if (task.completed_at) {
          const weekStart = getWeekKey(new Date(task.completed_at))
          taskWeekMap.set(weekStart, (taskWeekMap.get(weekStart) ?? 0) + 1)
        }
      }
      const maxTasksPerWeek = Math.max(...taskWeekMap.values(), 1)

      const ringEvents: RingEvent[] = []

      // Transform check-ins
      const checkins = (checkinsResult.data ?? []) as Array<{ checkin_date: string; ai_summary: string | null }>
      for (const checkin of checkins) {
        const date = new Date(checkin.checkin_date)
        const weekKey = getWeekKey(date)
        const tasksThisWeek = taskWeekMap.get(weekKey) ?? 0
        const intensity = 0.4 + (tasksThisWeek / maxTasksPerWeek) * 0.6
        ringEvents.push({
          type: 'checkin',
          date,
          intensity: Math.min(intensity, 1.0),
          content: checkin.ai_summary ? truncate(checkin.ai_summary, 40) : undefined,
        })
      }

      // Transform decisions
      const decisions = (decisionsResult.data ?? []) as Array<{ decided_at: string; title: string; confidence: number | null }>
      for (const decision of decisions) {
        const intensity = 1.0 - ((decision.confidence ?? 50) / 100) * 0.4
        ringEvents.push({
          type: 'decision',
          date: new Date(decision.decided_at),
          intensity: Math.max(intensity, 0.3),
          content: truncate(decision.title, 40),
        })
      }

      // Transform milestones
      const milestones = (milestonesResult.data ?? []) as Array<{ updated_at: string; title: string }>
      for (const milestone of milestones) {
        ringEvents.push({
          type: 'milestone',
          date: new Date(milestone.updated_at),
          intensity: 1.0,
          content: truncate(milestone.title, 40),
        })
      }

      // Transform blockers
      const blockers = (blockersResult.data ?? []) as Array<{ created_at: string; content: string | null }>
      for (const blocker of blockers) {
        ringEvents.push({
          type: 'blocker',
          date: new Date(blocker.created_at),
          intensity: 0.6,
          content: blocker.content ? truncate(blocker.content, 40) : undefined,
        })
      }

      // Extract project start date
      const projectData = (projectResult.data ?? []) as Array<{ created_at: string; name: string; started_at: string | null }>
      const projectName = projectData[0]?.name ?? 'this project'
      const projectStart = projectData[0]?.started_at
        ? new Date(projectData[0].started_at)
        : projectData[0]?.created_at
          ? new Date(projectData[0].created_at)
          : ringEvents.length > 0
            ? ringEvents[0].date
            : new Date()

      // If no project data found, use earliest event
      if (projectData.length === 0 && ringEvents.length > 0) {
        // Already have events — project entry not critical
      }

      // Ensure project creation is represented
      const hasProjectCreation = ringEvents.some(e =>
        e.type === 'checkin' && differenceInDays(e.date, projectStart) === 0
      )
      if (!hasProjectCreation && ringEvents.length > 0) {
        ringEvents.unshift({
          type: 'checkin',
          date: projectStart,
          intensity: 0.2,
          content: 'project created',
        })
      }

      // Sort all events by date
      ringEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

      // Detect gaps and abandonment
      const processedEvents = detectGaps(ringEvents)

      // Calculate stats
      const stats = calculateStats(processedEvents, projectName, projectStart)

      setEvents(processedEvents)
      setProjectStats(stats)
      setCachedData(projectId, processedEvents, stats)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
      // Fallback to demo data on error
      const { events: demoEvents, stats } = generateDemoData(projectId)
      setEvents(demoEvents)
      setProjectStats(stats)
    } finally {
      setIsLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    fetchData()
  }, [fetchData])

  return { events, isLoading, error, projectStats }
}

// ─── Gap Detection ──────────────────────────────────────────

function detectGaps(events: RingEvent[]): RingEvent[] {
  if (events.length < 2) return events

  const result: RingEvent[] = []
  let longestGapDays = 0
  let longestGapIndex = -1

  // First pass: insert gap events, track longest
  for (let i = 0; i < events.length; i++) {
    result.push(events[i])

    if (i < events.length - 1) {
      const gapDays = differenceInDays(events[i + 1].date, events[i].date)
      if (gapDays >= GAP_THRESHOLD_DAYS) {
        result.push({
          type: 'gap',
          date: events[i].date,
          durationDays: gapDays,
          intensity: Math.min(gapDays / 30, 1.0),
        })

        if (gapDays > longestGapDays) {
          longestGapDays = gapDays
          longestGapIndex = result.length - 1
        }
      }
    }
  }

  // Second pass: mark longest gap as abandonment
  if (longestGapIndex >= 0 && result[longestGapIndex].type === 'gap') {
    result[longestGapIndex] = {
      ...result[longestGapIndex],
      type: 'abandonment',
    }
  }

  return result
}

// ─── Stats Calculation ──────────────────────────────────────

function calculateStats(
  events: RingEvent[],
  projectName: string,
  projectStart: Date
): ProjectStats {
  const activeEvents = events.filter(e => e.type !== 'gap' && e.type !== 'abandonment')
  const gapEvents = events.filter(e => e.type === 'gap' || e.type === 'abandonment')

  const totalDays = Math.max(differenceInDays(new Date(), projectStart), 1)

  const checkinDates = activeEvents
    .filter(e => e.type === 'checkin')
    .map(e => e.date.toDateString())
  const activeDays = checkinDates.length > 0 ? new Set(checkinDates).size : 0

  const longestStreak = calculateLongestStreak(
    activeEvents.filter(e => e.type === 'checkin').map(e => e.date)
  )

  const longestGapDays = gapEvents.reduce(
    (max, g) => Math.max(max, g.durationDays ?? 0), 0
  )

  const lastActiveEvent = activeEvents.length > 0
    ? activeEvents[activeEvents.length - 1]
    : null
  const lastEventDescription = lastActiveEvent?.content ?? 'last check-in'

  const milestones = activeEvents.filter(e => e.type === 'milestone').length
  const totalPhasesGuess = Math.max(milestones * 2, 1)  // assume milestones done ~ half
  const completionPercentage = milestones > 0
    ? Math.min(Math.round((milestones / totalPhasesGuess) * 100), 100)
    : 0

  return {
    totalDays,
    activeDays,
    longestStreak,
    longestGapDays,
    lastEventDescription,
    completionPercentage,
  }
}

function calculateLongestStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime())
  let longest = 1
  let current = 1

  for (let i = 1; i < sorted.length; i++) {
    const diffDays = differenceInDays(sorted[i], sorted[i - 1])
    if (diffDays <= 1) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 1
    }
  }

  return longest
}

// ─── Utilities ──────────────────────────────────────────────

function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())  // Sunday as week start
  return d.toISOString().split('T')[0]
}

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 1) + '…'
}

// ─── Demo Data ──────────────────────────────────────────────
// Used when Supabase is unavailable — provides a realistic
// heartbeat experience for development

function generateDemoData(_projectId: string): { events: RingEvent[]; stats: ProjectStats } {
  const now = new Date()
  const events: RingEvent[] = []

  // Simulate a 45-day project with varying activity
  const projectStart = new Date(now.getTime() - 45 * 86400000)

  // First 14 days: daily check-ins (a good streak)
  for (let d = 0; d < 14; d++) {
    events.push({
      type: 'checkin',
      date: new Date(projectStart.getTime() + d * 86400000),
      intensity: 0.3 + Math.random() * 0.5,
      content: d === 0 ? 'project created' : undefined,
    })
  }

  // Day 15: a decision
  events.push({
    type: 'decision',
    date: new Date(projectStart.getTime() + 15 * 86400000),
    intensity: 0.8,
    content: 'Chose React over Vue',
  })

  // Day 18: a milestone
  events.push({
    type: 'milestone',
    date: new Date(projectStart.getTime() + 18 * 86400000),
    intensity: 1.0,
    content: 'MVP complete',
  })

  // Days 19–22: continued check-ins
  for (let d = 19; d <= 22; d++) {
    events.push({
      type: 'checkin',
      date: new Date(projectStart.getTime() + d * 86400000),
      intensity: 0.4 + Math.random() * 0.3,
    })
  }

  // Day 23: a blocker
  events.push({
    type: 'blocker',
    date: new Date(projectStart.getTime() + 23 * 86400000),
    intensity: 0.7,
    content: 'Auth provider API changed',
  })

  // Days 24–26: sparse check-ins
  for (let d = 24; d <= 26; d += 2) {
    events.push({
      type: 'checkin',
      date: new Date(projectStart.getTime() + d * 86400000),
      intensity: 0.3 + Math.random() * 0.2,
    })
  }

  // Days 27–38: ABANDONMENT (long gap — 12 days)
  // This will be auto-detected by detectGaps()

  // Day 39: return
  events.push({
    type: 'checkin',
    date: new Date(projectStart.getTime() + 39 * 86400000),
    intensity: 0.5,
    content: 'picked it back up',
  })

  // Days 40–42: daily check-ins
  for (let d = 40; d <= 42; d++) {
    events.push({
      type: 'checkin',
      date: new Date(projectStart.getTime() + d * 86400000),
      intensity: 0.4 + Math.random() * 0.4,
    })
  }

  // Day 43: another milestone
  events.push({
    type: 'milestone',
    date: new Date(projectStart.getTime() + 43 * 86400000),
    intensity: 1.0,
    content: 'Beta shipped',
  })

  // Day 44: recent check-in
  events.push({
    type: 'checkin',
    date: new Date(projectStart.getTime() + 44 * 86400000),
    intensity: 0.6,
  })

  // Sort and process
  events.sort((a, b) => a.date.getTime() - b.date.getTime())
  const processedEvents = detectGaps(events)
  const stats = calculateStats(processedEvents, 'Demo Project', projectStart)

  return { events: processedEvents, stats }
}