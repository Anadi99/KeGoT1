import { getClient } from '../supabase/client'
import type { RecoveryWorkspaceRow } from '../supabase/database.types'
import type { RecoveryWorkspace } from '../types'
import { mockRecoveryWorkspace } from '../mock-data'

function rowToRecoveryWorkspace(row: RecoveryWorkspaceRow): RecoveryWorkspace {
  return {
    projectId: row.project_id,
    projectSummary: row.project_summary ?? '',
    completedWork: row.completed_work ?? '',
    pendingWork: row.pending_work ?? '',
    blockers: row.blockers ?? '',
    importantDecisions: row.important_decisions ?? '',
    importantResources: row.important_resources ?? '',
    suggestedNextAction: row.suggested_next_action ?? '',
    estimatedTimeToResume: row.estimated_time_to_resume ?? '',
    lastUpdated: new Date(row.last_updated),
  }
}

function generateDefaultWorkspace(projectId: string): RecoveryWorkspace {
  return {
    projectId,
    projectSummary: 'No summary available yet. Add one to help with future recovery.',
    completedWork: '',
    pendingWork: '',
    blockers: '',
    importantDecisions: '',
    importantResources: '',
    suggestedNextAction: 'Start by adding a project summary and listing completed work.',
    estimatedTimeToResume: 'Unknown',
    lastUpdated: new Date(),
  }
}

export async function fetchRecoveryWorkspace(projectId: string): Promise<RecoveryWorkspace> {
  const client = getClient()
  if (!client) return mockRecoveryWorkspace

  const { data, error } = await client
    .from('recovery_workspaces')
    .select('*')
    .eq('project_id', projectId)
    .single()

  if (error) {
    // PGRST116 = no rows returned — generate and insert a default
    if ((error as { code?: string }).code === 'PGRST116') {
      const defaultWorkspace = generateDefaultWorkspace(projectId)
      await upsertRecoveryWorkspace(defaultWorkspace)
      return defaultWorkspace
    }
    throw new Error(error.message)
  }

  return rowToRecoveryWorkspace(data as RecoveryWorkspaceRow)
}

export async function upsertRecoveryWorkspace(
  workspace: Partial<RecoveryWorkspace> & { projectId: string },
): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client
    .from('recovery_workspaces')
    .upsert(
      {
        project_id: workspace.projectId,
        project_summary: workspace.projectSummary,
        completed_work: workspace.completedWork,
        pending_work: workspace.pendingWork,
        blockers: workspace.blockers,
        important_decisions: workspace.importantDecisions,
        important_resources: workspace.importantResources,
        suggested_next_action: workspace.suggestedNextAction,
        estimated_time_to_resume: workspace.estimatedTimeToResume,
        last_updated: new Date().toISOString(),
      },
      { onConflict: 'project_id' },
    )

  if (error) throw new Error(error.message)
}
