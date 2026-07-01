/**
 * Heartbeat Engine — The Brain
 *
 * Converts raw project events into an 8000ms HeartbeatSequence.
 * Timeline compression, ring sizing, gap mapping, overlap handling,
 * and sentence generation all happen here.
 */

import type { RingEvent, RingConfig, HeartbeatSequence, ProjectStats } from './heartbeatTypes'

// ─── Constants ──────────────────────────────────────────────

const TOTAL_DURATION_MS = 8000
const ACTIVE_MS = 7200  // last 800ms reserved for sentence transition
const SAME_DAY_STAGGER_MS = 80
const MAX_SAME_DAY_RINGS = 4
const MAX_VISIBLE_RINGS = 50

// ─── Ring Colors ────────────────────────────────────────────

const COLOR_PURPLE = '#5B47E0'   // the life color
const COLOR_GREEN = '#16A34A'    // completion color
const COLOR_AMBER = '#FFB800'    // warning color
const COLOR_GHOST = 'rgba(13, 13, 18, 0.08)'

// ─── Helpers ────────────────────────────────────────────────

function differenceInDays(a: Date, b: Date): number {
  const msPerDay = 86400000
  return Math.round((a.getTime() - b.getTime()) / msPerDay)
}

function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime())
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

// ─── Main Function ──────────────────────────────────────────

export function generateHeartbeatSequence(
  events: RingEvent[],
  screenRadius: number,
  projectName: string
): HeartbeatSequence {

  // STEP 1: Sort and validate
  const validEvents = events
    .filter(e => isValidDate(e.date))
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  if (validEvents.length === 0) {
    return buildEmptySequence(projectName, screenRadius)
  }

  const projectStart = validEvents[0].date
  const now = new Date()
  const lifespanDays = Math.max(differenceInDays(now, projectStart), 1)

  // STEP 4: Calculate gap time proportion
  const gapEvents = validEvents.filter(e => e.type === 'gap' || e.type === 'abandonment')
  const totalGapDays = gapEvents.reduce((sum, e) => sum + (e.durationDays ?? 0), 0)
  const gapRatio = clamp(totalGapDays / lifespanDays, 0, 0.5)
  // Cap gap ratio at 50% so the sequence never becomes entirely silence

  const totalGapSequenceMs = Math.min(ACTIVE_MS * gapRatio, ACTIVE_MS * 0.5)
  const totalActiveSequenceMs = ACTIVE_MS - totalGapSequenceMs

  // STEP 2: Build merged timeline (gaps + active events in chronological order)
  const gapsInSequence = gapEvents.sort((a, b) => a.date.getTime() - b.date.getTime())
  const activeInSequence = validEvents
    .filter(e => e.type !== 'gap' && e.type !== 'abandonment')
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  type MergedEntry = { event: RingEvent; isGap: boolean }
  const merged: MergedEntry[] = []
  let gi = 0
  let ai = 0

  while (gi < gapsInSequence.length || ai < activeInSequence.length) {
    const gap = gi < gapsInSequence.length ? gapsInSequence[gi] : null
    const active = ai < activeInSequence.length ? activeInSequence[ai] : null

    if (gap && (!active || gap.date <= active.date)) {
      merged.push({ event: gap, isGap: true })
      gi++
    } else if (active) {
      merged.push({ event: active, isGap: false })
      ai++
    }
  }

  // Assign sequence times
  // Each gap consumes time proportional to its duration
  // Active events fill remaining time proportionally
  const finalRings: RingConfig[] = []
  let seqTimeMs = 0
  const activeDaySpan = Math.max(lifespanDays - totalGapDays, 1)

  for (let i = 0; i < merged.length; i++) {
    const entry = merged[i]

    if (entry.isGap) {
      const gapDuration = totalGapSequenceMs * clamp(
        (entry.event.durationDays ?? 0) / Math.max(totalGapDays, 1),
        0, 1
      )
      finalRings.push(buildGapRingConfig(
        entry.event,
        Math.round(seqTimeMs),
        Math.round(gapDuration),
        screenRadius
      ))
      seqTimeMs += Math.max(gapDuration, 0)
    } else {
      // Place active event at current time position
      finalRings.push(buildActiveRingConfig(
        entry.event,
        Math.round(seqTimeMs),
        screenRadius
      ))

      // Advance time pointer — minimum spacing between consecutive active events
      if (i + 1 < merged.length && !merged[i + 1].isGap) {
        seqTimeMs += SAME_DAY_STAGGER_MS
      }
    }
  }

  // STEP 3: Handle same-day overlaps (stagger)
  const ringsByTime = new Map<number, RingConfig[]>()
  for (const ring of finalRings) {
    if (!ring.isGap) {
      const key = ring.startTimeMs
      const existing = ringsByTime.get(key) ?? []
      existing.push(ring)
      ringsByTime.set(key, existing)
    }
  }

  const staggeredRings: RingConfig[] = []
  for (const ring of finalRings) {
    if (ring.isGap) {
      staggeredRings.push(ring)
      continue
    }
    const sameTimeRings = ringsByTime.get(ring.startTimeMs) ?? [ring]
    const idx = sameTimeRings.indexOf(ring)
    if (sameTimeRings.length > 1) {
      // Stagger same-time rings
      const staggerOffset = Math.min(idx, MAX_SAME_DAY_RINGS - 1) * SAME_DAY_STAGGER_MS
      const staggered = { ...ring, startTimeMs: ring.startTimeMs + staggerOffset }
      // Discard lowest intensity if more than max
      if (idx < MAX_SAME_DAY_RINGS) {
        staggeredRings.push(staggered)
      }
    } else {
      staggeredRings.push(ring)
    }
  }

  // Cap at MAX_VISIBLE_RINGS — keep highest intensity non-gap rings
  const visibleRings = staggeredRings.length > MAX_VISIBLE_RINGS
    ? staggeredRings
        .filter(r => r.isGap)  // always keep gaps
        .concat(
          staggeredRings
            .filter(r => !r.isGap)
            .sort((a, b) => b.event.intensity - a.event.intensity)
            .slice(0, MAX_VISIBLE_RINGS - staggeredRings.filter(r => r.isGap).length)
        )
        .sort((a, b) => a.startTimeMs - b.startTimeMs)
    : staggeredRings

  // Re-normalize all times to fit within 0–7200ms
  const maxTime = visibleRings.reduce((max, r) => {
    const end = r.isGap
      ? r.startTimeMs + (r.gapDurationMs ?? 0)
      : r.startTimeMs + r.expandDurationMs
    return Math.max(max, end)
  }, 0)

  const normalisedRings = [...visibleRings]
  if (maxTime > ACTIVE_MS) {
    const scale = ACTIVE_MS / maxTime
    for (const ring of normalisedRings) {
      ring.startTimeMs = Math.round(ring.startTimeMs * scale)
      if (ring.gapDurationMs) {
        ring.gapDurationMs = Math.round(ring.gapDurationMs * scale)
      }
    }
  }

  // STEP 6: Calculate project stats and sentence
  const stats = calculateProjectStats(events, projectName)
  const sentence = generateCompletionSentence(stats, projectName)

  return {
    rings: normalisedRings.sort((a, b) => a.startTimeMs - b.startTimeMs),
    totalDurationMs: TOTAL_DURATION_MS,
    completionSentence: sentence,
    projectStats: stats,
  }
}

