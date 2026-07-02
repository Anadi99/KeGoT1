import { getClient } from '../supabase/client'
import type { VaultEntryRow, DecisionRow, MilestoneRow, TimelineEventRow } from '../supabase/database.types'
import type { VaultEntry, Decision, Milestone, TimelineEvent } from '../types'
import { mockVaultEntries, mockDecisions, mockMilestones, mockTimelineEvents } from '../mock-data'

// ── Inline sediment fragment type (avoids circular imports) ──────────────────

export interface SedimentFragment {
  id: string
  type: string
  content: string
  createdAt: Date
  weight: 'heavy' | 'medium' | 'light'
}

// ── Mappers ──────────────────────────────────────────────────────────────────

export function rowToVaultEntry(row: VaultEntryRow): VaultEntry {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    content: row.content ?? '',
    category: row.category as VaultEntry['category'],
    tags: row.tags ?? [],
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export function rowToDecision(row: DecisionRow): Decision {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description ?? '',
    rationale: row.rationale ?? '',
    alternatives: row.alternatives ?? [],
    consequences: row.consequences ?? '',
    relatedResources: [],
    linkedMilestones: [],
    madeAt: new Date(row.decided_at),
    updatedAt: new Date(row.created_at),
  }
}

export function rowToMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    description: row.description ?? '',
    status: row.status as Milestone['status'],
    percentComplete: row.percent_complete,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    dueDate: row.due_date ? new Date(row.due_date) : undefined,
    linkedDecisions: [],
  }
}

export function rowToTimelineEvent(row: TimelineEventRow): TimelineEvent {
  return {
    id: row.id,
    projectId: row.project_id,
    type: row.type as TimelineEvent['type'],
    title: row.title,
    description: row.description ?? '',
    timestamp: new Date(row.timestamp),
  }
}

// ── buildSedimentMemories ────────────────────────────────────────────────────

const SEDIMENT_EVENT_TYPES = new Set([
  'decision',
  'milestone',
  'paused',
  'resumed',
  'github:commit',
])

export function buildSedimentMemories(
  decisions: Decision[],
  milestones: Milestone[],
  vaultEntries: VaultEntry[],
  timelineEvents: TimelineEvent[],
): SedimentFragment[] {
  const fragments: SedimentFragment[] = []

  // Decisions → heavy
  for (const d of decisions) {
    fragments.push({
      id: d.id,
      type: 'decision',
      content: d.title,
      createdAt: d.madeAt,
      weight: 'heavy',
    })
  }

  // Milestones → heavy
  for (const m of milestones) {
    fragments.push({
      id: m.id,
      type: 'milestone',
      content: m.title,
      createdAt: m.completedAt ?? new Date(0),
      weight: 'heavy',
    })
  }

  // Vault entries → medium, type based on category
  for (const v of vaultEntries) {
    fragments.push({
      id: v.id,
      type: v.category,
      content: v.content,
      createdAt: v.createdAt,
      weight: 'medium',
    })
  }

  // Relevant timeline events → medium
  for (const e of timelineEvents) {
    if (!SEDIMENT_EVENT_TYPES.has(e.type)) continue
    const type = e.type === 'github:commit' ? 'commit' : 'checkin'
    fragments.push({
      id: e.id,
      type,
      content: e.title,
      createdAt: e.timestamp,
      weight: 'medium',
    })
  }

  // Sort descending by createdAt, return top 12
  fragments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  return fragments.slice(0, 12)
}

// ── Vault Entries CRUD ───────────────────────────────────────────────────────

export async function fetchVaultEntries(projectId: string): Promise<VaultEntry[]> {
  const client = getClient()
  if (!client) return mockVaultEntries.filter((v) => v.projectId === projectId)

  const { data, error } = await client
    .from('vault_entries')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as VaultEntryRow[]).map(rowToVaultEntry)
}

