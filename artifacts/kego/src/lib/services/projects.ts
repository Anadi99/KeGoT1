import { getClient } from '../supabase/client'
import type { ProjectRow } from '../supabase/database.types'
import type { Project, RecoveryRecommendation } from '../types'
import { mockProjects } from '../mock-data'

// ── Mapper ──────────────────────────────────────────────────────────────────

export function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    resumeScore: row.resume_score,
    recoveryConfidence: row.recovery_confidence,
    health: (row.health as Project['health']) ?? 'active',
    contextCompleteness: row.context_completeness,
    lastActivity: new Date(row.last_activity),
    createdAt: new Date(row.created_at),
    pausedAt: row.paused_at ? new Date(row.paused_at) : undefined,
    resumedAt: row.resumed_at ? new Date(row.resumed_at) : undefined,
    tags: row.tags ?? [],
    daysSincePause: row.paused_at
      ? Math.floor((Date.now() - new Date(row.paused_at).getTime()) / 86400000)
      : undefined,
  }
}

// ── Sort helper ──────────────────────────────────────────────────────────────

export function sortByLastActivity(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
}

// ── Dashboard pure helpers ───────────────────────────────────────────────────

export interface DashboardStats {
  total: number
  healthy: number
  atRisk: number
  recommendations: RecoveryRecommendation[]
}

export function deriveRecommendations(projects: Project[]): RecoveryRecommendation[] {
  const atRiskHealthValues: Project['health'][] = ['at-risk', 'stalled', 'dormant']

  const urgentProjects = projects
    .filter((p) => atRiskHealthValues.includes(p.health))
    // oldest activity first = most urgent
    .sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime())

  return urgentProjects.map((p): RecoveryRecommendation => {
    let reason: RecoveryRecommendation['reason']
    if (p.health === 'at-risk') {
      reason = 'at-risk'
    } else if (p.health === 'stalled') {
      reason = 'momentum-opportunity'
    } else {
      // dormant
      reason = 'at-risk'
    }

    let priority: RecoveryRecommendation['priority']
    if (p.resumeScore >= 70) {
      priority = 'high'
    } else if (p.resumeScore >= 40) {
      priority = 'medium'
    } else {
      priority = 'low'
    }

    const daysSince = p.daysSincePause ?? Math.floor(
      (Date.now() - p.lastActivity.getTime()) / 86400000
    )
    const explanation =
      p.health === 'dormant'
        ? `No activity in ${daysSince} days. This project is at risk of being forgotten completely.`
        : p.health === 'stalled'
        ? `Project has been stalled for ${daysSince} days. Recover momentum before context is lost.`
        : `Project is at risk after ${daysSince} days of inactivity.`

    return {
      projectId: p.id,
      projectName: p.name,
      reason,
      explanation,
      priority,
    }
  })
}

export function computeDashboardStats(projects: Project[]): DashboardStats {
  const healthyValues: Project['health'][] = ['healthy', 'active']
  const atRiskValues: Project['health'][] = ['at-risk', 'stalled', 'dormant']

  const healthy = projects.filter((p) => healthyValues.includes(p.health)).length
  const atRisk = projects.filter((p) => atRiskValues.includes(p.health)).length
  const recommendations = deriveRecommendations(projects)

  return {
    total: projects.length,
    healthy,
    atRisk,
    recommendations,
  }
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export async function fetchProjects(): Promise<Project[]> {
  const client = getClient()
  if (!client) return sortByLastActivity(mockProjects)

  const { data, error } = await client
    .from('projects')
    .select('*')
    .order('last_activity', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as ProjectRow[]).map(rowToProject)
}

export async function createProject(name: string, description?: string): Promise<Project> {
  const client = getClient()
  if (!client) {
    // Return a mock project in fallback mode
    const mock: Project = {
      id: crypto.randomUUID(),
      name,
      description: description ?? '',
      resumeScore: 0,
      recoveryConfidence: 0,
      health: 'active',
      contextCompleteness: 0,
      lastActivity: new Date(),
      createdAt: new Date(),
      tags: [],
    }
    return mock
  }

  const { data, error } = await client
    .from('projects')
    .insert({ name, description, health: 'active' })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return rowToProject(data as ProjectRow)
}

export async function updateProject(id: string, patch: Partial<ProjectRow>): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client.from('projects').update(patch).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteProject(id: string): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ── Mark / Resume ────────────────────────────────────────────────────────────

export async function markProject(id: string): Promise<void> {
  const client = getClient()
  if (!client) return

  const now = new Date().toISOString()

  // Update project health and paused_at
  await updateProject(id, {
    paused_at: now,
    health: 'at-risk',
    last_activity: now,
  })

  // Create timeline event
  const { error } = await client.from('timeline_events').insert({
    project_id: id,
    type: 'paused',
    title: 'Project marked',
    description: 'Context preserved for future resumption',
    timestamp: now,
  })
  if (error) throw new Error(error.message)
}

export async function resumeProject(id: string): Promise<void> {
  const client = getClient()
  if (!client) return

  const now = new Date().toISOString()

  await updateProject(id, {
    resumed_at: now,
    health: 'recovering',
    last_activity: now,
  })

  const { error } = await client.from('timeline_events').insert({
    project_id: id,
    type: 'resumed',
    title: 'Project resumed',
    description: 'Recovery in progress',
    timestamp: now,
  })
  if (error) throw new Error(error.message)
}