// ─── Ring Config Builders ───────────────────────────────────

function buildActiveRingConfig(
  event: RingEvent,
  startTimeMs: number,
  screenRadius: number
): RingConfig {
  const style = getRingStyle(event, screenRadius)
  return {
    event,
    startTimeMs,
    expandDurationMs: style.expandDurationMs,
    maxRadius: style.maxRadius,
    strokeWidth: style.strokeWidth,
    color: style.color,
    opacity: style.opacity,
    isGap: false,
  }
}

function buildGapRingConfig(
  event: RingEvent,
  startTimeMs: number,
  gapDurationMs: number,
  _screenRadius: number
): RingConfig {
  return {
    event,
    startTimeMs,
    expandDurationMs: 0,
    maxRadius: 0,
    strokeWidth: 0,
    color: COLOR_GHOST,
    opacity: 0,
    isGap: true,
    hasCollapsingRing: event.type === 'abandonment',
    gapDurationMs: Math.max(Math.round(gapDurationMs), 0),
  }
}

// ─── Ring Style Map ─────────────────────────────────────────

function getRingStyle(
  event: RingEvent,
  screenRadius: number
): { maxRadius: number; strokeWidth: number; expandDurationMs: number; color: string; opacity: number } {
  switch (event.type) {
    case 'checkin':
      return {
        maxRadius: screenRadius * (0.15 + event.intensity * 0.25),
        strokeWidth: 1.5,
        expandDurationMs: 600,
        color: COLOR_PURPLE,
        opacity: 0.35 + event.intensity * 0.25,
      }
    case 'decision':
      return {
        maxRadius: screenRadius * (0.35 + event.intensity * 0.20),
        strokeWidth: 2.5,
        expandDurationMs: 900,
        color: COLOR_PURPLE,
        opacity: 0.55 + event.intensity * 0.20,
      }
    case 'milestone':
      return {
        maxRadius: screenRadius * (0.55 + event.intensity * 0.25),
        strokeWidth: 3.5,
        expandDurationMs: 1200,
        color: COLOR_GREEN,
        opacity: 0.70,
      }
    case 'blocker':
      return {
        maxRadius: screenRadius * (0.25 + event.intensity * 0.15),
        strokeWidth: 2.0,
        expandDurationMs: 700,
        color: COLOR_AMBER,
        opacity: 0.45 + event.intensity * 0.15,
      }
    case 'commit':
      return {
        maxRadius: screenRadius * (0.12 + event.intensity * 0.18),
        strokeWidth: 1.0,
        expandDurationMs: 450,
        color: COLOR_PURPLE,
        opacity: 0.25,
      }
    default:
      return {
        maxRadius: screenRadius * 0.1,
        strokeWidth: 1.0,
        expandDurationMs: 400,
        color: COLOR_PURPLE,
        opacity: 0.2,
      }
  }
}

