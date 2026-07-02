import { getClient } from '../supabase/client'
import type { CheckinRow } from '../supabase/database.types'

// ── Public types ─────────────────────────────────────────────────────────────

export interface InboxItem {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  sourceType: 'vault_entry' | 'timeline_event'
}

export interface Snapshot {
  id: string
  date: Date
  status: string
  progress: number
}

export interface HubData {
  momentumScore: number
  streak: number
  inboxItems: InboxItem[]
  snapshots: Snapshot[]
}

// ── Pure computation helpers ──────────────────────────────────────────────────

/**
 * Computes a recency-weighted momentum score in [0, 100] from the last 7 days
 * of checkins. More recent days are weighted more heavily (day 7 weight = 7,
 * day 1 weight = 1). A fully active week (checkin every day) scores 100.
 */
export function computeMomentumScore(checkins: CheckinRow[]): number {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000)

  // Build a set of checkin date strings for the last 7 days
  const recent = checkins.filter(
    (c) => new Date(c.checkin_date) >= sevenDaysAgo,
  )

  if (recent.length === 0) return 0

  // Each of the 7 days gets a weight of day-index (1–7, where 7 = today)
  let weighted = 0
  const maxWeight = 7 + 6 + 5 + 4 + 3 + 2 + 1 // = 28

  for (const c of recent) {
    const daysAgo = Math.round(
      (now.getTime() - new Date(c.checkin_date).getTime()) / 86400000,
    )
    const weight = Math.max(8 - daysAgo, 1) // today=7, yesterday=6, …, 7 days ago=1
    weighted += weight
  }

  return Math.min(Math.round((weighted / maxWeight) * 100), 100)
}

/**
 * Returns the number of consecutive calendar days with at least one checkin,
 * ending at (or including) today.
 */
export function computeStreak(checkins: CheckinRow[]): number {
  if (checkins.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Unique sorted dates (descending)
  const dates = Array.from(
    new Set(checkins.map((c) => c.checkin_date)),
  )
    .map((d) => {
      const date = new Date(d)
      date.setHours(0, 0, 0, 0)
      return date
    })
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
  let expected = today

  for (const date of dates) {
    const diffDays = Math.round(
      (expected.getTime() - date.getTime()) / 86400000,
    )
    if (diffDays === 0 || diffDays === 1) {
      streak++
      expected = date
    } else {
      break
    }
  }

  return streak
}

// ── Service ───────────────────────────────────────────────────────────────────

export async function fetchHubData(projectId: string): Promise<HubData> {
  const client = getClient()

  if (!client) {
    // Demo fallback
    return {
      momentumScore: 72,
      streak: 3,
      inboxItems: [
        {
          id: 'demo-1',
          title: 'Review waitlist email template',
          description: 'Action required: implement email capture',
          priority: 'high',
          createdAt: new Date(),
          sourceType: 'vault_entry',
        },
      ],
      snapshots: [
        {
          id: 'demo-snap-1',
          date: new Date(),
          status: 'Demo Mode',
          progress: 65,
        },
      ],
    }
  }

  const [checkinsResult, inboxResult, snapshotsResult] = await Promise.all([
    client
      .from('checkins')
      .select('checkin_date, ai_summary, created_at')
      .eq('project_id', projectId)
      .order('checkin_date', { ascending: false })
      .limit(60),
    client
      .from('vault_entries')
      .select('id, title, content, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(10),
    client
      .from('recovery_workspaces')
      .select('id, last_updated, suggested_next_action')
      .eq('project_id', projectId)
      .order('last_updated', { ascending: false })
      .limit(5),
  ])

  const checkins = (checkinsResult.data ?? []) as CheckinRow[]
  const momentumScore = computeMomentumScore(checkins)
  const streak = computeStreak(checkins)

  const inboxItems: InboxItem[] = (
    (inboxResult.data ?? []) as Array<{
      id: string
      title: string
      content: string | null
      created_at: string
    }>
  ).map((entry, i) => ({
    id: entry.id,
    title: entry.title,
    description: entry.content ?? '',
    priority: (['high', 'medium', 'low'] as const)[i % 3],
    createdAt: new Date(entry.created_at),
    sourceType: 'vault_entry' as const,
  }))

  const snapshots: Snapshot[] = (
    (snapshotsResult.data ?? []) as Array<{
      id: string
      last_updated: string
      suggested_next_action: string | null
    }>
  ).map((ws) => ({
    id: ws.id,
    date: new Date(ws.last_updated),
    status: ws.suggested_next_action ?? 'Snapshot',
    progress: 0,
  }))

  return { momentumScore, streak, inboxItems, snapshots }
}