export async function createVaultEntry(entry: {
  projectId: string
  title: string
  content: string
  category: string
  tags: string[]
}): Promise<VaultEntry> {
  const client = getClient()
  if (!client) {
    // Mock fallback
    const mock: VaultEntry = {
      id: crypto.randomUUID(),
      projectId: entry.projectId,
      title: entry.title,
      content: entry.content,
      category: entry.category as VaultEntry['category'],
      tags: entry.tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return mock
  }

  const { data, error } = await client
    .from('vault_entries')
    .insert({
      project_id: entry.projectId,
      title: entry.title,
      content: entry.content,
      category: entry.category,
      tags: entry.tags,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return rowToVaultEntry(data as VaultEntryRow)
}

export async function updateVaultEntry(
  id: string,
  patch: { title?: string; content?: string; category?: string; tags?: string[] },
): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client
    .from('vault_entries')
    .update({
      ...(patch.title !== undefined && { title: patch.title }),
      ...(patch.content !== undefined && { content: patch.content }),
      ...(patch.category !== undefined && { category: patch.category }),
      ...(patch.tags !== undefined && { tags: patch.tags }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export async function deleteVaultEntry(id: string): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client.from('vault_entries').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ── Decisions ────────────────────────────────────────────────────────────────

export async function fetchDecisions(projectId: string): Promise<Decision[]> {
  const client = getClient()
  if (!client) return mockDecisions.filter((d) => d.projectId === projectId)

  const { data, error } = await client
    .from('decisions')
    .select('*')
    .eq('project_id', projectId)
    .order('decided_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as DecisionRow[]).map(rowToDecision)
}

export async function createDecision(decision: {
  projectId: string
  title: string
  description?: string
  rationale?: string
  alternatives?: string[]
}): Promise<Decision> {
  const client = getClient()
  if (!client) {
    const now = new Date()
    const mock: Decision = {
      id: crypto.randomUUID(),
      projectId: decision.projectId,
      title: decision.title,
      description: decision.description ?? '',
      rationale: decision.rationale ?? '',
      alternatives: decision.alternatives ?? [],
      relatedResources: [],
      linkedMilestones: [],
      madeAt: now,
      updatedAt: now,
    }
    return mock
  }

  const { data, error } = await client
    .from('decisions')
    .insert({
      project_id: decision.projectId,
      title: decision.title,
      description: decision.description,
      rationale: decision.rationale,
      alternatives: decision.alternatives ?? [],
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return rowToDecision(data as DecisionRow)
}

// ── Milestones ───────────────────────────────────────────────────────────────

export async function fetchMilestones(projectId: string): Promise<Milestone[]> {
  const client = getClient()
  if (!client) return mockMilestones.filter((m) => m.projectId === projectId)

  const { data, error } = await client
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as MilestoneRow[]).map(rowToMilestone)
}

export async function updateMilestone(
  id: string,
  patch: { status?: string; percentComplete?: number },
): Promise<void> {
  const client = getClient()
  if (!client) return

  const update: Record<string, unknown> = {}

  if (patch.status !== undefined) {
    update.status = patch.status
    if (patch.status === 'completed') {
      update.completed_at = new Date().toISOString()
    }
  }

  if (patch.percentComplete !== undefined) {
    update.percent_complete = patch.percentComplete
  }

  const { error } = await client.from('milestones').update(update).eq('id', id)
  if (error) throw new Error(error.message)
}

// ── Timeline Events ──────────────────────────────────────────────────────────

export async function fetchTimelineEvents(projectId: string): Promise<TimelineEvent[]> {
  const client = getClient()
  if (!client) return mockTimelineEvents.filter((e) => e.projectId === projectId)

  const { data, error } = await client
    .from('timeline_events')
    .select('*')
    .eq('project_id', projectId)
    .order('timestamp', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as TimelineEventRow[]).map(rowToTimelineEvent)
}

export async function createTimelineEvent(event: {
  projectId: string
  type: string
  title: string
  description?: string
  timestamp?: string
}): Promise<TimelineEvent> {
  const client = getClient()
  if (!client) {
    const mock: TimelineEvent = {
      id: crypto.randomUUID(),
      projectId: event.projectId,
      type: event.type as TimelineEvent['type'],
      title: event.title,
      description: event.description ?? '',
      timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
    }
    return mock
  }

  const { data, error } = await client
    .from('timeline_events')
    .insert({
      project_id: event.projectId,
      type: event.type,
      title: event.title,
      description: event.description,
      timestamp: event.timestamp ?? new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return rowToTimelineEvent(data as TimelineEventRow)
}