// ─── Project Stats ──────────────────────────────────────────

function calculateProjectStats(
  events: RingEvent[],
  _projectName: string
): ProjectStats {
  const activeEvents = events.filter(e => e.type !== 'gap' && e.type !== 'abandonment')
  const gapEvents = events.filter(e => e.type === 'gap' || e.type === 'abandonment')

  const sortedDates = activeEvents.map(e => e.date).sort((a, b) => a.getTime() - b.getTime())
  const projectStart = sortedDates[0] ?? new Date()
  const totalDays = Math.max(differenceInDays(new Date(), projectStart), 1)

  // Count unique check-in dates as active days
  const checkinDates = activeEvents
    .filter(e => e.type === 'checkin')
    .map(e => e.date.toDateString())

  const activeDays = checkinDates.length > 0
    ? new Set(checkinDates).size
    : (activeEvents.length > 0 ? 1 : 0)

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

  // Completion percentage: ratio of milestones to total expected phases
  const milestones = activeEvents.filter(e => e.type === 'milestone').length
  const checkinCount = activeEvents.filter(e => e.type === 'checkin').length
  const completionPercentage = milestones > 0
    ? Math.min(Math.round((milestones / Math.max(checkinCount * 0.1, 1)) * 100), 100)
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

// ─── Longest Streak ────────────────────────────────────────

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

// ─── Sentence Generation ────────────────────────────────────

function generateCompletionSentence(stats: ProjectStats, projectName: string): string {
  const {
    longestGapDays,
    completionPercentage,
    longestStreak,
    activeDays,
    totalDays,
    lastEventDescription,
  } = stats

  if (longestGapDays > 60) {
    return `${longestGapDays} days of silence.\n${projectName} is still waiting.`
  }
  if (completionPercentage >= 80) {
    return `${completionPercentage}% complete.\nYou are almost there.`
  }
  if (longestStreak >= 14) {
    return `${longestStreak} days straight was your best.\nThat was real.`
  }
  if (activeDays === 0) {
    return `You thought about this.\nThat matters too.`
  }
  if (longestGapDays > totalDays * 0.5) {
    return `More time away than building.\nToday could change that.`
  }

  return `${activeDays} days of real work.\n${lastEventDescription}.`
}

// ─── Empty Sequence (no events) ─────────────────────────────

function buildEmptySequence(projectName: string, screenRadius: number): HeartbeatSequence {
  const ghostRing: RingConfig = {
    event: {
      type: 'checkin',
      date: new Date(),
      intensity: 0.1,
      content: 'project created',
    },
    startTimeMs: 800,
    expandDurationMs: 600,
    maxRadius: screenRadius * 0.1,
    strokeWidth: 1.0,
    color: COLOR_PURPLE,
    opacity: 0.15,
    isGap: false,
  }

  const gapRing: RingConfig = {
    event: {
      type: 'abandonment',
      date: new Date(),
      durationDays: 1,
      intensity: 0.3,
    },
    startTimeMs: 2000,
    expandDurationMs: 0,
    maxRadius: 0,
    strokeWidth: 0,
    color: COLOR_GHOST,
    opacity: 0,
    isGap: true,
    hasCollapsingRing: true,
    gapDurationMs: 3000,
  }

  return {
    rings: [ghostRing, gapRing],
    totalDurationMs: TOTAL_DURATION_MS,
    completionSentence: `You thought about this.\nThat matters too.`,
    projectStats: {
      totalDays: 1,
      activeDays: 0,
      longestStreak: 0,
      longestGapDays: 0,
      lastEventDescription: 'project created',
      completionPercentage: 0,
    },
  }
}